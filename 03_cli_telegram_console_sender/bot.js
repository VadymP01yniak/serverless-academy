const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
const fs = require("fs");

dotenv.config();

const TOKEN = '5782336411:AAHEL_UPj7dbwa7r6Xjq15KZUySCHDrdayg';
const bot = new TelegramBot(TOKEN, { polling: true });

bot.on('message', message => {
    const chatId = message.chat.id;
    console.log(`Received a message from chat ID: ${chatId}`);

    // Save the chat ID to a dotenv local variable
    dotenv.config();
    process.env.CHAT_ID = chatId.toString();
    fs.writeFileSync('.env', `CHAT_ID=${process.env.CHAT_ID}`);

    // Send a response back to the user
    bot.sendMessage(chatId, 'Received your message!');
});

module.exports = bot;
