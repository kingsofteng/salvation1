const { Client, Message, MessageEmbed } = require('discord.js');
const Guild = require('../../schemas/Guild');

module.exports = {
    name: 'update-target',
    run: async(client, message, args) => {
        if(!message.member.permissions.has('ADMINISTRATOR')) return message.reply('You do not have permissions.');
        const target = parseInt(args[1]);

        if(!target) {
            message.reply('Please specificy a target!');
            return;
        }else {
            if(target < 10) {
                message.reply('Target should be more than 10.');
                return;
            }
        }

        Guild.findOne({
            id: message.guild.id
        }, async(err, data) => {
            if(err) throw err;
            if(data) {
                data.Target = target;
                data.save();
                message.channel.send('Target was successfully updated.');
            } else {
                message.channel.send('Game was not initiated. Please try set-channel first.');
            }
        })
    }
}