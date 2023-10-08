import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.5/+esm';

// store the data as a global variable(month and date)
const inputMD = [0];

window.onload = async function () {
  console.log('Winodw onload!');
  const res = await axios.post(
    `${window.location.href}counter/getCounter`
  );
  const count = res.data.data.count + 1;
  refreshCounter(count);
  await axios.post(
    `${window.location.href}counter/updateCounter`,
    {
      count: count,
    }
  );
};

const refreshCounter = function (count) {
  const countDiv = document.getElementById('counter');
  countDiv.innerText = `Number of Visitor: ${count}`;
};

// the html code for city dropbox
const cityDropBoxHTML =
  '<option value="New York">New York</option>' +
  '<option value="London">London</option>' +
  '<option value="Tokyo">Tokyo</option>' +
  '<option value="Paris">Paris</option>' +
  '<option value="Beijing">Beijing</option>' +
  '<option value="Sydney">Sydney</option>' +
  '<option value="Mumbai">Mumbai</option>' +
  '<option value="Mexico City">Mexico City</option>' +
  '<option value="Istanbul">Istanbul</option>' +
  '<option value="Taipei">Taipei</option>' +
  '<option value="Cairo">Cairo</option>' +
  '<option value="Moscow">Moscow</option>' +
  '<option value="Seoul">Seoul</option>' +
  '<option value="Toronto">Toronto</option>' +
  '<option value="Brisbane">Brisbane</option>' +
  '<option value="Cape Town">Cape Town</option>' +
  '<option value="Dubai">Dubai</option>' +
  '<option value="Rome">Rome</option>' +
  '<option value="Bangkok">Bangkok</option>' +
  '<option value="Vancouver">Vancouver</option>' +
  '</select>';

const submitBtn = document.getElementById('submitBtn');
submitBtn.addEventListener('click', async () => {
  console.log('Click search button...');
  const date = document.getElementById('date').value;
  const dateArr = date.toString().split('-');
  const year = dateArr[0];
  const month = dateArr[1];
  const day = dateArr[2];

  inputMD.push({
    month: month,
    day: day,
  });
  // console.log(date);
  // console.log(year, month, day);

  const inputDate = new Date(date);
  const todayDate = new Date();
  // console.log(inputDate.toString());
  // console.log(todayDate.toString());
  if (inputDate > todayDate) {
    console.log('Input Error: input date after today!');
    alert('Please choose a date before today!');
  } else if (date !== '') {
    const res = await axios.post(
      `${window.location.href}onThisDay`,
      {
        year: year,
        month: month,
        day: day,
      }
    );
    // console.log(res.data);
    refreshDaySection(res.data);
    // refreshApodSection(response.data);

    // Add view astronomy event listener
    Array.from(
      document.getElementsByClassName('apodBtn')
    ).forEach((element) => {
      element.addEventListener('click', () => {
        // console.log(element);
        const year = element.id;
        onClickShowApod(year);
      });
    });

    // Add view weather button event listener
    Array.from(
      document.getElementsByClassName('cityBtn')
    ).forEach((element) => {
      element.addEventListener('click', () => {
        const city = document.getElementById(
          `city-${element.id}`
        ).value;
        const year = element.id.split('-')[0];
        // console.log(element);
        // console.log(city);
        onClickShowWeather(city, year);
      });
    });
  } else {
    alert(response.data.data.msg);
  }
});

const refreshDaySection = function (data) {
  console.log('Refreshing onThisDay section!');
  let s = '';
  // console.log(data, data.data);
  if (data.success && data.data.success) {
    s += '<h1>History on This Day</h1>';
    // console.log(data.data.data);
    s += `<img src='${data.data.data.todayImg}' alt='${data.data.todayImgText}' width='100%' height='auto' style='margin-bottom: 20px'>`;
    // console.log(data.data, data.data.length);
    for (let d of data.data.data.dayDetail) {
      let t = '';
      t += `<p class='day-year' style='font-size: 18px'>${d.year}/${inputMD[1].month}/${inputMD[1].day}</p>`;
      t += `<p class='day-title' style='font-size: 14px; font-weight: bold'>${d.title}<a href='${d.url}}' style="margin-left: 10px">>> link</a></p>`;

      // show a list of cities to select
      t += `<label for="city-${d.year}-${d.id}" style="margin-right: 5px">Choose a City:</label>`;
      t += `<select name="cityDropbox" id="city-${d.year}-${d.id}">`;
      t += cityDropBoxHTML;
      t += `<button class="cityBtn" id="${d.year}-${d.id}" type='submit' style='margin-left: 10px; margin-bottom: 20px'>View Weather</button>`;
      t += '<br />';
      t += `<button class='apodBtn' id='${d.year}' style='margin-bottom: 20px'>View Astronomy on ${d.year}/${inputMD[1].month}/${inputMD[1].day}</button>`;
      t += '';
      s += t;
    }
  } else {
    s += `<p class='errMsg'>${data.data.msg}</p>`;
  }
  document.getElementById('onThisDay').innerHTML = s;
  console.log('Done refreshing onThisDay Page!');
};

const refreshApodSection = function (data) {
  console.log('Refreshing Apod section!');
  let s = '';
  // console.log(data.data);
  if (data.success && data.data.success) {
    s += `<img src='${data.data.apodImg}' alt='${data.data.imgAlt}' style=" width: 100%; height: 100%">`;
  } else {
    s += `<p class='errMsg'>${data.data.msg}</p>`;
  }
  document.getElementById('apod').innerHTML = s;
  console.log('Done refreshing Apod Page!');
};

const refreshWeatherSection = function (data) {
  console.log('Refreshing Weather section!');
  let s = '';
  if (data.success) {
    // s += '<div background-image: url("img/weather.jpg")>';
    s += '<h1>Weather on This Day</h1>';
    s += `<p class="weather-city" style='font-size: 18px'>City: ${data.data.name} (${data.data.lat}, ${data.data.long})</p>`;
    s += `<p class="weather-date" style='font-size: 18px'>Date: ${data.data.date}</p>`;
    s += `<p class="weather-timezone" style='font-size: 18px'>Timezone: ${data.data.timezone}</p>`;
    s += '<br />';
    s += '<h2>Temperature</h2>';
    // s += `<img src='${data.data.todayImg}' alt='${data.data.todayImgText}' width='100%' height='auto' style='margin-bottom: 20px'>`;
    s += `<p class='weather-description' style='font-size: 14px'>${data.data.description}</p>`;
    s += `<p class='weather-temp' style='font-size: 14px'>Average Temperature: ${data.data.avgTemp}</p>`;
    s += `<p class='weather-mintemp' style='font-size: 14px'>Min Temperature: ${data.data.minTemp}</p>`;
    s += `<p class='weather-maxtemp' style='font-size: 14px'>Max Temperature: ${data.data.maxTemp}</p>`;
    s += '<br />';
    s += '<h2>Sun</h2>';
    s += `<p class='weather-sunrise' style='font-size: 14px'>Sunrise Time: ${data.data.sunrise}</p>`;
    s += `<p class='weather-sunset' style='font-size: 14px'>Sunset Time: ${data.data.sunset}</p>`;
    s += '<br />';
    // TODO: add a image from that date in Brisbane
    s += '<br />';
    // s += '</div>';
  } else {
    s += `<p class='errMsg'>${data.data.msg}</p>`;
  }
  document.getElementById('apod').innerHTML = s;
  console.log('Done refreshing Weather Page!');
};

async function onClickShowApod(year) {
  console.log('Click view apod button...');
  const limitDate = new Date('1995-06-16');
  const inputDate = new Date(
    `${year}-${inputMD[1].month}-${inputMD[1].day}`
  );
  if (inputDate >= limitDate) {
    await axios
      .post(`${window.location.href}apod`, {
        year: year,
        month: inputMD[1].month,
        day: inputMD[1].day,
      })
      .then((res) => {
        // console.log(res.data);
        refreshApodSection(res.data);
      });
  } else {
    let s =
      '<h2 style="text-align: center; margin-bottom: 1rem; padding-top: 20rem">This date is tooooo long time ago...</h2>';
    s +=
      '<p style="text-align: center">Please choose another date to show.</p>';
    s +=
      '<p style="text-align: center">(Select a date after 16 Jun 1995)</p>';
    document.getElementById('apod').innerHTML = s;
  }
}

async function onClickShowWeather(city, year) {
  console.log('Click view weather button...');
  const limitDate = new Date('1970-01-01');
  const inputDate = new Date(
    `${year}-${inputMD[1].month}-${inputMD[1].day}`
  );
  if (inputDate >= limitDate) {
    await axios
      .post(`${window.location.href}weather`, {
        city: city,
        year: year,
        month: inputMD[1].month,
        day: inputMD[1].day,
      })
      .then((res) => {
        // console.log(res.data);
        refreshWeatherSection(res.data);
      });
  } else {
    let s =
      '<h2 style="text-align: center; margin-bottom: 1rem; padding-top: 20rem">This date is tooooo long time ago...</h2>';
    s +=
      '<p style="text-align: center">Please choose another date to show.</p>';
    s +=
      '<p style="text-align: center">(Select a date after 1 Jan 1970)</p>';
    document.getElementById('apod').innerHTML = s;
  }
}
