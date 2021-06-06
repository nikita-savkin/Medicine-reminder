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
    currentHour = +timeInput.slice(0, 2);

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

  const medicineSingleBlock = createMedicine(typeName, timeInput, medicineNameInput, dosageValueInput, dosageQuantityInput);

  const addMedicineInDaytime = (daytime) => daytime.querySelector('.day-time__schedule').append(medicineSingleBlock);

  if (medicineNameInput !== '' &&
    dosageValueInput !== '' &&
    dosageQuantityInput !== '' &&
    timeInput !== '' &&
    activeTypeName() !== undefined
  ) {
    if (currentHour > 5 && currentHour < 12) {
      addMedicineInDaytime(dayTimeMorning);
    } else if (currentHour => 12 && currentHour < 17) {
      addMedicineInDaytime(dayTimeAfternoon);
    } else if (currentHour => 17 && currentHour < 20) {
      addMedicineInDaytime(dayTimeEvening);
    } else {
      addMedicineInDaytime(dayTimeNight);
    }
  }
});

const createMedicine = (typeImgSrc, time, name, value, quantity, timeLeft = '10:00') => {
  const newMedicine = document.createElement('div');
  newMedicine.className = 'pill';
  newMedicine.innerHTML = `
  <div class="pill__image">
    <img src="img/${typeImgSrc}.svg" alt="capsule-img" class="pill__image-img">
  </div>
  <div class="pill__time">
    <p class="pill__time-title">Время</p>
    <p class="pill__time-amount">${time}</p>
  </div>
  <div class="pill__descr">
    <p class="pill__name">${name}</p>
    <p class="pill__amount">${value}, ${quantity} шт.</p>
  </div>
  <div class="pill__left">
    <p class="pill__left-title">Осталось</p>
    <p class="pill__left-quant">${timeLeft}<s/p>
  </div>
  <div class="pill__complete"></div>
  `;

  return newMedicine;
};