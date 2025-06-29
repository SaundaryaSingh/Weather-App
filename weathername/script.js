const cityBtn = document.querySelector(".search-city");
const searchBtn = document.querySelector(".searchBtn");
const apiKey = "2882744c5fb076e38c82adc025b729c0";
const searchCitySection = document.querySelector(".search-ur-city");
const notFoundSection = document.querySelector(".not-found");
const WeatherInfoSection = document.querySelector(".weather-info");

const countryTxt = document.querySelector(".country-txt")
const tempTxt = document.querySelector(".temp-txt")
const conditionTxt = document.querySelector(".condition-txt")
const humidityValueTxt = document.querySelector(".humidity-value-txt")
const windValueTxt = document.querySelector(".wind-value-txt")
const weatherSummaryImg = document.querySelector(".weather-summary-img")
const currentDateTxt = document.querySelector(".current-date-text")

const forecastItemsContainer = document.querySelector(".forecast-item-container")

searchBtn.addEventListener('click',()=> {
    if(cityBtn.value.trim())
    {
        UpdateWeatherInfo(cityBtn.value);
        cityBtn.value="";
    }
});

cityBtn.addEventListener('keydown',(event)=> {
    if(event.key == "Enter")
    {
        if(cityBtn.value.trim != "")
            {
            UpdateWeatherInfo(cityBtn.value);
            cityBtn.value="";
         }
    }
});

function getCurrentDate(){
    const currentDate = new Date()
    console.log(currentDate)
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }
    return currentDate.toLocaleDateString('en-GB', options)
}

function getWeatherIcon(id){
    if(id <= 232) return 'thunderstorm.svg'
    if(id <= 321) return 'drizzle.svg'
    if(id <= 531) return 'rain.svg'
    if(id <= 622) return 'snow.svg'
    if(id <= 781) return 'atmosphere.svg'
    if(id <= 800) return 'clear.svg'
    else return 'clouds.svg'
}



async function UpdateWeatherInfo(city){
    const weatherData = await getFetchData("weather",city);
    console.log(weatherData);
    
    if(weatherData.cod != 200){
        showDisplaySection(notFoundSection);
        return
    }

    
    const {
        name: country,
        main: { temp, humidity},
        weather: [{ id, main}],
        wind: {speed}
    } = weatherData

    countryTxt.textContent = country
    tempTxt.textContent = Math.round(temp) + ' °C'
    conditionTxt.textContent = main
    humidityValueTxt.textContent = humidity + '%'
    windValueTxt.textContent = speed + ' M/s'

    currentDateTxt.textContent = getCurrentDate()
    console.log(getCurrentDate())
    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`

    await updateForecastsInfo(city)
    showDisplaySection(WeatherInfoSection)
};

async function updateForecastsInfo(city){
    const forecastsData = await getFetchData('forecast', city)
    console.log(forecastsData);
    const timeTaken = '12:00:00'
    console.log(new Date().toISOString)
    const todayDate = new Date().toISOString().split('T')[0]
    console.log(todayDate)

    forecastItemsContainer.innerHTML = ''
    forecastsData.list.forEach(forecastWeather => {
        if(forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)){
            updateForecastItems(forecastWeather)

        }
    })
}

function updateForecastItems(weatherData){
    console.log(weatherData)
    const {
        dt_txt: date,
        weather: [{ id}],
        main: {temp}
    } = weatherData

    const dateTaken = new Date(date)
    const dateOption = {
        day: '2-digit',
        month: 'short'
    }
    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption)

    const forecastItem = `
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
            <img class="forecast-item-image" src="assets/weather/${getWeatherIcon(id)}">
            <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
        </div>
    `
    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem)

}

async function getFetchData(endpoint,city) {
    const apiURL = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiURL);
    return response.json();
}

function showDisplaySection(section){

    WeatherInfoSection.style.display = "none"
    searchCitySection.style.display = "none" 
    notFoundSection.style.display = "none"

    section.style.display = ''
}
