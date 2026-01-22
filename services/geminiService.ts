
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => {
  // O CodeSandbox com Vite pode usar import.meta.env ou process.env dependendo da config
  // Tentamos ambas para garantir que sua apresentação não falhe
  const key = (import.meta as any).env?.VITE_API_KEY || process.env.API_KEY || '';
  return new GoogleGenAI({ apiKey: key });
};

export const analyzeIncident = async (description: string, imageBase64?: string) => {
  const ai = getAI();
  const model = 'gemini-3-flash-preview';

  const parts: any[] = [
    { text: `As a professional Workplace Health and Safety (WHS) officer, analyze the following safety report and provide:
    1. A risk assessment score (1-10).
    2. Immediate corrective actions.
    3. Potential long-term preventative measures.
    4. Relevant OSHA or safety regulation citations if applicable.
    
    Report Description: ${description}` }
  ];

  if (imageBase64) {
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageBase64.split(',')[1] || imageBase64
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Failed to perform AI analysis at this time. Check API Key configuration.";
  }
};

export const verifyMissionProof = async (missionTitle: string, missionDescription: string, imageBase64: string) => {
  const ai = getAI();
  const model = 'gemini-3-flash-preview';

  const parts = [
    {
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageBase64.split(',')[1] || imageBase64
      }
    },
    {
      text: `Verify if this photo is a valid proof for the following safety mission:
      Title: ${missionTitle}
      Description: ${missionDescription}
      
      Requirements: The photo must clearly show the action or object described. 
      Respond ONLY in JSON format with the following structure:
      {
        "verified": boolean,
        "reason": "Short explanation in Portuguese of why it was accepted or rejected"
      }`
    }
  ];

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verified: { type: Type.BOOLEAN },
            reason: { type: Type.STRING }
          },
          required: ["verified", "reason"]
        }
      }
    });
    return JSON.parse(response.text || '{"verified": false, "reason": "Erro na análise"}');
  } catch (error) {
    console.error("Mission Verification Error:", error);
    return { verified: false, reason: "Falha na comunicação com a IA." };
  }
};

export const generateSafetyChecklist = async (taskName: string) => {
  const ai = getAI();
  const model = 'gemini-3-flash-preview';

  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Create a comprehensive safety checklist for the following task: "${taskName}". 
      The response must be in JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            task: { type: Type.STRING },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  check: { type: Type.STRING },
                  priority: { type: Type.STRING, enum: ['high', 'medium', 'low'] }
                },
                required: ['check', 'priority']
              }
            }
          },
          required: ['task', 'items']
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Checklist Generation Error:", error);
    return { task: taskName, items: [{ check: "Erro ao gerar checklist via IA", priority: "high" }] };
  }
};
