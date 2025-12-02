import { GoogleGenAI, Type } from "@google/genai";
import { GenAIStoryResponse, StoryPage, StoryContext } from "../types";

// Initialize Gemini Client
// IMPORTANT: Relies on process.env.API_KEY being injected by the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const TEXT_MODEL = "gemini-2.5-flash";
const IMAGE_MODEL = "gemini-2.5-flash-image"; // "Nano Banana"

const BASE_SYSTEM_INSTRUCTION = `
You are a master comic book writer and director. 
Your goal is to generate the next "Panel" of a continuous graphic novel.

RULES:
1. NARRATIVE: Keep captions punchy, atmospheric, and brief (under 50 words). Move the plot forward significantly.
2. VISUAL DESCRIPTION (CRITICAL): You are the cinematographer. 
   - You MUST specify a CAMERA ANGLE (e.g., "Extreme Close-up", "Bird's eye view", "Low angle", "Over-the-shoulder").
   - You MUST describe the ACTION. What is the character DOING right now? (e.g., "Lighting a cigarette," "Running down a rainy alley," "Punching a demon").
   - Do NOT just describe the character's appearance again. Describe the SCENE and the MOMENT.
   - Include lighting and color mood specific to this scene (e.g., "Bathed in harsh neon red light").
3. CHOICES: Provide 2 distinct choices that will lead to different visual outcomes.
`;

export const generateStorySegment = async (
  history: StoryPage[],
  lastChoice: string,
  context: StoryContext
): Promise<GenAIStoryResponse> => {
  try {
    // Construct context from history with better formatting
    const historyText = history.map((page, index) => {
      return `[PANEL ${index + 1}] Narrative: "${page.narrative}" | Visual Action: "${page.visualDescription}" | Reader Choice: "${page.userChoice || "None"}"`;
    }).join("\n");

    const panelNumber = history.length + 1;

    const prompt = `
      STORY CONTEXT:
      - Protagonist: ${context.characterName} (${context.characterDescription})
      - Plot Outline: ${context.plotSummary}
      - Art Style: ${context.artStyle}

      PREVIOUS PANELS:
      ${historyText}

      CURRENT SITUATION:
      The reader chose: "${lastChoice}".
      
      TASK:
      Generate Panel #${panelNumber}.
      Ensure the visual composition is DIFFERENT from Panel ${panelNumber - 1}.
      If the last panel was a wide shot, make this a close-up or medium shot.
      Make the visual description highly specific to the action implied by the user's choice.
    `;

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        systemInstruction: BASE_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            narrative: {
              type: Type.STRING,
              description: "The story text/caption for this panel.",
            },
            visual_description: {
              type: Type.STRING,
              description: "A detailed visual prompt for the image generator. MUST start with the Camera Angle and Action.",
            },
            choices: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Two distinct actions for the protagonist.",
            },
          },
          required: ["narrative", "visual_description", "choices"],
        },
      },
    });

    if (!response.text) {
      throw new Error("No text response from Gemini.");
    }

    const data = JSON.parse(response.text) as GenAIStoryResponse;
    return data;

  } catch (error) {
    console.error("Error generating story:", error);
    throw error;
  }
};

export const generatePanelImage = async (visualDescription: string, artStyle?: string): Promise<string> => {
  try {
    // Construct a prompt that prioritizes the scene description + style
    // We put the visual description FIRST so the model focuses on the content/action.
    const stylePrompt = artStyle ? `Art style: ${artStyle}.` : "";
    
    // "Nano Banana" works well with clear, natural language descriptions.
    const finalPrompt = `${visualDescription}. ${stylePrompt} Comic book panel, masterpiece, graphic novel style, high detailed.`;
    
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: {
        parts: [{ text: finalPrompt }]
      },
    });

    // Extract image from response with robust safety checks
    let base64Image = "";
    
    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
        for (const part of candidate.content.parts) {
            if (part.inlineData?.data) {
                base64Image = part.inlineData.data;
                break;
            }
        }
    }

    if (!base64Image) {
        console.warn("Gemini returned a response but no image data found. Response:", response);
        // Return a distinct placeholder if generation fails but API works
        return "https://placehold.co/1024x1024/1a1a1a/FFF?text=Image+Generation+Failed";
    }

    return `data:image/jpeg;base64,${base64Image}`;

  } catch (error) {
    console.error("Error generating image:", error);
    // Fallback image
    return "https://placehold.co/1024x1024/1a1a1a/FFF?text=API+Error"; 
  }
};