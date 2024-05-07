document.getElementById('audSpeed').onchange = () => {
    audio.playbackRate = document.getElementById('audSpeed').value;
};

volumeIcon.onclick = () => {
    volumeSideBar.classList.toggle(`volumeVisibility`); // .volumePos to .volumeVisibility{ /* Nothing in this CSS */}
    volumeSideBar.classList.toggle(`visibilityHidden`);
};

window.onclick = (e) => {
    if (e.target.id == `volumeIcon` || e.target.id == `volumeSideBar` || e.target.id == `volume-bar`) {
        return;
    }
    if (volumeSideBar.classList.contains(`volumeVisibility`)) {
        volumeSideBar.classList.toggle(`volumeVisibility`);
        volumeSideBar.classList.toggle(`visibilityHidden`);
    }
};

audioVolume.onchange = () => {
    volumemeter();
};

isReplay.onclick = () => {
    isReplay.innerHTML = (isReplay.innerHTML == replayOff) ? replayOn : replayOff;
};

audBanner.onclick = coverStyleChange;

masterPlay.onclick = async () => {
    a = await masterPlayerFunc();
};

audNext.onclick = async () => {
    if (index >= lastIndex) {
        index = 0;
    } else {
        index += 1;
    }
    prevNextbtnRunner(index);
    repeatTimeExitter.click();
};

audPrevious.onclick = async () => {
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


// audio.addEventListener('timeupdate', async (event) => {
//     let currentTimeIs = Math.floor(audio.currentTime);
//     if (currentTimeIs != 0) {
//         return;
//     }
//     let seekForCaption = (currentTimeIs + 5 > audio.duration) ? audio.duration : currentTimeIs + 5;

//     for (let i = 0; i < seekForCaption; i++) {
//         if (audioContent[index].captions[i]) {
//             console.log("..")
//             captionsWhenSeek[1] = audioContent[index].captions[i][0];
//         }
//     }
// });

audio.addEventListener('timeupdate', async () => {
    if (audioContent[index].captions.length == 0) {
        captionsDisplayer.innerText = "Caption Not Available!";
        return;
    }
    let currentTimeIs = Math.floor(audio.currentTime);
    // let seekBackCaption = (currentTimeIs - 5 < 0) ? 0 : currentTimeIs - 5;
    // let seekForCaption = (currentTimeIs + 5 > audio.duration) ? audio.duration : currentTimeIs + 5;


    // if (audioContent[index].captions[seekBackCaption]) {
    //     console.log(".")
    //     captionsWhenSeek[0] = audioContent[index].captions[seekBackCaption][0];
    // }

    // if (audioContent[index].captions[seekForCaption]) {
    //     console.log("..")
    //     captionsWhenSeek[1] = audioContent[index].captions[seekForCaption][0];
    // }

    // console.log(captionsWhenSeek)

    if (audioContent[index].captions[currentTimeIs]) {
        captionsDisplayer.innerText = audioContent[index].captions[currentTimeIs][0];
        return;
    }
});

myProgressBar.onclick = (event) => {
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


    captionsCalc(currentTimeIs, captionPoints.length - 1);
};

myProgressBar.onchange = (event) => {
    repeatTimeExitter.click();
};

timeBackward.onclick = () => {
    let currentTimeIs = Math.floor(audio.currentTime);
    audio.currentTime -= time;
    repeatTimeExitter.click();
    captionsCalc(currentTimeIs, captionPoints.length - 1);
};

timeForward.onclick = () => {
    let currentTimeIs = Math.floor(audio.currentTime);
    audio.currentTime += time;
    repeatTimeExitter.click();
    captionsCalc(currentTimeIs, captionPoints.length - 1);
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
