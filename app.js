const puppeteer = require('puppeteer');
const firebase = require('firebase');

const firebaseConfig = {
    apiKey: "AIzaSyBktPzDX06oMIpxXi-659DS4BirUjUvwtk",
    authDomain: "sensor-dosen.firebaseapp.com",
    databaseURL: "https://sensor-dosen.firebaseio.com",
    projectId: "sensor-dosen",
    storageBucket: "sensor-dosen.appspot.com",
    messagingSenderId: "345964966595",
    appId: "1:345964966595:web:dd5115b3b0ab7b5acaa876"
};

const app = firebase.initializeApp(firebaseConfig);

const url = 'https://mis.eepis-its.edu/unit/pegawai/absensi/rekap.php';

const db = app.database();

function writeStatusData(data) {
    db.ref('/status').set({
        dosen: data
    });
}

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

    await data.forEach((d, index) => {
        if (index >= 3) {
            let dosen = data[index][2].trim().replace('\n','').replace('\'', '');
            let datang = data[index][5].trim().replace('\n','') === '-' ? 'belum':'sudah';
            let pulang = data[index][6].trim().replace('\n','') === '-' ? 'belum':'sudah';

            return results.push({
                dosen,
                datang,
                pulang
            });
        }
    });

    await writeStatusData(results);

    return browser.close();
}

run()
    .then(() => process.exit(0));

