const fs = require("node:fs");

const lines = Object.entries(process.env)
  .filter(([k]) => k.startsWith("ADMIN_") || k.startsWith("NEXT_PUBLIC_") || k === "DATABASE_URL" || k.startsWith("WHATSAPP_"))
  .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
  .join("\n");

if (lines.trim().length > 0) {
  fs.appendFileSync(".env.production", "\n" + lines + "\n");
  console.log("Successfully wrote Amplify runtime environment variables to .env.production");
} else {
  console.log("No matching Amplify environment variables found in process.env");
}
