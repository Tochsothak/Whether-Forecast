const currentDate = document.getElementById("date");
// days of weeks
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  //   const hour = time.getHours();
  //   const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
  //   const minutes = time.getMinutes();
  //   const ampm = hour >= 12 ? "PM" : "AM";
  //get current time
  //   currentTime.innerHTML = hoursIn12HrFormat + ":" + minutes + " " + ampm;
  // get current date
  currentDate.innerHTML = days[day] + ", " + date + "  " + months[month];
}, 1000);

const searchBar = document.querySelector(".search-bar");
const cityInput = document.getElementById("cityInput");
const weatherInfo = document.querySelector(".weather-info");
const APIKey = "cdf45f214735de22b11b26f1b91574fe";

searchBar.addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = cityInput.value;
  if (city) {
    try {
      const weatherData = await getWeatherData(city);
      const hourlyData = await getHourlyForecast(city);
      const fiveDayData = await getFivedayForecast(city);
      displayWeatherInfo(weatherData);
      displayhourly(hourlyData);
      displayFiveDayForecast(fiveDayData);
    } catch (Error) {
      console.error(error);
      displayError(message);
    }
  } else {
    displayError("Please enter city");
  }
});
async function getWeatherData(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`;
  const response = await fetch(apiUrl);
  console.log(response);
  if (!response.ok) {
    throw new error("could not fetch weather data");
  }
  return await response.json();

  //Houlry
}
async function getHourlyForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${APIKey}`;

  await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // Process and display the data
      displayHourlyForecast(data.list);
      // console.log(data);
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
    });
}

function displayHourlyForecast(hourlyData) {
  const forecastElement = document.getElementById("hourly-forecast");
  forecastElement.innerHTML = "";
  const next24Hours = hourlyData.slice(0, 8); // Display the next 24 hours (3-hour intervals)

  next24Hours.slice(0, 6).forEach((item) => {
    const forecast = item.weather[0].main;
    const realFeel = Math.round(item.main.feels_like);
    const windSpeed = item.wind.speed;
    const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
    const hour = dateTime.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
    const minutes = dateTime.getMinutes();
    const ampm = hour >= 12 ? "PM" : "AM";
    const hourConverted = hoursIn12HrFormat + ":" + minutes + " " + ampm;
    const temperature = Math.round(item.main.temp); // Convert to Celsius

    const iconCode = item.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

    const hourlyItemHtml = `
    <div class="hourly-item">
                <span class="hourly-hour">${hourConverted}</span>
                <h3 id="forecast">${forecast}</h3>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <div class="hourly-info">
                <p>Temp :</p>
                <span class="temp-hourly">${temperature}°C</span>
                </div>
                <div class="hourly-info">
                <p>Real feel : </p>
                <span id="hourly-realfeel">${realFeel}°C</span>
                </div>
                <div class="hourly-info">
                <p>Winds : </p>
                <span id="hourly-wind">${windSpeed}</span>
                </div>
                
            </div>
           
        `;

    forecastElement.innerHTML += hourlyItemHtml;
  });
}

function displayWeatherInfo(data) {
  // console.log(data);
  const {
    name: city,
    main: { temp, feels_like },
    sys: { sunrise, sunset },
    weather: [{ main, id }],
  } = data;
  // display weather information on current weather

  const temps = document.getElementById("temp");
  const realFeel = document.getElementById("real-feel");
  const descriptions = document.getElementById("description");
  const sunRise = document.getElementById("sunrise");
  const sunSet = document.getElementById("sunset");
  const durations = document.getElementById("duration");
  const weatherIcon = document.getElementById("weather-icon");
  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  temps.innerHTML = temp.toFixed(0) + " &deg;C";
  realFeel.innerHTML = "Real feel " + feels_like.toFixed(0) + "&deg;";
  descriptions.innerHTML = main;

  sunRise.innerHTML = numberToTimeFomnat(sunrise);
  sunSet.innerHTML = numberToTimeFomnat(sunset);
  durations.innerHTML = numberToTimeFomnat(sunrise + sunset);
  weatherIcon.src = iconUrl;
}

// convert surise and sunset to time format
function numberToTimeFomnat(minutes) {
  let totalhours = Math.floor(minutes / 60);
  let remainingminutes = minutes % 60;
  let period = totalhours >= 12 ? "PM" : "AM";
  let hoursIn12HrFormat = totalhours % 12;
  hoursIn12HrFormat = hoursIn12HrFormat ? hoursIn12HrFormat : 12;
  let formattedMinutes = remainingminutes.toString().padStart(2, "0");

  return hoursIn12HrFormat + " : " + formattedMinutes + " " + period;
}

function displayError(message) {
  const errorDisplay = document.createElement("p");
  errorDisplay.textContent = message;
  errorDisplay.classList.add("errorDisplay");

  weatherInfo.textContent = "";
  weatherInfo.style.display = "flex";
  weatherInfo.appendChild(errorDisplay);
}

//get five day forecast data info
async function getFivedayForecast(city) {
  const FiveDayUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}&units=metric`;

  fetch(FiveDayUrl)
    .then((response) => response.json())
    .then((data) => displayFiveDayForecast(data))
    .catch((error) => console.error("Error fetching weather data:", error));
}

function displayFiveDayForecast(data) {
  console.log(data);

  const fiveDayElement = document.getElementById("fiveDay");
  fiveDayElement.innerHTML = ""; // Clear previous forecast

  data.list.slice(0, 5).forEach((day) => {
    const date = new Date(day.dt * 1000).toLocaleDateString();
    const temp = Math.round(day.main.temp);
    const description = day.weather[0].main;
    const iconCode = day.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
    const fiveDayItemHtml = `
    <div id="fiveDay-Item">
      <p id="five-date"><strong>${date}</strong></p>
      <img src="${iconUrl}" alt="Five days Weather Icon">
      <h3 id="description">${description}</h3>
      <div class="fivetemp-info">
      <span>Temp : </span>
      <p id="five-temp">${temp}°C</p>
      </div>
      
    </div>
  `;
    fiveDayElement.innerHTML += fiveDayItemHtml;
  });
}

//get to day info

// get fiveday info
