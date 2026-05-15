/**
 * Append one NDJSON line for Cursor debug session (browser cannot write .cursor/ directly).
 * POST JSON body; no secrets. Fails silently on read-only deploy FS.
 */
var fs = require("fs");
var path = require("path");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  var logPath = path.join(process.cwd(), ".cursor", "debug-6b2706.log");
  try {
    var obj = req.body;
    if (!obj || typeof obj !== "object") {
      return res.status(400).json({ error: "JSON body required" });
    }
    fs.mkdirSync(path.dirname(logPath), { recursive: true });
    fs.appendFileSync(logPath, JSON.stringify(obj) + "\n", "utf8");
  } catch (err) {
    console.error("debug-log append:", err.message || err);
    return res.status(500).json({ ok: false, error: "write failed" });
  }
  return res.status(204).end();
};
