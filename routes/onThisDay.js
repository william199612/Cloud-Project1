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

    const data = await response.json();
    // console.log(data);
    const onThisDay = data.onthisday;
    // dayDetail stores the array of day history
    let dayDetail = [];
    // Set a image for today's representative
    const todayImg = data.tfa.thumbnail.source;
    const todayImgText = data.tfa.description.text;

    const dayHistoryData = {
      todayImg: todayImg,
      todayImgText: todayImgText,
      dayDetail: dayDetail,
    };

    for (let i = 0; i < onThisDay.length; i++) {
      const title = onThisDay[i].text;
      const year = onThisDay[i].year;
      const url =
        onThisDay[i].pages[0].content_urls.desktop.page;

      dayDetail.push({
        title: title,
        year: year,
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
  }
  console.log('Done GetDayInfo!');
  next();
}

router.post('', getDayInfo, function (req, res, next) {
  console.log('Router posting from onThisDay!');
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
