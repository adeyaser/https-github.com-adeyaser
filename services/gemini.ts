
import { GoogleGenAI, Type } from "@google/genai";

// Ensure ai is initialized properly once if API_KEY is available
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateObservationNote(studentName: string, area: string, behaviors: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Tuliskan laporan observasi singkat (max 100 kata) yang profesional namun ramah untuk orang tua tentang anak PAUD bernama ${studentName} di area ${area}. 
      Gunakan poin-poin berikut sebagai dasar perilaku hari ini: ${behaviors}. 
      Pastikan nada bicaranya menyemangati dan sesuai dengan perkembangan anak usia dini.`,
      config: {
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Maaf, sistem AI sedang sibuk. Silakan tulis catatan manual.";
  }
}

export async function generateGameContent(topic: string, gameType: string) {
  // Define specific instructions based on game type to ensure the custom_items array is correctly populated
  let typeSpecificInstructions = "";
  if (gameType === 'practical_life') {
    typeSpecificInstructions = "custom_items must be an array of objects with { step: number, text: string, icon: string (emoji) } representing sequential tasks.";
  } else if (gameType === 'bead_stair' || gameType === 'snake_game') {
    typeSpecificInstructions = "custom_items must be an array of numbers (1-10).";
  } else if (gameType === 'memory') {
    typeSpecificInstructions = "custom_items must be an array of 6-8 strings representing symbols/emojis related to the topic.";
  } else if (gameType === 'golden_beads' || gameType === 'stamp_game') {
    typeSpecificInstructions = "custom_items should be an array with one object { problem: string, answer: number } representing a place value challenge.";
  }

  const prompt = `Buatlah konten game Montessori "${gameType}" untuk anak PAUD. 
    Topik Kurikulum: ${topic}. 
    Instruksi Format: ${typeSpecificInstructions}
    Pastikan bahasa yang digunakan ramah anak dan edukatif.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.8,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "Judul permainan yang menarik",
            },
            description: {
              type: Type.STRING,
              description: "Instruksi singkat cara bermain",
            },
            custom_items: {
              type: Type.ARRAY,
              items: {
                // Since items can be polymorphic, we define a schema that allows both simple values and objects
                type: Type.OBJECT,
                properties: {
                  step: { type: Type.NUMBER },
                  text: { type: Type.STRING },
                  icon: { type: Type.STRING },
                  symbol: { type: Type.STRING },
                  category: { type: Type.STRING },
                  problem: { type: Type.STRING },
                  answer: { type: Type.NUMBER },
                  value: { type: Type.NUMBER }
                }
              },
              description: "Data konten utama permainan",
            },
            categories: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Hanya untuk game tipe 'sorting'",
            }
          },
          required: ["title", "description", "custom_items"],
        }
      },
    });

    const text = response.text;
    if (!text) return null;
    
    const parsed = JSON.parse(text);
    
    // Cleanup step: If items were supposed to be just strings or numbers but AI wrapped them in objects
    // due to the flexible schema, we normalize them here for the component
    if (parsed.custom_items && (gameType === 'bead_stair' || gameType === 'snake_game' || gameType === 'memory')) {
       parsed.custom_items = parsed.custom_items.map((item: any) => 
         typeof item === 'object' ? (item.value || item.symbol || item.text || 0) : item
       );
    }

    return parsed;
  } catch (error) {
    console.error("Gemini Game Error:", error);
    return null;
  }
}

export async function generateComprehensiveAssessment(
  studentName: string, 
  activities: string[], 
  quizResults: string[], 
  ethics: string
) {
  try {
    const prompt = `
      Anda adalah seorang Guru PAUD senior dengan keahlian metode Montessori. 
      Tuliskan narasi perkembangan formal untuk laporan rapor siswa bernama: ${studentName}.
      Data Pendukung:
      1. Kegiatan: ${activities.join(", ")}
      2. Quiz: ${studentName}: ${quizResults.join(", ")}
      3. Etika: ${ethics}
      Maksimal 150 kata.
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 2000 } // Reserve some budget for complex reasoning if model supports it
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Comprehensive Error:", error);
    // Generic fallback to avoid 500 block the UI flow entirely
    return `Ananda ${studentName} menunjukkan perkembangan yang konsisten dalam kegiatan harian. Di area kurikulum, ananda mampu mengikuti instruksi dengan baik dan menunjukkan minat tinggi pada material baru. Secara sosial, ananda bersikap kooperatif dan ramah terhadap teman sebaya.`;
  }
}

export async function generateQuizQuestions(topic: string, count: number = 3) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Buatlah ${count} soal pilihan ganda sederhana untuk anak PAUD tentang topik: ${topic}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.INTEGER },
            },
            required: ["text", "options", "correctAnswer"],
          },
        },
      },
    });
    const text = response.text;
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error("Quiz Gen Error:", error);
    return null;
  }
}
