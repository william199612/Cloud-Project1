import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.5/+esm';

// const axios = require('axios');
const submitBtn = document.getElementById('submitBtn');

submitBtn.addEventListener('click', async () => {
  const date = document.getElementById('date').value;
  const dateArr = date.split('-');
  const year = dateArr[0];
  const month = dateArr[1];
  const day = dateArr[2];

  let today = new Date();
  today = `${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDate()}`;

  console.log('Click search button...');
  if (month !== '' && day !== '') {
    const res = axios.post(
      `${window.location.href}onThisDay`,
      {
        year: year,
        month: month,
        day: day,
      }
    );
    refreshDayPage(res.data);
  } else if (date > today) {
    alert('Try again. Please enter a day before today!');
  }
});

const refreshDayPage = function (data) {
  let s = '';
  if (data.success) {
    s += '<h1>History on This Day</h1>';
    console.log(data.data, data.data.length);
    for (let d of data.data) {
      let t = '';
      t += `<img src='${d.img}' alt='${d.title}' width='200' height='150'>`;
      t += `<h3 class='day-title'>${d.title}</h3>`;
      t += `<p class='day-year'>${d.year}</p>`;
      t += `<p><a href='${d.url}'>[View Article]</a></p>`;
      t += '</br>';

      s += t;
    }
  }
};
