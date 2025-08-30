repeaterTime.addEventListener('click', () => {
    let current = Math.floor(audio.currentTime);
    console.log(repeaterTime.innerText)
    if (repeaterTime.innerText == 'Start') {
        curRepeatInterval.classList.remove('displayNone')
        repeatTimeBeginVar = current;
        curRepeatInterval.innerText = getAudLength(repeatTimeBeginVar);
        repeaterTime.innerText = 'Stop';
    }
    else if (repeaterTime.innerText == 'Stop') {
        current += 1;
        if (repeatTimeBeginVar && (repeatTimeBeginVar + 2) >= current) {
            return;
        }
        isRepeaterOn = true;
        repeatTimeEndVar = current;
        curRepeatInterval.innerText += `-${getAudLength(repeatTimeEndVar)}`;
        repeaterTime.innerText = 'XXXX';

    }
    else {
        exitRepeats();
    }

});

const exitRepeats = () => {
    repeaterTime.innerText = "Start";
    repeatTimeBeginVar = 0;
    repeatTimeEndVar = 0;
    isRepeaterOn = false;
    curRepeatInterval.classList.add('displayNone')

}