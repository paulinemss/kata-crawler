const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs'); 
const path = require('path');
const helpers = require('./helpers');
const cliSpinners = require('cli-spinners');
const ora = require('ora');
require('dotenv').config(); 

(async () => {
  // puppeteer configuration for WSL support 
  // see: https://github.com/puppeteer/puppeteer/issues/1837
  const browser = await puppeteer.launch({
    headless: true,
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-first-run',
        '--no-sandbox',
        '--no-zygote',
      ]
  });
  
  let spinner = ora({
    spinner: cliSpinners.dots,
    text: 'Starting kata crawler'
  }).start();
  const page = await browser.newPage();
  await page.goto('https://www.codewars.com/users/sign_in');
  spinner.succeed(); 

  spinner = ora({
    spinner: cliSpinners.dots,
    text: 'Entering user data & signup'
  }).start();
  await page.type('#user_email', process.env.EMAIL);
  await page.type('#user_password', process.env.PASSWORD);
  await page.click('[type="submit"]'); 
  await page.waitForNavigation(); 
  spinner.succeed();

  spinner = ora({
    spinner: cliSpinners.dots,
    text: 'Navigating to /completed_solutions'
  }).start();
  await page.goto(`https://www.codewars.com/users/${process.env.USERNAME}/completed_solutions`); 
  spinner.succeed();

  spinner = ora({
    spinner: cliSpinners.dots,
    text: 'Scrolling to the bottom'
  }).start();
  await helpers.autoScroll(page);
  spinner.succeed();

  spinner = ora({
    spinner: cliSpinners.dots,
    text: "Saving the solutions' data"
  }).start();

  const data = await page.evaluate(async () => {
    const elements = document.getElementsByClassName('list-item solutions'); 
    const arr = Array.prototype.slice.call(elements);

    return arr.map(e => {
      const obj = {};

      obj.timestamp = e.getElementsByTagName('time')[0].dateTime; 
      obj.level = e.querySelector('.item-title .inner-small-hex span').innerText; 
      obj.title = e.querySelector('.item-title a').innerText;
      obj.url = e.querySelector('.item-title a').href;
      obj.solution = e.getElementsByTagName('pre')[0].textContent;

      return obj; 
    }); 
  });
  spinner.succeed();

  spinner = ora({
    spinner: cliSpinners.dots,
    text: 'Getting kata descriptions from API'
  }).start();

  for (const e of data) {
    const apiCall = e.url.replace('kata', 'api/v1/code-challenges');
    try {
      const apiData = await axios.get(apiCall); 
      e.kata = apiData.data; 
    } catch (error) {
      spinner.fail('Error getting API data');
      process.exit();
    }
  }
  spinner.succeed();
  
  spinner = ora({
    spinner: cliSpinners.dots,
    text: 'Creating a JSON file'
  }).start();
  
  const json = JSON.stringify(data, null, 2);
  fs.writeFile(path.resolve(__dirname, 'codewars.json'), json, 'utf8', () => {
    console.log(`file created - ${__dirname}/codewars.json`);
  });
  spinner.succeed();

  spinner = ora({
    spinner: cliSpinners.dots,
    text: 'Done ✨'
  }).start();
  spinner.succeed(); 

  await browser.close();
})()