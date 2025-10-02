const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fetch = require("node-fetch");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ---- Simpan command terakhir ----
let lastCommand = null;

// Endpoint untuk menerima command dari Discord (via bot)
app.post("/command", (req, res) => {
  const { command } = req.body;
  console.log("📥 Received command:", command);
  lastCommand = command;
  res.json({ status: "ok", command });
});

// Endpoint untuk Roblox ambil command
app.get("/get-command", (req, res) => {
  res.send(lastCommand || "");
  lastCommand = null; // reset agar tidak berulang
});

// Jalankan server web
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Bridge server running on ${PORT}`));

// ---- Setup Discord Bot ----
const TOKEN = process.env.BOT_TOKEN; // simpan token di Replit Secrets

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.log(`🤖 Bot logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const content = message.content;

  if (
    content.startsWith("!announce") ||
    content === "!restart" ||
    content === "!shutdown"
  ) {
    await fetch(`http://localhost:${PORT}/command`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: content }),
    });

    message.reply(`✅ Command \`${content}\` dikirim ke Roblox`);
  }
});

client.login(TOKEN);
