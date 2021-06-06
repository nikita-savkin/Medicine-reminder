'use strict';

const dayTimeLogo = document.querySelectorAll('.day-time__logo');

dayTimeLogo.forEach(logo => {

  logo.addEventListener('click', (e) => {
    console.log(e.currentTarget.closest('.day-time'));
    e.currentTarget.closest('.day-time').querySelector('.day-time__schedule').classList.toggle('show-schedule');
  });

});