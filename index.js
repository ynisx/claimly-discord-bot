const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require("discord.js");
require("dotenv").config();

// --- ILAGAY ANG ROLE ID NG "editors" DITO ---
const EDITORS_ROLE_ID = "1541429030165684344"; // Palitan mo ito!
// ---------------------------------------------

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.on("ready", () => {
  console.log(`✅ Naka-log in bilang ${client.user.tag}`);
});

const pendingClaims = new Map();

client.on("interactionCreate", async interaction => {
  // === SLASH COMMAND: /postclient ===
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === "postclient") {
      const clientName = interaction.options.getString("client");
      const videos = interaction.options.getString("videos");
      const rate = interaction.options.getString("rate");
      const payment = interaction.options.getString("payment");
      const location = interaction.options.getString("location");

      const messageId = `${Date.now()}`;
      pendingClaims.set(messageId, { clientName, videos, rate, payment, location });

      // --- AVAILABLE Card ---
      const embed = new EmbedBuilder()
        .setColor("#2ecc71")
        .setTitle(clientName)
        .addFields(
          { name: "Client", value: clientName, inline: true },
          { name: "Videos", value: videos, inline: true },
          { name: "Rate", value: rate, inline: true },
          { name: "Payment", value: payment, inline: true },
          { name: "Location", value: location, inline: true },
          { name: "Status", value: "AVAILABLE", inline: true }
        )
        .setTimestamp();

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId(`claim:${messageId}`)
            .setLabel("CLAIM")
            .setStyle(ButtonStyle.Success)
        );

      // ✅ Ping sa @editors kapag may nag-post
      await interaction.reply({
        content: `<@&${EDITORS_ROLE_ID}> — ${interaction.user} posted a new client!`,
        embeds: [embed],
        components: [row]
      });
    }
  }

  // === BUTTON: CLAIM ===
  if (interaction.isButton()) {
    const customId = interaction.customId;
    if (customId.startsWith("claim:")) {
      const messageId = customId.replace("claim:", "");
      const data = pendingClaims.get(messageId);

      if (!data) {
        return await interaction.reply({
          content: "❌ Hindi na mahanap ang impormasyon.",
          ephemeral: true
        });
      }

      const claimedBy = interaction.user;

      // --- CLAIMED Card ---
      const embed = new EmbedBuilder()
        .setColor("#000acd")
        .setTitle(data.clientName)
        .addFields(
          { name: "Taken by", value: `${claimedBy}`, inline: false },
          { name: "Client", value: data.clientName, inline: true },
          { name: "Videos", value: data.videos, inline: true },
          { name: "Rate", value: data.rate, inline: true },
          { name: "Payment", value: data.payment, inline: true },
          { name: "Location", value: data.location, inline: true },
          { name: "Status", value: "CLAIMED", inline: true }
        )
        .setTimestamp();

      const newRow = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("claimed")
            .setLabel("CLAIMED")
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true)
        );

      // ✅ Ping sa @editors kapag may nag-claim
      await interaction.update({
        content: `${claimedBy} claimed this client! <@&${EDITORS_ROLE_ID}>`,
        embeds: [embed],
        components: [newRow]
      });

      pendingClaims.delete(messageId);
    }
  }
});

client.login(process.env.BOT_TOKEN);

// --- ITO LANG ANG BAGONG DAGDAG ---
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Bot is running!");
});

app.listen(PORT, () => {
  console.log(`✅ Health check port: ${PORT}`);
});
// --- HANGGANG DITO ---
