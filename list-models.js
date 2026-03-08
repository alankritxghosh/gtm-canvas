async function listModels() {
    const apiKey = "AIzaSyAmyqC4-XujTzjgFy-kcJxEhQsVdTF2iMM";
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data && data.models) {
            const gemini3Models = data.models
                .filter(m => m.name.includes('gemini-3'))
                .map(m => m.name);
            console.log("Found Gemini 3 Models:", gemini3Models.length ? gemini3Models : "None");

            const allGeminiModels = data.models
                .filter(m => m.name.includes('gemini'))
                .map(m => m.name);
            console.log("All Gemini Models:", allGeminiModels);
        } else {
            console.log("Unexpected response:", data);
        }
    } catch (error) {
        console.error("Error fetching models:", error);
    }
}

listModels();
