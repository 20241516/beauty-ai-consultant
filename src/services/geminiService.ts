import { GoogleGenerativeAI } from "@google/generative-ai";

// Vercel 환경변수에서 키를 가져옵니다.
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export interface BeautyConsultation {
  face: string;
  color: string;
  hairAndPoint: string;
  guide: string;
}

export async function getBeautyConsultation(tpo: string, color: string, weather: string): Promise<BeautyConsultation> {
  // 모델명을 가장 안정적인 'gemini-1.5-flash'로 설정합니다.
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `당신은 전문 퍼스널 컬러리스트이자 스타일리스트입니다.
  상황(TPO): ${tpo}
  의상 색상: ${color}
  날씨: ${weather}
  
  위 조건에 맞는 메이크업과 스타일링을 다음 JSON 형식으로 제안해주세요:
  {
    "face": "피부 표현과 메이크업 무드",
    "color": "추천 색조 조합",
    "hairAndPoint": "헤어스타일과 포인트 액세서리",
    "guide": "스타일링 총평"
  }
  반드시 한국어로 답변하고 JSON 형식만 출력하세요.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  // JSON 응답만 추출해서 파싱
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Invalid response format");
  
  return JSON.parse(jsonMatch[0]);
}
