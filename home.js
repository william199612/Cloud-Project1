import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.5/+esm';

// const axios = require('axios');
const submitBtn = document.getElementById('submitBtn');

submitBtn.addEventListener('click', async () => {
  const date = document.getElementById('date').value;
  const dateArr = date.toString().split('-');
  const year = dateArr[0];
  const month = dateArr[1];
  const day = dateArr[2];
  // console.log(date);
  // console.log(year, month, day);

  let today = new Date('year-month-date');

  console.log('Click search button...');
  if (date > today) {
    alert('Try again. Please enter a day before today!');
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
    refreshDayPage(res.data);
  } else {
    alert(
      'This date is toooooo long time ago! Please try again with another date.'
    );
  }
});

const refreshDayPage = function (data) {
  let s = '';
  console.log(data, data.data);
  if (data.success && data.data.success) {
    s += '<h1>History on This Day</h1>';
    // console.log(data.data.data);
    s += `<img src='${data.data.data.todayImg}' alt='${data.data.todayImgText}' width='200' height='150'>`;
    // console.log(data.data, data.data.length);
    for (let d of data.data.data.dayDetail) {
      let t = '';
      t += `<h3 class='day-title'>${d.title}</h3>`;
      t += `<p class='day-year'>${d.year}</p>`;
      t += `<p><a href='${d.url}'>[View Article]</a></p>`;
      t += '</br>';

      s += t;
    }
  }
  document.getElementById('onThisDay').innerHTML = s;
  console.log('Done refreshing onThisDay Page!');
};
