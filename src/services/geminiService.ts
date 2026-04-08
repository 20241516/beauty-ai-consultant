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
      model: "gemini-1.5-flash",
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

    const text = response.text;

    if (!text) {
      throw new Error("AI로부터 응답을 받지 못했습니다.");
    }

    return JSON.parse(text);
  } catch (error: any) {
    console.error("Gemini API Error Details:", error);
    
    let errorMessage = "분석 중 오류가 발생했습니다.";
    if (error.message?.includes("API key not valid")) {
      errorMessage = "입력된 API 키가 유효하지 않습니다. Vercel 환경 변수에서 키를 다시 확인하고 'Redeploy' 해주세요.";
    } else if (error.message?.includes("quota")) {
      errorMessage = "API 사용량이 초과되었습니다. 잠시 후 다시 시도해주세요.";
    } else if (error.message?.includes("safety")) {
      errorMessage = "부적절한 요청으로 판단되어 AI가 응답을 거부했습니다.";
    } else if (error.message?.includes("fetch")) {
      errorMessage = "네트워크 연결에 실패했습니다. 인터넷 상태를 확인해주세요.";
    } else {
      errorMessage = `에러 상세: ${error.message || "알 수 없는 서버 오류"}`;
    }
    
    throw new Error(errorMessage);
  }
}
