const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
} = require("@discordjs/voice");
const ytdl = require("ytdl-core");

let inactivityTimer;

module.exports = {
  name: "play",
  description: "Play YouTube audio in a voice channel",
  async execute(message, args) {
    if (!message.member.voice.channel) {
      return message.reply(
        "You must be in a voice channel to use this command."
      );
    }

    const voiceChannel = message.member.voice.channel;

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer();
    const stream = ytdl(args[0], { filter: "audioonly" });
    const resource = createAudioResource(stream);

    player.play(resource);
    connection.subscribe(player);

    // Clear the previous inactivity timer and start a new one
    resetInactivityTimer(connection, voiceChannel);

    player.on("error", (error) => console.error(error));

    message.channel.send("Now playing: " + args[0]);

    player.on("idle", () => {
      // Player finished, reset the inactivity timer
      resetInactivityTimer(connection, voiceChannel);
    });
  },
};

function resetInactivityTimer(connection, voiceChannel) {
  // Clear the previous inactivity timer
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }

  // Set the inactivity timer to 30 minutes (1800000 milliseconds)
  inactivityTimer = setTimeout(() => {
    voiceChannel.leave(); // Leave the voice channel
    connection.destroy(); // Clean up the connection
  }, 1800000); // 30 minutes
}
