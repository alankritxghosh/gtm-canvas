const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyAmyqC4-XujTzjgFy-kcJxEhQsVdTF2iMM");
async function test() {
    const models = [
        "gemini-3.0-flash",
        "gemini-3.0-flash-latest",
        "gemini-3.0-pro",
        "gemini-3.5-flash",
        "gemini-3-flash",
        "gemini-3-pro"
    ];
    for (const m of models) {
        try {
            const model = genAI.getGenerativeModel({ model: m });
            const res = await model.generateContent("hello");
            console.log(m, "WORKS");
        } catch (e) {
            console.log(m, "FAILED:", e.message);
        }
    }
}
test();
