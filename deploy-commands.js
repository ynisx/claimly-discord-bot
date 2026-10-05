require("dotenv").config();
const { REST, Routes, SlashCommandBuilder } = require("discord.js");

const commands = [
  new SlashCommandBuilder()
    .setName("postclient")
    .setDescription("Post a new client card")
    .addStringOption(option =>
      option.setName("client")
        .setDescription("Name of the client")
        .setRequired(true))
    .addStringOption(option =>
      option.setName("videos")
        .setDescription("Number of videos")
        .setRequired(true))
    .addStringOption(option =>
      option.setName("rate")
        .setDescription("Rate e.g. $2/video")
        .setRequired(true))
    .addStringOption(option =>
      option.setName("payment")
        .setDescription("Total payment e.g. $30 total")
        .setRequired(true))
    .addStringOption(option =>
      option.setName("location")
        .setDescription("Location e.g. USA")
        .setRequired(true))
    .toJSON()
];

async function main() {
  const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);
  await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
    { body: commands }
  );
  console.log("✅ Command updated with all input fields!");
}

main().catch(console.error);