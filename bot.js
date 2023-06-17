const { Client, Intents } = require('discord.js');

const Discord = require('discord.js')
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const botToken = config.token;

const client = new Discord.Client();
const prefix = '!'; // Customize the command prefix
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on('message', message => {
  if (message.author.bot) return; // Ignore bot messages
  if (!message.content.startsWith(prefix)) return; // Check for prefix

  const args = message.content.slice(prefix.length).trim().split(' ');
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('An error occurred while executing the command.');
  }
});

client.login(bot_token);




