// script.js

// 이벤트 리스너 pause_button
document.querySelector('.pause-button').addEventListener('click', function () {
    const wrapper = document.querySelector('.overlap-wrapper');
    // 'expanded' 클래스 토글
    wrapper.classList.toggle('expanded');
});

// 이벤트 리스너 result
document.querySelector('.pause-button').addEventListener('click', function () {
    const result = document.querySelector('.result');
    result.classList.toggle('show'); // 'show' 클래스를 토글하여 보이게/숨기게
});
