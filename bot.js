const { Client, Intents } = require('discord.js');

const Discord = require('discord.js')
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const botToken = config.token;


const client = new Client({ 
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      // Add any other intents your bot requires
    ]
  });

client.on('ready', () => {
    console.log('Logged in as ${client.user.tag}')
})

client.login(bot_token);




