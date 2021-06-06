'use strict';

const dayTimeLogo = document.querySelectorAll('.day-time__logo');

//Show schedule on click
dayTimeLogo.forEach(logo => {
  logo.addEventListener('click', (e) => {
    e.currentTarget.closest('.day-time').querySelector('.day-time__schedule').classList.toggle('show-schedule');
  });
});

