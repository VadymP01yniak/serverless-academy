const fs = require('fs');
const program = require('commander');
const dotenv = require('dotenv');
const bot = require('./bot');

function sendMessageAndExit(message) {
    dotenv.config();

    bot.sendMessage(process.env.CHAT_ID, message)
        .then(() => process.exit())
        .catch((err) => {
            console.error('Error sending message: ', err);
            process.exit(1);
        });
}

function sendPhotoAndExit(path) {
    dotenv.config();

    const photoBuffer = fs.readFileSync(path);

    bot.sendPhoto(process.env.CHAT_ID, photoBuffer)
        .then(() => process.exit())
        .catch((err) => {
            console.error('Error sending photo: ', err);
            process.exit(1);
        });
}

program
    .version('1.1.1')
    .command('message <message>')
    .alias('m')
    .description('Send a message to Telegram Bot')
    .action(sendMessageAndExit);

program
    .command('photo <path>')
    .alias('p')
    .description('Send photo to Telegram Bot. Just drag and drop it in console after p-flag')
    .action(sendPhotoAndExit);

program.parse(process.argv);
