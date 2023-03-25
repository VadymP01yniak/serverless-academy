const axios = require("axios");

const endpoints = [
  "https://jsonbase.com/sls-team/json-793",
  "https://jsonbase.com/sls-team/json-955",
  "https://jsonbase.com/sls-team/json-231",
  "https://jsonbase.com/sls-team/json-931",
  "https://jsonbase.com/sls-team/json-93",
  "https://jsonbase.com/sls-team/json-342",
  "https://jsonbase.com/sls-team/json-770",
  "https://jsonbase.com/sls-team/json-491",
  "https://jsonbase.com/sls-team/json-281",
  "https://jsonbase.com/sls-team/json-718",
  "https://jsonbase.com/sls-team/json-310",
  "https://jsonbase.com/sls-team/json-806",
  "https://jsonbase.com/sls-team/json-469",
  "https://jsonbase.com/sls-team/json-258",
  "https://jsonbase.com/sls-team/json-516",
  "https://jsonbase.com/sls-team/json-79",
  "https://jsonbase.com/sls-team/json-706",
  "https://jsonbase.com/sls-team/json-521",
  "https://jsonbase.com/sls-team/json-350",
  "https://jsonbase.com/sls-team/json-64",
];

const MAX_RETRIES = 3;

async function makeRequest(endpoint) {
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      const response = await axios.get(endpoint);
      const isDone = findIsDone(response.data);
      console.log(`[Success] ${endpoint}: isDone - ${isDone}`);
      return isDone;
    } catch (error) {
      console.error(`[Fail] ${endpoint}: ${error.message}`);
      retries++;
    }
  }
  console.error(`[Fail] ${endpoint}: The endpoint is unavailable`);
}

function findIsDone(obj) {
  if (obj.hasOwnProperty("isDone")) {
    return obj.isDone;
  }
  for (let key in obj) {
    if (typeof obj[key] === "object") {
      const isDone = findIsDone(obj[key]);
      if (isDone !== undefined) {
        return isDone;
      }
    }
  }
  return undefined;
}

async function main() {
  let trueCount = 0;
  let falseCount = 0;
  for (let endpoint of endpoints) {
    const isDone = await makeRequest(endpoint);
    if (isDone === true) {
      trueCount++;
    } else if (isDone === false) {
      falseCount++;
    }
  }
  console.log(`Found True values: ${trueCount}`);
  console.log(`Found False values: ${falseCount}`);
}

main();
