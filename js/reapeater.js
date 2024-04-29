// const repeatTimeBegin = document.getElementById('repeatTimeBegin')
// const repeatTimeEnd = document.getElementById('repeatTimeEnd')
// const repeatTimeRunner = document.getElementById('repeatTimeRunner')
// let isRepeaterOn=false
repeatTimeBegin.addEventListener('click', () => {
    const current = Math.floor(audio.currentTime);
    repeatTimeBegin.innerText = getAudLength(current);
    repeatTimeBeginVar = current;
});

repeatTimeEnd.addEventListener('click', () => {
    const current = Math.floor(audio.currentTime) + 1;
    if (repeatTimeBeginVar && (repeatTimeBeginVar + 2) >= current) {
        return;
    }
    isRepeaterOn = true;
    repeatTimeEnd.innerText = getAudLength(current);
    repeatTimeEndVar = current;
});

repeatTimeExitter.addEventListener('click', () => {
    repeatTimeBegin.innerText = "Start";
    repeatTimeEnd.innerText = "Stop";
    repeatTimeBeginVar = 0;
    repeatTimeEndVar = 0;
    isRepeaterOn = false;
});
