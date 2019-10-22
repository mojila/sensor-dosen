const puppeteer = require('puppeteer');


const url = 'https://mis.eepis-its.edu/unit/pegawai/absensi/rekap.php';

async function run () {
    const browser = await puppeteer.launch( );
    const page = await browser.newPage();
    let data = [];
    let results = [];

    await page.goto(url);
    await page.select('body > center > form > table:nth-child(2) > tbody > tr:nth-child(1) > td:nth-child(2) > select', '4');
    await page.waitForSelector('body > center > form > table:nth-child(39)');
    await page.select('body > center > form > table:nth-child(2) > tbody > tr:nth-child(1) > td:nth-child(5) > select', '4');
    await page.waitForSelector('body > center > form > table:nth-child(39) > tbody > tr:nth-child(29) > td:nth-child(2)');

    data = await page.$$eval('body > center > form > table:nth-child(39) > tbody > tr', trs => trs.map(tr => {
        let tds = [...tr.getElementsByTagName('td')];
        return tds.map(td => td.textContent);
    }));

    data.forEach((d, index) => {
        if (index >= 3) {
            return results.push({
                dosen: data[index][2].trim().replace('\n','').replace('\'', ''),
                status: data[index][7].trim().replace('\n','')
            });
        }
    });

    console.table(results);

    return browser.close();
}

run()
    .then(() => process.exit(0));
