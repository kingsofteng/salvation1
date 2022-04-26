const { Message, MessageEmbed } = require('discord.js');
const client = require('../index');
const db = require('../schemas/Guild');
const user = require('../schemas/User');

client.on('messageCreate', async(message) => {
    const data = await db.findOne({ id: message.guild.id });
    const prefix = client.prefix;

    if(!data) return;
    if(message.channel.id !== data.Channel) return; // not a correct channel
    if(message.content.startsWith(prefix)){ // command
        message.delete();
        return;
    }
    if(message.author.bot) return; // bot messages

    const parsedIntValue = parseInt(message.content);
    const parsedStrValue = parsedIntValue.toString();

    if(parsedStrValue !== message.content) {    // Not a number
        message.delete();
    } else if(data.Last === message.author.id) {    // The last user entered again
        message.delete();
    } else if(parsedIntValue === data.Current + 1) {
        user.findOne({ id: message.author.id, Guild: message.guild.id }, async (err, data) => {
            if(err) throw err;
            if(data) {
                data.Counts++;
            } else {
                data = new user({
                    id: message.author.id,
                    Guild: message.guild.id,
                    Counts: 1
                })
            }
            data.save();
        });

        data.Current = parseInt(message.content);
        data.Last = message.author.id;
        data.save();

        if (data.Target <= data.Current) {
            message.channel.send({ content: 'mc!leaderboard' });
            lockChannel(message);
        }
    } else {
        message.delete();
    }
    
})

function lockChannel(message) {
    message.channel.permissionOverwrites.edit(message.guild.id, {
        VIEW_CHANNEL: true,
        SEND_MESSAGES: false,
        READ_MESSAGE_HISTORY: true,
        ATTACH_FILES: false
    });
}