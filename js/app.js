document.getElementById('audSpeed').onchange = () => {
    audio.playbackRate = document.getElementById('audSpeed').value;
};

volumeIcon.onclick= () => {
    volumeSideBar.classList.toggle(`volumePos`);
    volumeSideBar.classList.toggle(`displayNone`);
};

window.onclick= (e) => {
    if (e.target.id == `volumeIcon` || e.target.id == `volumeSideBar` || e.target.id == `volume-bar`) {
        return;
    }
    if (volumeSideBar.classList.contains(`volumePos`)) {
        volumeSideBar.classList.toggle(`volumePos`);
        volumeSideBar.classList.toggle(`displayNone`);
    }
};

audioVolume.onchange = () => {
    volumemeter();
};

isReplay.onclick= () => {
    isReplay.innerHTML = (isReplay.innerHTML == replayOff) ? replayOn : (isReplay.innerHTML == replayOn) ? replayOff : "hi";
};

audBanner.onclick= coverStyleChange;

masterPlay.onclick= async () => {
    a = await masterPlayerFunc();
};

audNext.onclick= async () => {
    if (index >= lastIndex) {
        index = 0;
    } else {
        index += 1;
    }
    prevNextbtnRunner(index);
    repeatTimeExitter.click();
};

audPrevious.onclick= async () => {
    if (index <= 0) {
        index = lastIndex;
    } else {
        index -= 1;
    }
    prevNextbtnRunner(index);
    repeatTimeExitter.click();
};

// Listen to Events
audio.addEventListener('timeupdate', async (event) => {
    // Update Seekbar
    progress = Number.parseInt((audio.currentTime / audioContent[index].integerLength) * maxValueRange);
    currentTimeDur.innerText = getAudLength(audio.currentTime);
    myProgressBar.value = progress;
    current = Math.floor(audio.currentTime);
    if (isReplay.innerHTML == replayOn && audio.ended) {
        masterPlay.click();
        return;
    }
    if (isRepeaterOn) {
        if (current === repeatTimeEndVar) {
            try {
                audio.currentTime = repeatTimeBeginVar;
            } catch (error) {
                console.log(error);
            }
        }
    }
    if (audio.ended) {
        audNext.click();
    }
});

audio.addEventListener('timeupdate', async () => {
    if (audioContent[index].captions.length == 0) {
        captionsDisplayer.innerText = "No caption";
        return;
    }
    let currentTimeIs = `${Math.floor(audio.currentTime)}`;
    if (audioContent[index].captions[currentTimeIs]) {
        captionsDisplayer.innerText = audioContent[index].captions[currentTimeIs][0];
        return;
    }
});

myProgressBar.onclick= (event) => {
    const progressPercentage = event.offsetX / myProgressBar.clientWidth;
    audio.currentTime = progressPercentage * audio.duration;

    let currentTimeIs = Math.floor(audio.currentTime);

    currentTimeDur.innerText = getAudLength(audio.currentTime);
    if (isReplay.innerHTML == replayOn && audio.ended) {
        masterPlay.click();
        return;
    }
    if (audio.ended) {
        masterPlay.src = play;
        resetplay();
    }
    repeatTimeExitter.click();


    for (let i = 0; i < captionPoints.length - 1; i++) {
        const element = parseInt(captionPoints[i])
        const elementNext = parseInt(captionPoints[i + 1])

        if (element <= currentTimeIs && elementNext >= currentTimeIs) {
            captionsDisplayer.innerText = audioContent[index].captions[element][0];
            return;
        }
    }
    captionsDisplayer.innerText = audioContent[index].captions[captionPoints[captionPoints.length - 1]][0];
};

myProgressBar.onchange = (event) => {
    repeatTimeExitter.click();
};

timeBackward.onclick= () => {
    audio.currentTime -= time;
    repeatTimeExitter.click();
};

timeForward.onclick= () => {
    audio.currentTime += time;
    repeatTimeExitter.click();
};

// KeyboardEvent
window.addEventListener('keydown', (event) => {
    if (event.code == "Space") {
        event.preventDefault();
        masterPlay.click();
    } else if (event.ctrlKey && event.key == "ArrowLeft") {
        audPrevious.click();
    } else if (event.ctrlKey && event.key == "ArrowRight") {
        audNext.click();
    } else if (event.key === "ArrowLeft") {
        timeBackward.click();
    } else if (event.key === "ArrowRight") {
        timeForward.click();
    }
});
