const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
const NodeCache = require('node-cache');

const TOKEN = '6203560990:AAE-ooTR5SWcEYrTNdpOUCu4wMgwgmWwVvk';
const bot = new TelegramBot(TOKEN, { polling: true });
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

bot.setMyCommands([
    { command: '/start', description: 'start' }
]);

bot.on('message', async message => {
    const chatId = message.chat.id;

    if (message.text === '/start') {
        const exchangeRateOptions = {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'USD',
                            callback_data: 'exchangeRate:usd'
                        },
                        {
                            text: 'EUR',
                            callback_data: 'exchangeRate:eur'
                        }
                    ]
                ]
            }
        };

        bot.sendMessage(chatId, 'Welcome to the Exchange Rates bot! Please choose a currency:', exchangeRateOptions);
    }
});

bot.on('callback_query', async callbackQuery => {
    const chatId = callbackQuery.message.chat.id;
    const callbackData = callbackQuery.data;

    if (callbackData.startsWith('exchangeRate:')) {
        const currency = callbackData.split(':')[1];
        const exchangeRate = await getExchangeRate(currency);

        if (exchangeRate) {
           bot.sendMessage(chatId, `1 ${currency.toUpperCase()} = ${exchangeRate.buy} UAH (buy rate)`);
           bot.sendMessage(chatId, `1 ${currency.toUpperCase()} = ${exchangeRate.sell} UAH (sell rate)`);
       } else {
           bot.sendMessage(chatId, `Sorry, could not get exchange rate for ${currency.toUpperCase()}.`);
       }
    }
});

const getExchangeRate = async currency => {
    const cacheKey = `exchangeRate:${currency}`;

    try {
        const cachedResponse = cache.get(cacheKey);
        if (cachedResponse) {
            return cachedResponse;
        }

        const response = await axios.get(`https://api.monobank.ua/bank/currency`);
        const currencyInfo = response.data.find(info => info.currencyCodeA === getCurrencyCode(currency));

        if (!currencyInfo) {
            throw new Error(`Could not find exchange rate info for ${currency}`);
        }

        const exchangeRate = {
            base_ccy: 'UAH',
            buy: currencyInfo.rateBuy,
            sell: currencyInfo.rateSell
        };

        cache.set(cacheKey, exchangeRate);

        return exchangeRate;
    } catch (monobankError) {
        console.error(`Monobank API error: ${monobankError}`);

        return getExchangeRateFromPrivatBank(currency, cacheKey);
    }
};

const getExchangeRateFromPrivatBank = async (currency, cacheKey) => {
    try {
        const cachedResponse = cache.get(cacheKey);
        if (cachedResponse) {
            return cachedResponse;
        }

        const response = await axios.get(`https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5`);

        const currencyInfo = response.data.find(info => info.ccy.toLowerCase() === currency);

        if (!currencyInfo) {
            throw new Error(`Could not find exchange rate info for ${currency}`);
        }

        const exchangeRate = {
            base_ccy: currencyInfo.base_ccy,
            buy: parseFloat(currencyInfo.buy),
            sell: parseFloat(currencyInfo.sale)
        };

        cache.set(cacheKey, exchangeRate);

        return exchangeRate;
    } catch (privatbankError) {
        console.error(`PrivatBank API error: ${privatbankError}`);

        throw new Error(`Could not get exchange rate for ${currency} from Monobank or PrivatBank`);
    }
};

const getCurrencyCode = currency => {
    const currencyCodes = {
        usd: 840,
        eur: 978
    };

    return currencyCodes[currency] || null;
};
