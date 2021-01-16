<a href="https://gyazo.com/7741483b54b91783d78b5d62b1be57c8"><img src="https://i.gyazo.com/7741483b54b91783d78b5d62b1be57c8.gif" alt="Image from Gyazo" width="200"/></a>

# Kata Crawler 

> Export your Codewars completed solutions into json data

### How to use 

- Run `npm i` to install
- Create a `.env` file following `.env.example`
- Add your Codewars login credentials to the `.env` file
```js
EMAIL= /* email linked to your Codewars account */
PASSWORD= /* password linked to your Codewars account */ 
USERNAME= /* Codewars username, must be case-sensitive */ 
```
- Run `npm start`
- Your file will be generated as `codewars.json` ✨ 

### Windows and WSL support

You might need to install an X Server on Windows, such as [this one](https://sourceforge.net/projects/vcxsrv/). To configure puppeteer for WSL, please read [this](https://github.com/puppeteer/puppeteer/issues/1837).
