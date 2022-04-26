const { Client, Message, MessageEmbed } = require('discord.js');
const { ReactionPages } = require('reconlx');
const data = require('../../schemas/User');

module.exports = {
    name: 'leaderboard',

    run: async(client, message, args) => {
        data.find({ Guild: message.guild.id }, async(err, data) => {
            if (err) throw err;

            const sort = data.sort((a, b) => b.Counts - a.Counts);

            let i = 1;

            if (data.length > 10) {
                const chunks = chunkz(sort, 10);
                const arry = [];

                for(chunk of chunks) {
                    const chunking = chunk.map((v) => `\`#${i++}\` <@${v.id}> (${v.Counts} counts)`).join('\n\n');

                    const msgTitle = 'Leaderboard in ' + message.guild.name;
                    const msgColor = '#00ff00';
                    const msgDescription = chunking;
                    const embededMessage = buildMessage(
                        msgTitle, msgColor, msgDescription
                    );
                    arry.push( embededMessage );
                }
                
                ReactionPages(message, arry, true);
            } else {
                const mapping = sort.map((v) => `\`#${i++}\` <@${v.id}> (${v.Counts} counts)`).join('\n\n');

                const msgTitle = 'Leaderboard in ' + message.guild.name;
                const msgColor = '#00ff00';
                const msgDescription = mapping;
                const embededMessage = buildMessage(
                    msgTitle, msgColor, msgDescription
                );

                message.channel.send( {embeds: [embededMessage] } );
            }
        })
    }
}

function buildMessage(title, color, desc) {
    const embededMessage = new MessageEmbed({
        title: title, 
        color: color, 
        description: desc} );
    return embededMessage;
}

function chunkz (arr, size) {
    var array = [];
    for(var i = 0; i < arr.length; i+= size) {
        array.push(arr.slice(i, i+size));
    }
    return array;
}