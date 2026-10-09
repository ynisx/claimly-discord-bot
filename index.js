const { REST, Routes } = require("discord.js");
require("dotenv").config();

const commands = [
  {
    name: "postclient",
    description: "Post a new client claim",
    options: [
      { name: "client", type: 3, description: "Client name", required: true },
      { name: "videos", type: 3, description: "Number of videos", required: true },
      { name: "rate", type: 3, description: "Rate / Price", required: true },
      { name: "payment", type: 3, description: "Payment method", required: true },
      { name: "location", type: 3, description: "Location", required: true }
    ]
  }
];

const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log("🔄 Registering commands...");
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );
    console.log("✅ Commands registered!");
  } catch (err) {
    console.error("❌ Error:", err);
  }
})();
