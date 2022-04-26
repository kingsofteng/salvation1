require('dotenv').config();

const { Collection, Client, Discord, Intents } = require('discord.js');
const client = new Client({ 
    intents: [
        Intents.FLAGS.GUILDS, 
        Intents.FLAGS.GUILD_MESSAGES
    ] 
});

const path = require('path')
const fs = require('fs')
const config = require('./config.json');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_CONNECTION, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
module.exports = client;
client.commands = new Collection();
client.prefix = config.prefix;
client.aliases = new Collection();
client.categories = fs.readdirSync(path.resolve('src/commands'));
["command"].forEach(handler => {
    require(path.resolve(`src/handlers/${handler}`))(client);
}); 

client.login(process.env.BOT_TOKEN);

// server setup
const http = require('http');

const requestListener = function (req, res) {
  res.writeHead(200);
  res.end('Hello, World!');
}

const server = http.createServer(requestListener);
server.listen(8080);