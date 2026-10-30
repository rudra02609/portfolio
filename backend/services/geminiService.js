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
  "recommendation": "Best next action, or 'Not enough information in the task data.'"
}
`;

async function getAIInsight(taskData) {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    const err = new Error("Gemini AI insight service not configured");
    err.status = 500;
    throw err;
  }

  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash";

  const prompt = `
${SYSTEM_PROMPT}

Task information:
- Title: "${taskData.title}"
- Description: "${taskData.description || "No description"}"
- Status: ${taskData.completed ? "Completed" : "Not completed"}
- Priority: ${taskData.priority || "Not set"}

Please provide the AI insight for this task.
`.trim();

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
        system_instruction: {
          parts: [
            { text: SYSTEM_PROMPT.replace(/^You are a Task Completion Assistant\./m, "").trim() },
          ],
        },
      }),
    }
  );

  // Handle Gemini API errors - these propagate directly to the route handler
  // with their actual error messages (e.g., quota exceeded, unauthorized).
  // Do NOT wrap in outer try/catch so they are not replaced with the generic message.
  if (!response.ok) {
    let errData;
    try {
      errData = await response.json().catch(() => ({}));
    } catch (e) {
      errData = {};
    }
    const errorCode = errData.error?.code || errData.error?.status;
    const retryAfter = response.headers.get("retry-after");
    const sanitizedMessage = errData.error?.message
      ? errData.error.message.replace(apiKey, '[REDACTED]')
      : "Gemini AI insight failed";
    const baseQuotaMsg = errData.error?.message
      ? "AI insight quota exceeded. " + errData.error.message.replace(apiKey, '[REDACTED]')
      : "AI insight quota exceeded.";
    let finalMessage = baseQuotaMsg;
    if (retryAfter) {
      finalMessage += " The system recommends waiting " + retryAfter + " seconds before retrying.";
    } else {
      finalMessage += " Please check your Gemini API plan and billing details.";
    }
    console.error("[geminiService] Gemini API error - status: " + response.status + ", code: " + errorCode + ", message: " + sanitizedMessage);
    throw new Error(finalMessage);
  }

  // Rest of response processing in outer try/catch
  // Only truly unexpected errors (network, parse) get the generic message.
  try {
    const data = await response.json();
    const content =
      data.candidates && data.candidates[0]
        ? data.candidates[0].content
        : null;

    if (!content) {
      throw new Error("Empty response from Gemini");
    }

    // The REST API returns content as { parts: [{ text }] }, not a raw string.
    const rawText = Array.isArray(content.parts)
      ? content.parts.map((part) => part.text || "").join("")
      : "";
    const text = rawText
      .trim()
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/, "")
      .trim();

    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    // Try to parse the JSON response
    try {
      return JSON.parse(text);
    } catch {
      // If AI didn't return valid JSON, try to extract structured parts
      return {
        summary: extractSection(text, "summary") || "No summary available",
        completionPlan: extractList(text, "completionPlan") || ["Not enough information in the task data."],
        completed: extractList(text, "completed") || ["Not enough information in the task data."],
        remaining: extractList(text, "remaining") || ["Not enough information in the task data."],
        blockers: extractList(text, "blockers") || ["Not enough information in the task data."],
        recommendation: extractRecommendation(text) || "Not enough information in the task data.",
      };
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

async function generateDescription(title) {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    const err = new Error("Gemini AI description service not configured");
    err.status = 500;
    throw err;
  }

  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash";

  const systemPrompt = `
You are a Task Description Generator. Given a task title, generate a concise, useful paragraph describing how to complete the task.

RULES:
- Analyze ONLY the provided task title.
- Never invent completed work.
- Give practical, step-by-step guidance relevant to the title.
- Keep the response concise (1-2 sentences).
- Return structured JSON only with a "description" field.

Return this exact JSON structure (no Markdown wrapping):
{
  "description": "A concise description of how to complete this task, or "Not enough information in the task title."}
`;

  const prompt = `${systemPrompt}

Task title: "${title}"

Please generate a description for this task.
`.trim();

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
          text: systemPrompt.replace(/^You are a Task Description Generator/m, "").trim(),
        },
      }),
    }
  );

  // Handle Gemini API errors - these propagate directly to the route handler
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const errorStatus = errData.error?.code || errData.error?.status || null;
    const retryAfter = response.headers.get("retry-after");
    const sanitizedMessage = errData.error?.message
      ? errData.error.message.replace(apiKey, '[REDACTED]').replace(/`/g, '"')
      : "Gemini AI description failed";
    const baseQuotaMsg = errData.error?.message
      ? "AI description quota exceeded. " + errData.error.message.replace(apiKey, '[REDACTED]')
      : "AI description quota exceeded.";
    let finalMessage = baseQuotaMsg;
    if (retryAfter) {
      finalMessage += " The system recommends waiting " + retryAfter + " seconds before retrying.";
    } else {
      finalMessage += " Please check your Gemini API plan and billing details.";
    }
    console.error("[geminiService] Gemini API error", {
      errorStatus,
      sanitizedMessage,
      model,
    });
    throw new Error(finalMessage);
  }

  // Rest of response processing in outer try/catch
  try {
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
      if (parsed && parsed.description) {
        return parsed.description;
      }
      // Fallback: try to extract description from the raw text
      const fallbackMatch = content.match(new RegExp('"description":\\s*"([^"]*)"', 'm'));
      return fallbackMatch ? fallbackMatch[1] : "Not enough information in the task title.";
    } catch {
      // If AI didn't return valid JSON, try to extract description
      const extractMatch = content.match(new RegExp('"description":\\s*"([^"]*)"', 'm'));
      return extractMatch ? extractMatch[1] : "Not enough information in the task title.";
    }
  } catch (error) {
    console.error("[geminiService] Gemini AI description error", {
      errorMessage: error.message.replace(apiKey, '[REDACTED]'),
      model,
    });
    throw new Error("Failed to generate description. Please try again.");
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

function extractList(text, fieldName) {
  const matches = text.match(new RegExp(`"${fieldName}":\\s*\\[([^\\]]*)\\]`, "m"));
  if (!matches) return null;
  const items = matches[1].match(/"([^"]*)"/g);
  if (!items) return null;
  return items.map((item) => item.slice(1, -1));
}

module.exports = { getAIInsight, isConfigured, initGemini, generateDescription };