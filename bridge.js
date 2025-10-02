const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;

let lastCommand = null;

app.use(bodyParser.json());

app.post("/command", (req, res) => {
    const { command, message } = req.body;
    lastCommand = { command, message, timestamp: Date.now() };
    console.log("📩 Received command:", lastCommand);
    res.send({ success: true });
});

app.get("/get-command", (req, res) => {
    res.send(lastCommand || {});
    lastCommand = null;
});

app.listen(PORT, () => {
    console.log(`🚀 Bridge server running on port ${PORT}`);
});
