const readline = require('readline');
const commands = require('./commands');

const rl = readline.createInterface({
    input: process.stdin, output: process.stdout,
});

const commandSet = {
    a: commands.sortWordsAlphabetically,
    b: commands.showNumbersFromLesserToGreater,
    c: commands.showNumbersFromBiggerToSmaller,
    d: commands.displayInAscendingOrderByNumberOfLetters,
    e: commands.showOnlyUniqueWords,
    f: commands.showOnlyUniqueValues
}

function run() {
    rl.question('Hello. Enter 10 words or digits dividing them in spaces: ', setOfWordsOrNumbers => {
        if (setOfWordsOrNumbers === 'exit') {
            rl.close();
            return;
        }

        const arrayOfWordsOrNumbers = setOfWordsOrNumbers.trim().split(' ');

        const isArrayOfWordsOrNumbersValid = validate(arrayOfWordsOrNumbers);

        if(!isArrayOfWordsOrNumbersValid) {
            return;
        }

        displayOptionsAndRunCommand(arrayOfWordsOrNumbers);
    });
}

function validate(array) {
    if (array.length < 2) {
        console.log('Please enter at least 2 values');
    } else if (array.length > 10) {
        console.log('Please enter no more than 10 values');
    } else {
        return true;
    }

    rl.close();
    return false;
}

function displayOptionsAndRunCommand(arrayOfWordsOrNumbers) {
    const question = `What would you like to see in the output? 
    a. Sort words alphabetically
    b. Show numbers from lesser to greater
    c. Show numbers from bigger to smaller
    d. Display words in ascending order by number of letters in the word
    e. Show only unique words
    f. Display only unique values from the set of words and numbers entered by the user \n`;

    rl.question(question, userInput => {
        if (userInput === 'exit') {
            rl.close();
            return;
        }

        if (userInput in commandSet) {
            commandSet[userInput](arrayOfWordsOrNumbers);
        } else {
            rl.close();
        }

        run();
    })
}

run();
