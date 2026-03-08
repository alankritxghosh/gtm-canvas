const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyAmyqC4-XujTzjgFy-kcJxEhQsVdTF2iMM");
async function test() {
    const models = [
        "gemini-3-flash-preview",
        "gemini-3.1-pro-preview"
    ];
    for (const m of models) {
        try {
            const start = Date.now();
            const model = genAI.getGenerativeModel({ model: m, generationConfig: { responseMimeType: "application/json" } });
            const prompt = `Return a JSON object with a single key "test" and value "success".`;
            const res = await model.generateContent(prompt);
            const time = Date.now() - start;
            console.log(m, "WORKS in", time, "ms. Response:", res.response.text().trim());
        } catch (e) {
            console.log(m, "FAILED:", e.message);
        }
    }
}
test();
