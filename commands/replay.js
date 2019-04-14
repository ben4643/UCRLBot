const Discord = require('discord.js');
const https = require('https');
const fs = require('fs');

var fileName;

module.exports = {
    download: function (url) {
        fileName = url.substring(url.lastIndexOf('/') + 1);
        fileName = fileName.substring(0, fileName.lastIndexOf('.'));
        console.log('Downloading: ' + url);
        console.log('File Name: ' + fileName);
        const file = fs.createWriteStream("./replays/replay/" + fileName + '.replay');
        const request = https.get(url, function (response) {
            response.pipe(file);
        }).on('error', (err) => {
            console.log('Error in replay.js download function');
            console.log(err);
            return false;
        });
        return true;
    },

    convert: function (cwd, url, msg) {
        console.log(cwd);
        var jsonjFilePath = cwd+'/replays/json/'+fileName;
        const { exec } = require('child_process');
        exec('rattletrap -i '+url+' > '+jsonjFilePath+'.json', (err, stdout, stderr) => {
            console.log('Running Parser');
            if (err) {
                console.log(err);
                msg.react('❌');
                //if it fails delete everything along with it TODO
            }else{
                console.log('file is parsed');
                msg.react('✅');
            }
        });
    }
}