const puppeteer = require("puppeteer");

const fbPage = "https://www.facebook.com/";
const targetPage =
  "https://www.facebook.com/psantosfitt/posts/3058604314253749";

function startComment(page) {
  const iterator = async (resolve, reject, iteration = 0) => {
    try {
      const comment = "Up";
      const inputQuery = "div.notranslate";

      if ((await page.url()) === targetPage) {
        if (iteration === 0) {
          await page.waitFor(inputQuery);
        }

        await page.type(inputQuery, comment);

        await page.waitFor(1000 * 10); // 10s

        await page.keyboard.press(String.fromCharCode(13));
      }

      if (iteration >= 10000) {
        resolve();
      } else {
        return iterator(resolve, reject, iterator + 1);
      }
    } catch (e) {
      reject(e);
    }
  };

  return new Promise((resolve, reject) => iterator(resolve, reject));
}

async function main() {
  try {
    const email = "your email goes here";
    const pass = "your password goes here";

    const browser = await puppeteer.launch({ headless: false, timeout: 30000 });
    const page = await browser.newPage();

    // set user agent (override the default headless User Agent)
    await page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
    );

    await page.goto(fbPage);

    await page.waitFor("input#email");
    await page.waitFor("input#pass");

    await page.type("input#email", email);
    await page.type("input#pass", pass);
    await page.tap("input[type=submit]");

    await page.waitFor(2500);
    await page.goto(targetPage);

    await startComment(page);

    await browser.close();
  } catch (e) {
    console.log({ e });
  }
}

main();
