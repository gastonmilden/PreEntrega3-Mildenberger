

let alarms = {};

getElement = (id) => document.getElementById(id);
createElement = (tag) => document.createElement(tag);

class Clock {
    locale = "es-ES";
    
    init() {
        setInterval(this.build, 1000);
    }

    build = () => {
        const clockElement = getElement("digital-clock");
        const time = this.toLocaleTimeString(new Date());
        clockElement.innerHTML = time;
        this.checkAlarms(time);
    }

    clearForm = () => {
        getElement("alarm-name").value = "";
        getElement("hour").value = "";
        getElement("minute").value = "";
        getElement("hour").focus();
    }

    addAlarm = () => {
        const hour = parseInt(getElement("hour").value);
        const minute = parseInt(getElement("minute").value);
        const alarmName = getElement("alarm-name").value;
    
        if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
            alert("Ingrese una hora y minutos válidos (0-23 horas y 0-59 minutos).");
            return;
        }
    
        const date = new Date();
        date.setHours(hour);
        date.setMinutes(minute);
        date.setSeconds(0);
    
        alarms[alarmName] = date;
        localStorage.setItem("alarms", JSON.stringify(alarms));
    
        this.clearForm();
        this.displayAlarms();
    }

    deleteAlarm = (alarmName) => {
        if (alarms.hasOwnProperty(alarmName)) {
            delete alarms[alarmName];
            localStorage.setItem("alarms", JSON.stringify(alarms));
            this.displayAlarms();
        }
    }

    renderAlarm = (alarmName, alarmTime, alarmList) => {
        const li = createElement("li");
        li.innerHTML = `Alarma: ${alarmName}, Hora: ${this.toLocaleTimeString(alarmTime)}`;
        
        // Agregar botón de editar
        const editButton = createElement("button");
        editButton.textContent = "Editar";
        editButton.addEventListener("click", () => {
            getElement("hour").value = alarmTime.getHours();
            getElement("minute").value = alarmTime.getMinutes();
            getElement("alarm-name").value = alarmName;
            this.editAlarm(alarmName);
        });

        const deleteButton = createElement("button");
        deleteButton.textContent = "Eliminar";
        deleteButton.addEventListener("click", () => {
            this.deleteAlarm(alarmName);
        });

        li.appendChild(editButton);
        li.appendChild(deleteButton);

        alarmList.appendChild(li);
    }

    displayAlarms = () => {
        const alarmList = getElement("alarm-list");
        alarmList.innerHTML = "";
    
        for (const alarmName in alarms) {
            const alarmTime = alarms[alarmName];
            this.renderAlarm(alarmName, alarmTime, alarmList);
        }
    }

    editAlarm = (alarmName) => {
        const newHour = parseInt(getElement("hour").value);
        const newMinute = parseInt(getElement("minute").value);
        const newAlarmName = getElement("alarm-name").value;
    
        if (isNaN(newHour) || isNaN(newMinute) || newHour < 0 || newHour > 23 || newMinute < 0 || newMinute > 59) {
            alert("Ingrese una hora y minutos válidos (0-23 horas y 0-59 minutos).");
            return;
        }
    
        const date = new Date();
        date.setHours(newHour);
        date.setMinutes(newMinute);
        date.setSeconds(0);
    
        alarms[newAlarmName] = date;
        delete alarms[alarmName];
        localStorage.setItem("alarms", JSON.stringify(alarms));
    
        this.clearForm();
        this.displayAlarms();
    }

    checkAlarms = (time) => {
        for (const alarmName in alarms) {
            const alarmTime = alarms[alarmName];
            if (this.toLocaleTimeString(alarmTime) === time) {
                Swal.fire({
                    icon: 'success',
                    title: 'Wake Up!',
                    text: `Es hora de ${alarmName}.`,
                });
            }
        }
    }

    toLocaleTimeString = (date) => {
        return date.toLocaleTimeString(this.locale, {hours: "2-digit", minutes: "2-digit"})
    }
}

const clock = new Clock;
clock.init();


const apiKey = '87cb074b6cccb8f74777bf23a024f7aa';

class WeatherApp {
    constructor() {
        this.weatherData = null;
        this.init();
    }

    init() {
        this.fetchWeatherData();
    }

    fetchWeatherData() {
        const city = 'Buenos Aires,ar';
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=es`;

        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                this.weatherData = data;
                this.displayWeatherData();
            })
            .catch((error) => {
                console.error('Error al recuperar datos del clima:', error);
            });
    }

    displayWeatherData() {
        const temperature = this.weatherData.main.temp.toFixed(1);
        const description = this.weatherData.weather[0].description;
    
        const weatherInfoElement = document.getElementById('weather-info');
        weatherInfoElement.innerHTML = `En Buenos Aires, Argentina, la temperatura es de ${temperature}°C y hay ${description}.`;
    }
}

const weatherApp = new WeatherApp;
weatherApp.init();
