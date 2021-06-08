'use strict';

const dayTimeLogo = document.querySelectorAll('.day-time__logo'),
  modalShowBtn = document.querySelector('#modal-show-btn'),
  modalMedicine = document.querySelector('#medicine-modal'),
  modalMedicineCloseBtn = document.querySelector('#medicine-modal-close'),
  medicineAddBtn = document.querySelector('#medicine-add-btn'),
  medicineTypes = document.querySelectorAll('.select-medicine__type'),
  medicineMethods = document.querySelectorAll('.select-medicine__method-time'),
  dayTimeMorning = document.querySelector('#day-time-morning'),
  dayTimeAfternoon = document.querySelector('#day-time-afternoon'),
  dayTimeEvening = document.querySelector('#day-time-evening'),
  dayTimeNight = document.querySelector('#day-time-night');

let weekDays;

const medicineAllDataArr = [];

function MedicineSingleData(medName, day, time, value, dosage, type, method) {
  this.medName = medName;
  this.day = day;
  this.time = time;
  this.value = value;
  this.dosage = dosage;
  this.type = type;
  this.method = method;
}

//Show schedule on click
dayTimeLogo.forEach(logo => {
  logo.addEventListener('click', (e) => {
    e.currentTarget.closest('.day-time').querySelector('.day-time__schedule').classList.toggle('schedule-show');
  });
});

//Show and hide modal on clicks
modalShowBtn.addEventListener('click', () => modalMedicine.classList.add('modal-show'));
modalMedicineCloseBtn.addEventListener('click', () => modalMedicine.classList.remove('modal-show'));

//Add medicine active property in modal
const addActiveMedicineProperty = (props, className) => {
  props.forEach(prop => {
    prop.addEventListener('click', (e) => {
      props.forEach(type => type.classList.remove(className));
      e.currentTarget.classList.add(className);
    });
  });
};

addActiveMedicineProperty(medicineTypes, 'active-medicine-type');
addActiveMedicineProperty(medicineMethods, 'active-medicine-method');


//Add medicine in current daytime on click in modal
medicineAddBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const medicineNameInput = document.querySelector('#select-medicine-name').value,
    dosageValueInput = document.querySelector('#dosage-value-input').value,
    dosageQuantityInput = document.querySelector('#dosage-quantity-input').value,
    timeInput = document.querySelector('#time-input').value,
    date = new Date(timeInput),
    formatedFullDate = date.toLocaleString(),
    currentHour = date.getHours(),
    currentMinutes = date.getMinutes(),
    dateShow = `${currentHour}:${currentMinutes}`;

  const activePropName = (props, className, dataName) => {
    let activeType;
    props.forEach(type => {
      if (type.classList.contains(className)) {
        activeType = type;
      }
    });

    if (activeType !== undefined) {
      return activeType.dataset[dataName];
    }
  };

  const typeName = activePropName(medicineTypes, 'active-medicine-type', 'medtype');
  const typeMethod = activePropName(medicineMethods, 'active-medicine-method', 'method');

  const medicineSingleBlock = createMedicine(typeName, formatedFullDate, dateShow, medicineNameInput, dosageValueInput, dosageQuantityInput, typeMethod);

  const addMedicineInDaytime = (daytime) => {
    const schedule = daytime.querySelector('.day-time__schedule');
    schedule.append(medicineSingleBlock);
    schedule.classList.add('schedule-show');
  };

  if (medicineNameInput !== '' &&
    dosageValueInput !== '' &&
    dosageQuantityInput !== '' &&
    timeInput !== '' &&
    typeName !== undefined &&
    typeMethod !== undefined
  ) {
    if (date.getMonth() === new Date().getMonth() &&
      date.getDay() === new Date().getDay()) {
      if (5 <= currentHour && currentHour < 12) {
        addMedicineInDaytime(dayTimeMorning);
      } else if (12 <= currentHour && currentHour < 17) {
        addMedicineInDaytime(dayTimeAfternoon);
      } else if (17 <= currentHour && currentHour < 20) {
        addMedicineInDaytime(dayTimeEvening);
      } else {
        addMedicineInDaytime(dayTimeNight);
      }
    }

    medicineLeftTime();

    const newMedicine = new MedicineSingleData(medicineNameInput, formatedFullDate, timeInput, dosageValueInput, dosageQuantityInput, typeName, typeMethod);

    medicineAllDataArr.push(newMedicine);
  }
});

//Create medicine html-block
const createMedicine = (typeImgSrc, date, dateShow, name, value, quantity, eating) => {
  const newMedicine = document.createElement('div');
  newMedicine.className = 'pill';
  newMedicine.innerHTML = `
  <div class="pill__image">
    <img src="img/${typeImgSrc}.svg" alt="capsule-img" class="pill__image-img">
  </div>
  <div class="pill__time">
    <p class="pill__time-title">Время</p>
    <p data-time="${date}" class="pill__time-amount">${dateShow}</p>
  </div>
  <div class="pill__descr">
    <p class="pill__name">${name}</p>
    <p class="pill__amount">${value}, ${quantity} шт.</p>
    <p class="pill__eating">${eating}</p>
  </div>
  <div class="pill__left">
    <p class="pill__left-title">Осталось</p>
    <p class="pill__left-quant"></p>
  </div>
  <div class="pill__complete">
    <div class="pill__check">
      <img id="mecicine-complete" src="img/checked.svg" alt="pill-complete-icon" class="pill__check-icon">
    </div>
    <div id="mecicine-cancel" class="pill__check">
      <img src="img/error.svg" alt="pill-cancel-icon" class="pill__check-icon">
    </div>
  </div>  
  `;

  return newMedicine;
};

//Create timer for left time medicine, add listener for check medicine btns
const medicineLeftTime = () => {
  const medicines = document.querySelectorAll('.pill');

  medicines.forEach(medicine => {
    const medicineTime = new Date(medicine.querySelector('.pill__time-amount').dataset.time);
    const leftTime = medicine.querySelector('.pill__left-quant');
    const medCompleteBtn = medicine.querySelector('#mecicine-complete');
    const medCancelBtn = medicine.querySelector('#mecicine-cancel');

    const calculateTime = () => {
      const now = new Date();
      const currentTime = medicineTime.getTime() - now.getTime();

      if (now.getTime() < medicineTime.getTime() && !leftTime.classList.contains('disabled-timer')) {
        const hours = Math.floor((currentTime / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((currentTime / (1000 * 60)) % 60);
        const seconds = Math.floor((currentTime / 1000) % 60)

        leftTime.textContent = `${hours} : ${minutes} : ${seconds}`;

        if (hours === 0 && minutes === 0 && seconds === 0) {
          clearInterval(timer);
        }
      } else {
        leftTime.textContent = '0 : 0 : 0';
      }
    };

    const timer = setInterval(() => calculateTime(), 1000);

    medCompleteBtn.addEventListener('click', () => {
      clearInterval(timer);
      leftTime.textContent = '0 : 0 : 0';
      leftTime.classList.add('disabled-timer');
      medicine.classList.add('hide-medicine');
    });

    medCancelBtn.addEventListener('click', () => {
      medicine.classList.add('hide-medicine');
      setTimeout(() => medicine.remove(), 300);
    });
  });
};

//Create week day 
const createWeekDay = (dayNumber, dayName, weekDate) => {
  const weekDay = document.createElement('div');
  weekDay.className = 'week-day';
  weekDay.setAttribute('data-weekdate', `${weekDate}`);
  weekDay.innerHTML = `
    <div class="week-day__number">${dayNumber}</div>
    <div class="week-day__name">${dayName}</div>
  `;

  return weekDay;
};

const createDates = (days) => {
  const medicineWeek = document.querySelector('#medicine-week');
  const dayNames = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];

  const result = new Date();
  result.setDate(result.getDate() + days);

  const dayName = dayNames[result.getDay()];
  const dayNumber = result.getDate();

  medicineWeek.append(createWeekDay(dayNumber, dayName, result.toLocaleString()));
};

const daysQuant = 7;

for (let i = 0; i <= daysQuant; i++) {
  createDates(i);
  weekDays = document.querySelectorAll('.week-day');
}


weekDays.forEach(day => {
  day.addEventListener('click', (e) => {
    const schedules = document.querySelectorAll('.day-time__schedule');
    schedules.forEach(schedule => {
      schedule.innerHTML = '';
    });

    const currentWeekDay = e.currentTarget.dataset.weekdate.slice(0, 10);

    const filteredMedicineByDates = medicineAllDataArr.filter(data => {
      return currentWeekDay == data.day.slice(0, 10);
    });


    filteredMedicineByDates.forEach(medicine => {
      const type = medicine.type,
        date = medicine.day,
        medName = medicine.medName,
        value = medicine.value,
        dosage = medicine.dosage,
        method = medicine.method;

      const medicineSingleBlock = createMedicine(type, date, date, medName, value, dosage, method);

      const addMedicineInDaytime = (daytime) => {
        const schedule = daytime.querySelector('.day-time__schedule');
        schedule.append(medicineSingleBlock);
        schedule.classList.add('schedule-show');
      };

      const currentHour = new Date(medicineSingleBlock.querySelector('.pill__time-amount').dataset.time).getHours();
  

      if (5 <= currentHour && currentHour < 12) {
        addMedicineInDaytime(dayTimeMorning);
      } else if (12 <= currentHour && currentHour < 17) {
        addMedicineInDaytime(dayTimeAfternoon);
      } else if (17 <= currentHour && currentHour < 20) {
        addMedicineInDaytime(dayTimeEvening);
      } else {
        addMedicineInDaytime(dayTimeNight);
      }

    });
  });
});


// {
//   "medName": "123",
//   "day": "08.06.2021, 19:38:00",
//   "time": "2021-06-08T19:38",
//   "value": "123",
//   "dosage": "123",
//   "type": "capsule",
//   "method": "после еды"
// }