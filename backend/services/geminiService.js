const API_BASE_URL = "https://generativelanguage.googleapis.com";

function getGeminiApiKey() {
  return process.env.GEMINI_API_KEY || "";
}

function isConfigured() {
  return !!process.env.GEMINI_API_KEY;
}

function initGemini() {
  // No-op: API key is validated on first request via isConfigured()
  return {};
}

const SYSTEM_PROMPT = `
You are a Task Completion Assistant. Analyze the provided task information and give practical, useful insights.

RULES:
- Analyze ONLY the provided task information.
- Never invent completed work.
- Never assume progress that is not provided.
- Never claim something is completed unless the task data supports it.
- Give practical, step-by-step steps to complete the task.
- Identify missing information.
- Keep the response concise and useful.
- Return structured JSON only.

Return this exact JSON structure (no Markdown wrapping):
{
  "summary": "Short summary of the task",
  "completionPlan": ["Step 1...", "Step 2...", "Step 3..."],
  "completed": ["Only things supported by task data", "or", "Not enough information in the task data."],
  "remaining": ["Remaining work based on available information", "or", "Not enough information in the task data."],
  "blockers": ["Possible blockers based on task information", "or", "Not enough information in the task data."],
  "recommendation": "Best next action or "Not enough information in the task data."}
`;

async function getAIInsight(taskData) {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    const err = new Error("Gemini AI insight service not configured");
    err.status = 500;
    throw err;
  }

  const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";

  const prompt = `
${SYSTEM_PROMPT}

Task information:
- Title: "${taskData.title}"
- Description: "${taskData.description || "No description"}"
- Status: ${taskData.completed ? "Completed" : "Not completed"}
- Priority: ${taskData.priority || "Not set"}

Please provide the AI insight for this task.
`.trim();

  try {
    const response = await fetch(
      `${API_BASE_URL}/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          systemInstruction: {
            text: SYSTEM_PROMPT.replace(/^You are a Task Completion Assistant\./m, "").trim(),
          },
        }),
      }
    );

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || "Gemini AI insight failed.");
    }

    const data = await response.json();
    const content =
      data.candidates && data.candidates[0]
        ? data.candidates[0].content
        : null;

    if (!content) {
      throw new Error("Empty response from Gemini");
    }

    // Try to parse the JSON response
    try {
      const parsed = JSON.parse(content);
      return parsed;
    } catch {
      // If AI didn't return valid JSON, try to extract structured parts
      const result = {
        summary: extractSection(content, "summary") || "No summary available",
        completionPlan: extractPlan(content) || ["Not enough information in the task data."],
        completed: extractSection(content, "completed") || ["Not enough information in the task data."],
        remaining: extractSection(content, "remaining") || ["Not enough information in the task data."],
        blockers: extractSection(content, "blockers") || ["Not enough information in the task data."],
        recommendation: extractRecommendation(content) || "Not enough information in the task data.",
      };
      return result;
    }
  } catch (error) {
    console.error("[geminiService] Gemini AI insight error:", error.message);
    throw new Error("AI insight is temporarily unavailable. Please try again.");
  }
}

function extractSection(text, sectionName) {
  const regex = new RegExp(`"${sectionName}":\\s*"([^"]*)"`, "m");
  const match = text.match(regex);
  return match ? match[1] : null;
}

function extractPlan(text) {
  const matches = text.match(/"completionPlan":\s*\[([^\]]*)\]/m);
  if (!matches) return null;
  const inner = matches[1];
  const items = inner.match(/"([^"]*)"/g);
  if (!items) return null;
  return items.map((item) => item.slice(1, -1));
}

function extractRecommendation(text) {
  const regex = /"recommendation":\s*"([^"]*)"/m;
  const match = text.match(regex);
  return match ? match[1] : null;
}

module.exports = { getAIInsight, isConfigured, initGemini };