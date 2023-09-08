const express = require('express');
const router = express.Router();
// const axios = require('axios');
const path = require('path');
// const request = require('request');

async function getDayInfo(req, res, next) {
  console.log('Enter GetDayInfo!');
  const { year, month, day } = req.body;

  try {
    const dayUrl = `https://api.wikimedia.org/feed/v1/wikipedia/en/featured/${year}/${month}/${day}`;

    const response = await fetch(dayUrl, {
      headers: {
        Authorization: process.env.WIKI_API_KEY,
        'Api-User-Agent': 'william851214@gmail.com',
      },
    });

    let data = await response.json();
    // console.log(data);
    let onThisDay = data.onthisday;

    let dayHistoryData = [];

    for (let i = 0; i < onThisDay.length; i++) {
      const title = onThisDay[i].text;
      const year = onThisDay[i].year;
      // get the first page obj -> pages[0]
      const img = onThisDay[i].pages[0].thumbnail.source;
      const url =
        onThisDay[i].pages[0].content_urls.desktop.page;

      dayHistoryData.push({
        title: title,
        year: year,
        img: img,
        url: url,
      });
    }

    res.locals.responseGetDayData = {
      success: true,
      data: dayHistoryData,
    };
  } catch (err) {
    console.log('Error occurred in OnThisDay API: ', err);
    res.locals.responseGetDayData = {
      success: false,
      msg: err,
    };
    next();
  }
}

router.post('', getDayInfo, function (req, res, next) {
  if (res.locals.responseGetDayData.success) {
    const rsp = res.locals.responseGetDayData;
    return res.status(200).json({
      success: true,
      data: rsp,
    });
  } else {
    return res.status(500).json({
      success: false,
      msg: res.locals.responseGetDayData.msg,
    });
  }
});

module.exports = router;
