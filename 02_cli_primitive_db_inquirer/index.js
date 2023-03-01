const fs = require('fs').promises;
const inquirer = require('inquirer');

async function start() {
    const users = await loadDatabase();

    while (true) {
        const shouldAddUser = await askToContinue('Would you like to add a user?');

        if (!shouldAddUser) {
            break;
        }

        const user = await getUserInfo();

        if (Object.keys(user).length === 0) {
            break;
        }

        users.push(user);

        await saveDatabase(users);
    }

    const shouldSearchForUser = await askToContinue('Would you like to search values in DB?');

    if (shouldSearchForUser) {
        await searchForUserInDB(users);
    }
}

async function loadDatabase() {
    try {
        const data = await fs.readFile('db.txt');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error:', error.message);
        return [];
    }
}

async function saveDatabase(users) {
    try {
        const data = JSON.stringify(users, null, 2);
        await fs.writeFile('db.txt', data);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function askToContinue(message) {
    const { continueAction } = await inquirer.prompt({
        type: 'confirm',
        name: 'continueAction',
        message: message,
        default: true
    });

    return continueAction;
}

async function getUserInfo() {
    const userAnswers = await inquirer.prompt([
        {
            name: 'user',
            type: 'input',
            message: "Enter the user's name. To cancel press ENTER:"
        },
        {
            name: 'gender',
            type: 'list',
            message: 'Choose your gender:',
            choices: [
                'male',
                'female'
            ]
        },
        {
            name: 'age',
            type: 'input',
            message: 'Enter your age:'
        }
    ]);

    return userAnswers.user ? userAnswers : {};
}

async function searchForUserInDB(users) {
    try {
        const { user } = await inquirer.prompt({
            name: 'user',
            type: 'input',
            message: 'Enter the name of the user you want to find in the database:'
        });

        if (!user) {
            console.log('Error: No username provided');
            return;
        }

        const foundUser = users.find((entry) => entry.user.toLowerCase() === user.toLowerCase());

        if (foundUser) {
            console.log(`User ${foundUser.user} was found`);
            console.log(`{"user": "${foundUser.user}", "gender": "${foundUser.gender}", "age": "${foundUser.age || 'unknown'}"}`);
        } else {
            console.log(`User ${user} not found in database`);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

start();
