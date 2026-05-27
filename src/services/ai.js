import OpenAI from 'openai';

// Baca API key dari environment variable (.env) — JANGAN hardcode di sini!
const openai = new OpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true // Diperlukan karena dipanggil langsung dari browser React
});

export const generateStory = async (timeline) => {
  try {
    // We pass a system prompt and the timeline context to generate a timeline story
    const prompt = `Anda adalah seorang narator yang menceritakan proses eksekusi CPU berdasarkan timeline penjadwalan. 
Berikut adalah timeline eksekusinya:
${JSON.stringify(timeline, null, 2)}

Buatlah narasi singkat dan menarik dalam bahasa Indonesia untuk setiap proses saat dieksekusi. 
Kembalikan respon dalam format JSON murni sebagai array of objects dengan struktur: 
[
  { "processId": "P1", "startTime": 0, "endTime": 5, "story": "Cerita eksekusi P1 di waktu 0-5" }
]
JANGAN berikan markdown \`\`\`json, cukup kembalikan JSON array-nya langsung. Pastikan array mencakup semua interval di timeline.`;

    const response = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant", // Menggunakan model Llama 3.1 dari Groq
      messages: [
        { role: "system", content: "Anda adalah asisten AI penjadwalan sistem operasi yang ahli dan menyenangkan." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    let content = response.choices[0].message.content.trim();
    // Gunakan Regex untuk mengekstrak hanya bagian array JSON agar lebih aman dari teks basa-basi AI
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      content = jsonMatch[0];
    }
    
    return JSON.parse(content);
  } catch (error) {
    console.error("Gagal mendapatkan cerita dari AI:", error);
    return [{ processId: "System", startTime: 0, endTime: 10, story: "Error API Groq: " + error.message }];
  }
};

export const askAgent = async (metrics, timeline, question, history = []) => {
  try {
    const contextStr = `Konteks Simulasi CPU:
Metrik Hasil: ${JSON.stringify(metrics, null, 2)}
Timeline Eksekusi: ${JSON.stringify(timeline, null, 2)}`;

    const messages = [
      { role: "system", content: "Anda adalah Asisten AI Sistem Operasi yang ramah, membantu menjawab pertanyaan tentang penjadwalan CPU berdasarkan konteks yang diberikan. Jawablah menggunakan bahasa Indonesia dengan ramah, jelas, dan informatif.\n\n" + contextStr },
      ...history,
      { role: "user", content: question }
    ];

    const response = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant", // Menggunakan model Llama 3.1 dari Groq
      messages: messages,
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Gagal mendapatkan jawaban dari AI:", error);
    return "Maaf, terjadi kesalahan pada API Groq: " + error.message;
  }
};
