const Discord = require('discord.js');
const https = require('https');
const fs = require('fs');

var fileName;
var jsonFilePath;
var replayFilePath;

module.exports = {

    run: function (url, cwd, message) {
        return new Promise((resolve, reject) => {
            message.react('⏰').then(() => {
                this.download(url).then(() => {
                    this.convert(cwd).then(() => {
                        this.grabData(jsonFilePath,message);
                        resolve();
                    }, (err) => {
                        reject(err);
                        //TODO: When failing delete files that failed as to save storage
                    });
                }, (err) => {
                    reject(err);
                });
            });
        });
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

    convert: function (cwd) {
        return new Promise((resolve, reject) => {
            console.log(cwd);
            jsonFilePath = cwd + '\\replays\\json\\' + fileName;
            replayFilePath = cwd + '\\replays\\replay\\' + fileName;
            const { exec } = require('child_process');
            exec('rattletrap -ci ' + replayFilePath + '.replay > ' + jsonFilePath + '.json', (err, stdout, stderr) => {
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
    },
    /*
    Need to grab:
    ID
    Player Name
    Score
    Goals
    Assists
    Saves
    Anything else useful
    Replay Name
    Date

    Path to player stats
    "jsonFile"
    "header"
    "body"
    "properties" Where the mass amount of info starts
    "value"
    "PlayerStats"
    "value"
    "array" Where each person starts maybe make an object out of each one?
    "value"
    "Stat" Assists, Goals, OnlineID etc.
    "value" value of Stat
    */
    grabData: function (jsonFilePath, message) {
        console.log(jsonFilePath);
        const jsonFile = require(jsonFilePath+".json");
        var playerStats = jsonFile.header.body.properties.value.PlayerStats.value;
        console.log(playerStats.array.length);
        message.channel.send('Found '+playerStats.array.length+' players');
        for(var i = 0; i<playerStats.array.length; i++){
            var playerID = playerStats.array[i].value.OnlineID.value.q_word
            var playerName = playerStats.array[i].value.Name.value.str;
            message.channel.send('Found Player ID for '+playerName+' it is '+playerID);
        }


    }
}