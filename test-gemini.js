const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyAmyqC4-XujTzjgFy-kcJxEhQsVdTF2iMM");
async function test() {
  const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash", "gemini-2.5-flash"];
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
