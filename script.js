const api = {
    endpoint: 'https://api.openweathermap.org/data/2.5/',
    key: 'd8194d45f88df16bcfc394647d281c19'
}

const images = {
    sunny: './img/sunnyWeather.jpg',
    atmosphereWeather: './img/atmosphereWeather.jpg',
    cloudyWeather: './img/cloudyWeather-2.jpg',
    rainWeather: './img/rainWeather.jpg',
    snowWeather: './img/snowWeather.jpg',
    thunderWeather: './img/thunderWeather.jpg'
}



const input = document.querySelector('input')


input.addEventListener('keydown', enter)

function enter(e) {
    if (e.key === 'Enter') {
        getInfo(input.value)
    }
}

// Функция для смены фонового изображения
function changeBackground(weatherCondition) {
    const body = document.body;

    // Приводим условие погоды к нижнему регистру для удобства сравнения
    const condition = weatherCondition.toLowerCase();

    // Определяем какое изображение использовать
    if (condition.includes('clear') || condition.includes('sunny')) {
        body.style.backgroundImage = `url(${images.sunny})`;
    }
    else if (condition.includes('rain') || condition.includes('drizzle')) {
        body.style.backgroundImage = `url(${images.rainWeather})`;
    }
    else if (condition.includes('snow')) {
        body.style.backgroundImage = `url(${images.snowWeather})`;
    }
    else if (condition.includes('thunder') || condition.includes('storm')) {
        body.style.backgroundImage = `url(${images.thunderWeather})`;
    }
    else if (condition.includes('cloud')) {
        body.style.backgroundImage = `url(${images.cloudyWeather})`;
    }
    else if (condition.includes('mist') || condition.includes('fog') || condition.includes('haze')) {
        body.style.backgroundImage = `url(${images.atmosphereWeather})`;
    }
    else {
        // Изображение по умолчанию (например, облачная погода)
        body.style.backgroundImage = `url(${images.sunny})`;
    }


}

async function getInfo(data) {
     try {
    const res = await fetch(`${api.endpoint}weather?q=${data}&units=metric&appID=${api.key}`)
    const result = await res.json()
    // Проверяем, найден ли город
        if (result.cod === "404" || result.cod === 400) {
            // Город не найден  
            document.querySelector('#city').textContent = '❌ City not found!'
            document.querySelector('#temperature').textContent = '--°'
            document.querySelector('#temperIsLike').textContent = 'Is like --°'
            document.querySelector('#conditions').textContent = 'Not found'
            document.querySelector('#varation').textContent = 'Min: --°, Max: --°'
            
            //  выделяем его
            input.style.border = '2px solid red'
            setTimeout(() => {
                input.style.border = 'none'
            }, 2000)
            
            return // Останавливаем выполнение функции
        }
    document.querySelector('#city').textContent = result.name + ', ' + result.sys.country
    document.querySelector('#temperature').textContent = Math.round(result.main.temp) + '°'
    document.querySelector('#temperIsLike').textContent = 'Is like ' + Math.round(result.main.feels_like) + '°'
    document.querySelector('#conditions').textContent = result.weather[0].main
    document.querySelector('#varation').textContent = 'Min: ' + Math.round(result.main.temp_max) + '°, Max: ' + Math.round(result.main.temp_min) + '°'



    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Меняем фон в зависимости от погоды
    changeBackground(result.weather[0].main);


    const myDate = new Date();
    let day = days[myDate.getDay()];
    let todayDate = myDate.getDate();
    let month = months[myDate.getMonth()];
    let year = myDate.getFullYear();

    document.querySelector('#date').textContent = `${day}, ${todayDate} ${month} ${year}`

    console.log(result)
    } catch(error) {
        console.error('Error when receiving data:', error);
    }
}
