function sortWordsAlphabetically(words) {
    const areWordsValid = words.every((word) => /^[a-z\-]+$/i.test(word));

    if (areWordsValid) {
        const sortedWords = words.slice().sort();

        console.log(sortedWords);
    } else {
        console.log('Please enter valid words containing only letters (hyphens allowed)');
    }
}

function showNumbersFromLesserToGreater(numbers) {
    const areNumbersValid = numbers.every((num) => !isNaN(num));

    if (areNumbersValid) {
        const sortedNumbers = [...numbers].sort((a, b) => a - b);

        console.log(sortedNumbers);
    } else {
        console.log('Please enter valid numbers');
    }
}

function showNumbersFromBiggerToSmaller(numbers) {
    const areNumbersValid = numbers.every((num) => !isNaN(num));

    if (areNumbersValid) {
        const sortedNumbers = [...numbers].sort((a, b) => b - a);

        console.log(sortedNumbers);
    } else {
        console.log('Please enter valid numbers');
    }
}

function displayInAscendingOrderByNumberOfLetters(words) {
    const areWordsValid = words.every((word) => /^[a-z\-]+$/i.test(word));

    if (areWordsValid) {
        const sortedWords = words.slice().sort((a, b) => a.length - b.length);

        console.log(sortedWords);
    } else {
        console.log('Please enter valid words');
    }
}

function showOnlyUniqueWords(words) {
    const areWordsValid = words.every((word) => /^[a-z\-]+$/i.test(word));

    if (areWordsValid) {
        const uniqueWords = [...new Set(words)];

        console.log(uniqueWords);
    } else {
        console.log('Please enter valid words');
    }
}

function showOnlyUniqueValues(array) {
    const areArrayValuesValid = array.every(value => /^[a-z\-]+$/i.test(value) || !isNaN(Number(value)));

    if (areArrayValuesValid) {
        const uniqueValues = [...new Set(array)];

        console.log(uniqueValues);
    } else {
        console.log('Please enter valid words and / or numbers');
    }
}

module.exports = {
    sortWordsAlphabetically,
    showNumbersFromLesserToGreater,
    showNumbersFromBiggerToSmaller,
    displayInAscendingOrderByNumberOfLetters,
    showOnlyUniqueWords,
    showOnlyUniqueValues
}
