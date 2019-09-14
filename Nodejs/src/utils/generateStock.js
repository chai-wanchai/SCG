const ejs = require('ejs')
const fs = require("fs");
const path = require('path')
const puppeteer = require('puppeteer')
const sharp = require('sharp');
export async function renderStock(data,metaData) {
  const html = await ejs.renderFile(path.join(__dirname, '../views/chart.ejs'), {
    data: data,
    name: `Historical Price of ${metaData.ric} from ${metaData.startDate} to ${metaData.endDate}`
  })
  fs.writeFile(path.join(__dirname, `../public/${metaData.fileName}.html`), html, "utf8", (err) => {
    if (err) throw err;
    console.log('Saved! file :'+metaData.fileName);
  });
  const browser = await puppeteer.launch({
    // headless: false,
    ignoreHTTPSErrors: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ]
  })
  const page = await browser.newPage()
  await page.setContent(html)
  await page.waitFor(1500)
  let img = await page.screenshot({
    path: path.join(__dirname, `../public/${metaData.fileName}.png`)
  })
  sharp(img).resize(240, 240).jpeg({
    quality: 100,
    chromaSubsampling: '4:4:4'
  }).toFile(path.join(__dirname, `../public/preview-${metaData.fileName}.jpeg`), (err, info) => { console.log(info,'pic resize') });
  await browser.close()
  return {
    stockPicture:`/stock/${metaData.fileName}.png`,
    previewPicture:`/stock/preview-${metaData.fileName}.jpeg`,
    url:`/stock/${metaData.fileName}.html`
  }
}