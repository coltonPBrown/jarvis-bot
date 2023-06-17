const Discord = require('discord.js');
const ytdl = require('ytdl-core');

module.exports = {
  name: 'play',
  description: 'Play YouTube audio in a voice channel',
  async execute(message, args) {
    if (!message.member.voice.channel) {
      return message.reply('You must be in a voice channel to use this command.');
    }

    const voiceChannel = message.member.voice.channel;
    const connection = await voiceChannel.join();

    // Play audio stream
    const stream = ytdl(args[0], { filter: 'audioonly' });
    const dispatcher = connection.play(stream);

    dispatcher.on('start', () => {
      message.channel.send('Now playing: ' + args[0]);
    });

    dispatcher.on('finish', () => {
      voiceChannel.leave();
    });

    dispatcher.on('error', (error) => {
      console.error(error);
    });
  },
};
