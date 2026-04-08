import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface BeautyConsultation {
  face: string;
  color: string;
  hairAndPoint: string;
  guide: string;
}

export async function getBeautyConsultation(
  tpo: string,
  outfitColor: string,
  weather: string
): Promise<BeautyConsultation> {
  const prompt = `
    Analyze the following situation and provide expert beauty (makeup and hair) advice.
    Situation (TPO): ${tpo}
    Outfit Color: ${outfitColor}
    Weather: ${weather}

    Provide the response in JSON format with the following keys:
    - face: Makeup advice focusing on skin expression and mood based on situation and weather.
    - color: Recommended lip and eyeshadow colors that complement or contrast with the outfit.
    - hairAndPoint: Hair styling tips considering humidity/weather and overall style points.
    - guide: A professional summary explaining why this style is recommended.

    The tone should be professional, sophisticated, and like a high-end beauty magazine.
    The language of the response should be Korean.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          face: { type: Type.STRING },
          color: { type: Type.STRING },
          hairAndPoint: { type: Type.STRING },
          guide: { type: Type.STRING },
        },
        required: ["face", "color", "hairAndPoint", "guide"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
}
