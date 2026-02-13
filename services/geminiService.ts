import { GoogleGenAI } from "@google/genai";
import { CloudConfig } from "../types";

export const generateLatexFromPdf = async (
  pdfBase64: string,
  cloudConfig: CloudConfig,
  onProgress: (msg: string) => void
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing via process.env.API_KEY");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Model selection: gemini-3-pro-preview is best for complex document reasoning
  const modelId = "gemini-3-pro-preview";

  let imagePromptPart = "";
  
  if (cloudConfig.provider !== 'none' && cloudConfig.publicUrlPrefix) {
    imagePromptPart = `
    CRITICAL INSTRUCTION FOR IMAGES:
    I have uploaded the images from this PDF to a cloud host at "${cloudConfig.publicUrlPrefix}".
    When you encounter an image, graph, or diagram in the PDF that cannot be represented by code (like TikZ), 
    you MUST use the \`\\includegraphics\` command.
    
    Naming Convention:
    Assume the images are named sequentially: "image_01.png", "image_02.png", etc.
    
    Example:
    \\begin{figure}[h]
      \\centering
      \\includegraphics[width=0.8\\linewidth]{${cloudConfig.publicUrlPrefix}/image_01.png}
      \\caption{Description of the image}
    \\end{figure}
    `;
  } else {
    imagePromptPart = `
    For images, graphs, or circuits:
    1. If it is a circuit or simple diagram, TRY to generate valid TikZ code to replicate it.
    2. If it is a complex photo, use a placeholder comment like % [IMAGE_PLACEHOLDER: Description]
    `;
  }

  const prompt = `
  You are an expert academic typesetter and LaTeX engineer. 
  Your task is to convert the attached PDF document into high-quality, compilable LaTeX code.

  Directives:
  1. **Full Document**: Generate a complete LaTeX document starting with \\documentclass{article} and ending with \\end{document}.
  2. **Packages**: Include all necessary packages (amsmath, graphicx, tikz, circuitikz, float, hyperref, etc.) in the preamble.
  3. **Structure**: Preserve sections, subsections, lists, and text formatting.
  4. **Math**: Convert all mathematical equations into proper LaTeX math mode ($...$ or $$...$$).
  5. **Tables**: Convert tables into proper LaTeX \\begin{table} environments.
  
  ${imagePromptPart}

  Output ONLY the raw LaTeX code. Do not use Markdown code blocks (like \`\`\`latex). Just the raw code.
  `;

  onProgress("Sending PDF to Gemini 3.0 Pro...");

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "application/pdf",
              data: pdfBase64
            }
          },
          {
            text: prompt
          }
        ]
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response generated");

    // Clean up if the model accidentally wrapped it in markdown
    const cleanText = text.replace(/^```latex\n/, '').replace(/^```\n/, '').replace(/\n```$/, '');
    
    return cleanText;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};