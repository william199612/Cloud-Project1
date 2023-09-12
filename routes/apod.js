const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

async function getApodInfo(req, res, next) {
  console.log('Enter GetApodInfo!');
  const { year, month, day } = req.body;

  try {
    const apodUrl = `https://api.nasa.gov/planetary/apod?api_key=${process.env.APOD_API_KEY}&date=${year}-${month}-${day}`;
    const response = await fetch(apodUrl);
    const data = await response.json();
    // console.log(data);

    res.locals.responseGetApodData = {
      success: true,
      apodImg: data.hdurl,
      imgAlt: data.title,
      msg: data.msg,
    };
  } catch (err) {
    console.log('Error occurred in OnThisDay API: ', err);
    res.locals.responseGetApodData = {
      success: false,
      msg: err,
    };
  }
  next();
}

router.post('', getApodInfo, function (req, res, next) {
  console.log('Router posting from apod!');
  if (res.locals.responseGetApodData.success) {
    const rsp = res.locals.responseGetApodData;
    return res.status(200).json({
      success: true,
      data: rsp,
    });
  } else {
    return res.status(500).json({
      success: false,
      msg: res.locals.responseGetApodData.msg,
    });
  }
});

module.exports = router;
