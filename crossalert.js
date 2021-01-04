#!/usr/bin/env node
const outdir = "data";
const outfile = "averages.csv";
const insite = "https://www.barchart.com/crypto/quotes/^BTCUSD/technical-analysis";

const fs = require('fs');
const notifier = require('node-notifier');
const shell = require('shelljs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

async function main () {
  shell.mkdir('-p', outdir);
  let file = outdir + '/' + outfile;

  let prevFifty = 0.0;
  let prevTwoHundred = 0.0;

  try {
    var line = fs.readFileSync(file);
    let lineParts = line.split(',');

    if (lineParts[0] && lineParts[1]) {
      prevFifty = lineParts[0];
      prevTwoHundred = lineParts[1];
    }
  } catch (err) {
    // use defaults on file read fail
  }

  try {
    let dom = await JSDOM.fromURL(insite);

    let fiftyDay = dom.window.document.body.querySelector('tbody').querySelectorAll('tr')[2].querySelectorAll('td')[1].textContent;
    fiftyDay = fiftyDay.replace(/,/g, '').trim();

    let twoHundredDay = dom.window.document.body.querySelector('tbody').querySelectorAll('tr')[4].querySelectorAll('td')[1].textContent;
    twoHundredDay = twoHundredDay.replace(/,/g, '').trim();

    if (prevFifty >= prevTwoHundred) {
      // bull market
      if (fiftyDay < twoHundredDay) {
        // death cross
        notifier.notify({
          title: '*** Bitcoin Death Cross ***',
          message: '50 day: $' + fiftyDay + '; 200 day: $' + twoHundredDay
        });
      }
    } else {
      // bear market
      if (fiftyDay >= twoHundredDay) {
        // golden cross
        notifier.notify({
          title: '*** Bitcoin Golden Cross ***',
          message: '50 day: $' + fiftyDay + '; 200 day: $' + twoHundredDay
        });
      }
    }

    let currentState = fiftyDay + ',' + twoHundredDay + ',' + new Date();
    fs.writeFileSync(file, currentState);
  } catch (err) {
    notifier.notify({
      title: 'Cross Checker Error',
      message: err.message
    });
  }
}

main()
