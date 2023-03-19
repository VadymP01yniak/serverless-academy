const fs = require('fs');

const usernameRegex = /^\w+-\w+$/;

function countUniqueUsernames() {
    const usernames = new Set();

    for (let i = 1; i < 20; i++) {
        const fileContent = fs.readFileSync(`out${i}.txt`, 'utf-8');
        const words = fileContent.split(/\s+/);

        words.forEach((word) => {
            if(usernameRegex.test(word)) {
                usernames.add(word)
            }
        })
    }

    return usernames.size;
}

function countUsernamesExistingInAllFiles() {
    const firstFileContent = fs.readFileSync('out0.txt', 'utf-8');
    const words = firstFileContent.split(/\s+/);
    const firstFileUsernames = new Set(words.filter((word) => usernameRegex.test(word)));

    for (let i = 1; i < 20; i++) {
        const fileContent = fs.readFileSync(`out${i}.txt`, 'utf-8');
        const words = fileContent.split(/\s+/);
        const fileUsernames = new Set(
            words.filter((word) => usernameRegex.test(word))
        );

        for (let username of firstFileUsernames) {
            if (!fileUsernames.has(username)) {
                firstFileUsernames.delete(username);
            }
        }
    }

    return firstFileUsernames.size;
}

function countUsernamesExistingInAtLeastTenFiles() {
    const usernameCount = new Map();

    for (let i = 1; i < 20; i++) {
        const fileContent = fs.readFileSync(`out${i}.txt`, 'utf-8');
        const words = fileContent.split(/\s+/);
        const usernames = words.filter((word) => usernameRegex.test(word));

        for (let username of usernames) {
            usernameCount.set(
                username,
                (usernameCount.get(username) || 0) + 1
            );
        }
    }

    const filteredUsernames = Array.from(usernameCount.entries()).filter(
        ([username, count]) => count >= 10
    );

    return filteredUsernames.length;
}

const startTime = Date.now();

console.log(`Count of unique usernames in all files: ${countUniqueUsernames()}`);
console.log(`Count of usernames existing in all files: ${countUsernamesExistingInAllFiles()}`);
console.log(`Count of usernames existing in at least 10 files: ${countUsernamesExistingInAtLeastTenFiles()}`);

console.log(`Counted in ${Date.now() - startTime} ms`);