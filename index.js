const Discord = require('discord.js');
const fs = require('fs');
const settings = require("./settings.json");
const client = new Discord.Client();
let prefix = settings.prefix;

const replay = require('./commands/replay');

client.on('ready', () => {
    console.log('Logged in as ' + client.user.tag);
    client.user.setActivity('Replays', { type: 'WATCHING' });

});

client.on("message", async message => {
    if(message.author.bot) return;

    let command = message.content.substring(prefix.length).split(' ')[0];
    
    if(message.attachments.size > 0){
        console.log('detected file');
        var cwd = __dirname
        var url = message.attachments.find(grabURL).url;
        var isReplay = message.attachments.find(checkFile);
        console.log(url);
        if(isReplay){
            replay.run(url,cwd,message).then(() => {
                message.react('✅');
            }, (err) => {
                console.log(err);
                message.react('❌');
            });
        }
    }

    if(message.content.startsWith(prefix)){
        switch(command.toLowerCase()){
            case 'ping':
                message.channel.send('Pong!');
                break;
            // case 'json'://remove this its just for testing
            //     message.react('✅');
            //     replay.grabData('C:\\Users\\themi\\Documents\\Projects\\UCRLBot\\replays\\json\\test', message);
            //     break;
            default:
                break;
        }
    }
});

console.log(settings.token);
client.login(settings.token);

function checkFile(replayFile){
    var url = replayFile.url
    return url.indexOf("replay", url.length - "replay".length) !== -1;
}

function grabURL(replay){
    var url = replay.url
    return url;
}
