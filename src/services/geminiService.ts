import { GoogleGenAI, Type } from "@google/genai";

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
  // Vite의 define 또는 import.meta.env를 통해 가져옴
  const apiKey = process.env.GEMINI_API_KEY || (import.meta.env.VITE_GEMINI_API_KEY as string);

  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey === "" || apiKey === "undefined") {
    console.error("API Key Status: Missing or Default");
    throw new Error("GEMINI_API_KEY가 설정되지 않았거나 기본값입니다. Vercel 환경 변수에서 GEMINI_API_KEY 또는 VITE_GEMINI_API_KEY를 설정한 후 반드시 'Redeploy'를 진행해주세요.");
  }

  // 디버깅용 (키의 일부만 노출하여 설정 여부 확인)
  const keyPreview = apiKey.length > 8 ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : "****";
  console.log(`Gemini API Key detected: ${keyPreview}`);

  const ai = new GoogleGenAI({ apiKey });

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

  try {
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

    if (!response.text) {
      throw new Error("AI로부터 응답을 받지 못했습니다.");
    }

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
