const puppeteer = require('puppeteer');

const CONFIG = {
  flag: 'CTF{w41t_i_th0u6h7_1_wa5_uns0lvab1e}',
  cookieName: 'flag',
  timeout: 5000,
  userAgent: 'hejude',
  waitTime: 1000
};

async function visitURL(url) {
  const config = CONFIG
  
  console.log(`start visit to: ${url}`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent(config.userAgent);
    
    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname;
    
    console.log(`ccokie set`);
    
    await page.setCookie({
      name: config.cookieName,
      value: config.flag,
      domain: domain.includes(':') ? domain.split(':')[0] : domain,
      path: '/',
      httpOnly: false
    });
    
    console.log(`going to ${url}`);
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: config.timeout
    });
    await setTimeout(config.waitTime);
    
    console.log(`success visiting ${url}`);
    
  } catch (error) {
    console.error(`error in visit:`, error);
  } finally {
    await browser.close();
    console.log(`browser closed`);
  }
}

module.exports = {
  visitURL,
  config: CONFIG
};