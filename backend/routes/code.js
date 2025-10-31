const express = require("express");
const axios = require("axios");

const router = express.Router();

/**
 * POST /api/code/execute
 * body: { language: 'python'|'java'|'cpp'|'c', code: '...', stdin?: '' }
 */
router.post("/execute", async (req, res) => {
  const { language, code, stdin } = req.body || {};

  if (!language || !code) {
    return res.status(400).json({ message: "language and code are required" });
  }

  try {
    // Map simple language keys to Piston-compatible names and versions
    const languageMap = {
      c: { name: "c", version: "10.2.0" },
      cpp: { name: "cpp", version: "10.2.0" },
      "c++": { name: "cpp", version: "10.2.0" },
      python: { name: "python", version: "3.10.0" },
      java: { name: "java", version: "15.0.2" },
      js: { name: "javascript", version: "18.15.0" },
      javascript: { name: "javascript", version: "18.15.0" },
    };

    const langData = languageMap[language.toLowerCase()];
    if (!langData)
      return res.status(400).json({ message: "Unsupported language" });

    // Send request to Piston API
    const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
      language: langData.name,
      version: langData.version,
      files: [
        {
          name:
            langData.name === "java"
              ? "Main.java"
              : langData.name === "python"
              ? "script.py"
              : "main." + langData.name,
          content: code,
        },
      ],
      stdin: stdin || "",
    });

    const runResult = response.data.run || {};

    res.json({
      success: runResult.code === 0,
      language: langData.name,
      version: langData.version,
      output: (runResult.output || "").trim(),
      stdout: runResult.stdout || "",
      stderr: runResult.stderr || "",
    });
  } catch (error) {
    console.error("Execution error:", error.message);
    res
      .status(500)
      .json({ message: "Execution failed", error: error.message || error });
  }
});

/**
 * GET /api/code/health
 * Checks if the Piston API is reachable and lists available languages
 */
router.get("/health", async (req, res) => {
  try {
    const response = await axios.get("https://emkc.org/api/v2/piston/runtimes");
    const langs = response.data.map((r) => `${r.language} ${r.version}`);

    res.json({
      status: "healthy",
      message: "Piston API is reachable",
      available_languages: langs.slice(0, 10), // first 10 for brevity
      total_languages: langs.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "degraded",
      message: "Unable to reach Piston API",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

module.exports = router;
