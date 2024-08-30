const { Client, Intents } = require("discord.js");

const Discord = require("discord.js");
const fs = require("fs");
const config = JSON.parse(fs.readFileSync("config.json", "utf8"));
const botToken = config.token;

const { channels } = require("./constants.js");
const client = new Discord.Client();
const prefix = "!"; // Customize the command prefix
client.commands = new Discord.Collection();

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on("message", (message) => {
  // Ignore bot messages
  if (message.author.bot) return;

  // Check if the message is in a DM or a guild (server) channel
  const isDM = message.channel.type === "dm";

  // If it's a server message, ensure the command starts with the prefix
  if (!isDM && !message.content.startsWith(prefix)) return;

  // Remove the prefix in server messages
  const args = isDM
    ? message.content.trim().split(" ")
    : message.content.slice(prefix.length).trim().split(" ");
  const commandName = args.shift().toLowerCase();

  // Check if the command exists
  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  try {
    // Execute the command
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("An error occurred while executing the command.");
  }
});

client.login(botToken);
