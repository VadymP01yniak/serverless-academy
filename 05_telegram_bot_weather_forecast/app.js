const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

const TOKEN = '5439742497:AAEK_GEcrI3Kk1QxZq-oaTr2R5lIwMKweCo';
const OPEN_WEATHER_API_KEY = '9fd027a6bc24c2cb1d992f0051b085cb';

const bot = new TelegramBot(TOKEN, { polling: true });

bot.setMyCommands([
    { command: '/start', description: 'start' }
]);

bot.on('message', async message => {
    const chatId = message.chat.id;

    if (message.text === '/start') {
        bot.sendMessage(chatId, 'Welcome to the Weather Forecast bot! To get the weather forecast type city name.');
    } else {
        const city = message.text;
        const isWeatherForecastAvailable = await getWeatherForecast(city);

        if (isWeatherForecastAvailable) {
            const weatherIntervalOptions = {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: `Forecast in ${city}`,
                                callback_data: `forecast:${city}`
                            }
                        ]
                    ]
                }
            };

            bot.sendMessage(chatId, '👇', weatherIntervalOptions);
        } else {
            bot.sendMessage(chatId, `Sorry, could not get weather forecast for ${city}.`);
        }
    }
});

bot.on('callback_query', async callbackQuery => {
    const chatId = callbackQuery.message.chat.id;
    const callbackData = callbackQuery.data;

    if (callbackData.startsWith('forecast:')) {
        const city = callbackData.split(':')[1];
        const weatherIntervalOptions = {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [
                        { text: '3 hours', callback_data: `interval:${city}:3` },
                        { text: '6 hours', callback_data: `interval:${city}:6` }
                    ]
                ]
            })
        };

        bot.editMessageText(`Choose an interval to get the weather forecast for ${city}:`, {
            chat_id: chatId,
            message_id: callbackQuery.message.message_id,
            reply_markup: weatherIntervalOptions.reply_markup
        });
    } else if (callbackData.startsWith('interval:')) {
        const [_, city, interval] = callbackData.split(':');
        const weatherForecast = await getWeatherForecast(city);
        const weatherForecastMessage = generateWeatherForecastMessage(weatherForecast, interval);

        bot.sendMessage(chatId, weatherForecastMessage);
    }
});

const getWeatherForecast = async city => {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${OPEN_WEATHER_API_KEY}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

const generateWeatherForecastMessage = (weatherData, interval) => {
    const message = `Weather forecast for ${weatherData.city.name}:\n`;
    const weatherList = weatherData.list.filter((data, index) => index % interval === 0);
    const weatherMap = new Map();

    weatherList.forEach(data => {
        const date = new Date(data.dt * 1000);
        const options = { hourCycle: 'h23', hour: 'numeric' };
        const time = date.toLocaleTimeString('en-US', options);
        const temperature = Math.round(data.main.temp - 273.15);
        const description = data.weather[0].description;

        if (!weatherMap.has(time)) {
            weatherMap.set(time, `${time}:00: ${temperature}°C, ${description}`);
        }
    });

    const sortedForecast = [...weatherMap.values()].sort((a, b) => {
        let timeA = parseInt(a.split(':')[0]);
        let timeB = parseInt(b.split(':')[0]);

        if (timeA === 0) timeA = 24;
        if (timeB === 0) timeB = 24;

        return timeA - timeB;
    }).join('\n');

    return message + sortedForecast;
};
