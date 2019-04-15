const Discord = require('discord.js');
const https = require('https');
const fs = require('fs');

var fileName;

module.exports = {

    run: function (url, cwd, msg) {
        msg.react('⏰');
        this.download(url).then(() => {
            this.convert(url, cwd, msg).then(() => {
                msg.react('✅');
            }, (err) => {
                console.log(err);
                msg.react('❌');
            });
        }, (err) => {
            console.log(err);
            msg.react('❌');
        });
        //this.convert(url, cwd, msg);
    },

    download: function (url) {
        return new Promise((resolve, reject) => {
            fileName = url.substring(url.lastIndexOf('/') + 1);
            fileName = fileName.substring(0, fileName.lastIndexOf('.'));
            console.log('Downloading: ' + url);
            console.log('File Name: ' + fileName);
            const file = fs.createWriteStream("./replays/replay/" + fileName + '.replay');
            const request = https.get(url, function (response) {
                response.pipe(file);
            }).on('error', (err) => {
                console.log('Error in replay.js download function');
                reject(err);
            }).on('close', () => {
                resolve();
            });
        });
    },

    convert: function (url, cwd, msg) {
        return new Promise((resolve, reject) => {
            console.log(cwd);
            var jsonjFilePath = cwd + '/replays/json/' + fileName;
            var replayFilePath = cwd + '/replays/replay/' + fileName;
            const { exec } = require('child_process');
            exec('rattletrap -i ' + replayFilePath + '.replay > ' + jsonjFilePath + '.json', (err, stdout, stderr) => {
                console.log('Running Parser');
                if (err) {
                    console.log('Error in replay.js convert function');
                    reject(err);
                    //if it fails delete everything along with it TODO
                } else {
                    resolve();
                    console.log('file is parsed');
                }
            });
        });
    }
}