module.exports.autoScroll = async function (page){
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      const distance = 1000;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);

        const loader = document.getElementsByClassName('js-infinite-marker'); 
        if(loader.length === 0){
          clearInterval(timer);
          resolve();
        }
      }, 300);
    });
  });
}