import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.5/+esm';

const submitBtn = document.getElementById('submitBtn');
// store the data as a global variable(month and date)
const inputMD = [0];

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
  let today = new Date('year-month-date');

  if (date !== '') {
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
    const response = await axios.post(
      `${window.location.href}apod`,
      {
        year: year,
        month: month,
        day: day,
      }
    );
    refreshApodSection(response.data);
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
    s += `<img src='${data.data.data.todayImg}' alt='${data.data.todayImgText}' width='100%' height='auto'>`;
    // console.log(data.data, data.data.length);
    for (let d of data.data.data.dayDetail) {
      let t = '';
      t += `<p class='day-year' style='font-size: 18px'>${d.year}</p>`;
      t += `<p class='day-title' style='font-size: 14px; font-weight: bold'>${d.title}</p>`;
      t += `<a href='${d.url}}'><button>View Article</button></a>`;
      t += `<button onClick='${onClickShowApod(
        d.year
      )}' style='margin-bottom: 20px'>View the Apod</button>`;
      t += '</br>';

      s += t;
    }
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
    document.getElementById('apod').innerHTML = s;
  } else {
    s += `<p class='errMsg'>${data.data.msg}</p>`;
  }
  console.log('Done refreshing onThisDay Page!');
};

async function onClickShowApod(year) {
  console.log('Click view apod button...');
  const res = await axios
    .post(`${window.location.href}apod`, {
      year: year,
      month: inputMD[0],
      day: inputMD[1],
    })
    .then((res) => {
      refreshApodSection(res.data);
    });
}
