const express = require('express');
const router = express.Router();

async function getWeatherInfo(req, res, next) {
  console.log('Enter GetWeatherInfo!');
  const { city, year, month, day } = req.body;

  try {
    const weatherUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/${year}-${month}-${day}?key=${process.env.WEATHER_API_KEY}`;

    const response = await fetch(weatherUrl);
    const data = await response.json();
    // console.log(data);

    res.locals.responseGetWeatherData = {
      success: true,
      lat: data.latitude,
      long: data.longitude,
      name: data.resolvedAddress,
      timezone: data.timezone,
      date: `${year}-${month}-${day}`,
      avgTemp: data.days[0].temp,
      minTemp: data.days[0].tempmin,
      maxTemp: data.days[0].tempmax,
      feelTemp: data.days[0].feelslike,
      condition: data.days[0].conditions,
      description: data.days[0].description,
      sunrise: data.days[0].sunrise,
      sunset: data.days[0].sunset,
      icon: data.days[0].icon,
    };
  } catch (err) {
    console.log('Error occurred in Weather API: ', err);
    res.locals.responseGetApodData = {
      success: false,
      msg: err,
    };
  }
  next();
}

router.post('', getWeatherInfo, function (req, res, next) {
  console.log('Router posting from weather!');
  if (res.locals.responseGetWeatherData.success) {
    const rsp = res.locals.responseGetWeatherData;
    return res.status(200).json({
      success: true,
      data: rsp,
    });
  } else {
    return res.status(500).json({
      success: false,
      msg: res.locals.responseGetWeatherData.msg,
    });
  }
});

module.exports = router;
