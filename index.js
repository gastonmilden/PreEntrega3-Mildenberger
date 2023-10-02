const alarms = [];

getElement = (id) => document.getElementById(id);
createElement = (tag) => document.createElement(tag);

class Clock {
    locale = "es-ES";
    
    init() {
        setInterval(this.build, 1000);
    }

    build = () => {
        const clockElement = getElement("digital-clock");
        const time = this.toLocaleTimeString(new Date);
        clockElement.innerHTML = time;
        this.checkAlarms(time);
    }

    clearForm = () => {
        getElement("hour").value = "";
        getElement("minute").value = "";
        getElement("hour").focus();
    }

    addAlarm = () => {
        const hour = parseInt(getElement("hour").value);
        const minute = parseInt(getElement("minute").value);
    
        if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
            alert("Ingrese una hora y minutos válidos (0-23 horas y 0-59 minutos).");
            return;
        }
    
        const date = new Date();
        date.setHours(hour);
        date.setMinutes(minute);
        date.setSeconds(0);
    
        alarms.push(date);
        localStorage.setItem("alarms", JSON.stringify(alarms));
    
        this.clearForm();
        this.displayAlarms();
    }

    renderAlarm = (alarm, alarmList) => {
        const li = createElement("li");
        li.innerHTML = `Alarma lista: ${this.toLocaleTimeString(alarm)}`;
        alarmList.appendChild(li);
    }

    displayAlarms = () => {
        alarms.sort((d1, d2) => d1 - d2);
        const alarmList = getElement("alarm-list");
        alarmList.innerHTML = "";

        alarms.forEach((alarmTime) => {
            this.renderAlarm(alarmTime, alarmList);
        });
    }

    checkAlarms = (time) => {
        for (let index = 0; index < alarms.length; index++) {
            const alarm = this.toLocaleTimeString(alarms[index]);
            if (alarm === time){
                alarms.splice(index, 1);
                this.displayAlarms();
                alert(`Wake Up! Son las ${alarm}!`);
            }
            
        }
    }

    toLocaleTimeString = (date) => {
        return date.toLocaleTimeString(this.locale, {hours: "2-digit", minutes: "2-digit"})
    }
}

const clock = new Clock;
clock.init();