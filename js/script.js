'use strict';

const dayTimeLogo = document.querySelectorAll('.day-time__logo'),
  modalShowBtn = document.querySelector('#modal-show-btn'),
  modalMedicine = document.querySelector('#medicine-modal'),
  modalMedicineCloseBtn = document.querySelector('#medicine-modal-close'),
  medicineAddBtn = document.querySelector('#medicine-add-btn'),
  medicineTypes = document.querySelectorAll('.select-medicine__type'),
  dayTimeMorning = document.querySelector('#day-time-morning'),
  dayTimeAfternoon = document.querySelector('#day-time-afternoon'),
  dayTimeEvening = document.querySelector('#day-time-evening'),
  dayTimeNight = document.querySelector('#day-time-night');


//Show schedule on click
dayTimeLogo.forEach(logo => {
  logo.addEventListener('click', (e) => {
    e.currentTarget.closest('.day-time').querySelector('.day-time__schedule').classList.toggle('schedule-show');
  });
});

modalShowBtn.addEventListener('click', () => modalMedicine.classList.add('modal-show'));
modalMedicineCloseBtn.addEventListener('click', () => modalMedicine.classList.remove('modal-show'));


medicineTypes.forEach(type => {
  type.addEventListener('click', (e) => {
    medicineTypes.forEach(type => {
      type.classList.remove('active-medicine-type');
    });

    e.currentTarget.classList.add('active-medicine-type');
  });
});


medicineAddBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const medicineNameInput = document.querySelector('#select-medicine-name').value,
    dosageValueInput = document.querySelector('#dosage-value-input').value,
    dosageQuantityInput = document.querySelector('#dosage-quantity-input').value,
    timeInput = document.querySelector('#time-input').value,
    date = new Date(timeInput),
    formatedFullDate = date.toISOString(),
    currentHour = date.getHours(),
    currentMinutes = date.getMinutes(),
    dateShow = `${currentHour}:${currentMinutes}`;

  const activeTypeName = () => {
    let activeType;
    medicineTypes.forEach(type => {
      if (type.classList.contains('active-medicine-type')) {
        activeType = type;
      }
    });

    if (activeType !== undefined) {
      return activeType.dataset.medtype;
    }
  };

  const typeName = activeTypeName();

  const medicineSingleBlock = createMedicine(typeName, formatedFullDate, dateShow, medicineNameInput, dosageValueInput, dosageQuantityInput);

  const addMedicineInDaytime = (daytime) => {
    const schedule = daytime.querySelector('.day-time__schedule');
    schedule.append(medicineSingleBlock);
    schedule.classList.add('schedule-show');
  };

  if (medicineNameInput !== '' &&
    dosageValueInput !== '' &&
    dosageQuantityInput !== '' &&
    timeInput !== '' &&
    activeTypeName() !== undefined
  ) {
    if (5 <= currentHour && currentHour < 12) {
      addMedicineInDaytime(dayTimeMorning);
    } else if (12 <= currentHour && currentHour < 17) {
      addMedicineInDaytime(dayTimeAfternoon);
    } else if (17 <= currentHour && currentHour < 20) {
      addMedicineInDaytime(dayTimeEvening);
    } else {
      addMedicineInDaytime(dayTimeNight);
    }

    medicineLeftTime();
  }
});

const createMedicine = (typeImgSrc, date, dateShow, name, value, quantity, timeLeft = '10:00') => {
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
  </div>
  <div class="pill__left">
    <p class="pill__left-title">Осталось</p>
    <p class="pill__left-quant">${timeLeft}<s/p>
  </div>
  <div class="pill__complete">
    <img src="img/checked.svg" alt="pill-complete-icon" class="pill__check-icon">
    <img src="img/error.svg" alt="pill-cancel-icon" class="pill__check-icon">
  </div>
  `;

  return newMedicine;
};

const medicineLeftTime = () => {
  const now = new Date();
  const medicineTimeAmount = document.querySelectorAll('.pill__time-amount');

  medicineTimeAmount.forEach(time => {
    const medicineTime = new Date(time.dataset.time);
    const leftTime = time.closest('.pill').querySelector('.pill__left-quant');

    const currentTime = medicineTime.getTime() - now.getTime();

    const hours = Math.floor((currentTime / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((currentTime / (1000 * 60)) % 60);
    const seconds = Math.floor((currentTime / 1000) % 60)

    console.log(hours);

    // leftTime.textContent = Math.abs(now - medicineTime)
  });
};

// 1623091163631

// 1625600340000