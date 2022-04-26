const { Client, Message, MessageEmbed, Permissions } = require('discord.js');
const Guild = require('../../schemas/Guild');
const User = require('../../schemas/User');

module.exports = {
    name: 'set-channel',
    run: async(client, message, args) => {
        if(!message.member.permissions.has('ADMINISTRATOR')) return message.reply('You do not have permissions.');
        
        const channel = message.mentions.channels.first();
        const target = parseInt(args[1]);
        
        if(!channel){
            message.reply('Please specificy a channel! ');
            return;
        }

        if(!target) {
            message.reply('Please specificy a target!');
            return;
        }else {
            if(target < 10) {
                message.reply('Target should be more than 10.');
                return;
            }
        }
        initialize(message, target);
    }
}

function initialize(message, target) {
    const guildId = message.guild.id;
    User.deleteMany(
        {
            Guild: guildId
        }, 
        async(err, data) => {
            if(err) {
                console.log(err);
                message.reply('Something went wrong. Please try again later.');
            } else {
                console.log('All data successfully deleted.');
                initCounting(message, target);
            }
    });
}

function initCounting(message, target) {
    const channel = message.mentions.channels.first();

    Guild.findOne({
        id: message.guild.id
    }, async(err, data) => {
        if(err) throw err;
        if(data) {
            data.Channel = channel.id;
            data.Current = 0;
            data.Target = target;
            data.Last = "";
        } else {
            data = new Guild({
                id: message.guild.id,
                Current: 0,
                Channel: channel.id,
                Target: target
            })
        }
        data.save();
        
        unlockChannel(message);
        channel.send({content: 'Counting game started. Start with 1.'});
    })
}

function unlockChannel(message) {
    const channel = message.mentions.channels.first();
    channel.permissionOverwrites.edit(message.guild.id, {
        VIEW_CHANNEL: true,
        SEND_MESSAGES: true,
        READ_MESSAGE_HISTORY: true,
        ATTACH_FILES: true
    });
    
}