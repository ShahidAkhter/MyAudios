let lst = [[0.5, 1, 1.5, 2], [1]]; // Corrected array initialization with the index starting at 0
document.getElementById('audSpeed').onclick = () => {

    lst[1][0] += 1;
    if (lst[1][0] >= (lst[0].length)) {
        lst[1][0] = 0;
    }

    audio.playbackRate = lst[0][lst[1][0]];
    document.getElementById('audSpeed').innerText = `${lst[0][lst[1][0]]}x`;
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
    isReplay.src = (!isReplayer) ? replayOn : replayOff;
    isReplayer = (!isReplayer)
};

audBanner.onclick = coverStyleChange;

masterPlay.onclick = async () => {
    a = await masterPlayerFunc();
};

audNext.onclick = async () => {
    if (audioContent.length === 0) return;

    if (index >= lastIndex) {
        index = 0;
    } else {
        index += 1;
    }
    prevNextbtnRunner(index);
    exitRepeats();
};

audPrevious.onclick = async () => {
    if (audioContent.length === 0) return;

    if (index <= 0) {
        index = lastIndex;
    } else {
        index -= 1;
    }
    prevNextbtnRunner(index);
    exitRepeats();
};

// Listen to Events
audio.addEventListener('timeupdate', async (event) => {
    // Update Seekbar
    if (audioContent.length === 0) return;

    progress = Number.parseInt((audio.currentTime / audioContent[index].integerLength) * maxValueRange);
    currentTimeDur.innerText = getAudLength(audio.currentTime);
    myProgressBar.value = progress;
    current = Math.floor(audio.currentTime);
    if (isReplayer && audio.ended) {
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
    if (audioContent.length === 0) return;

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

myProgressBar.oninput = (event) => {
    if (audioContent.length === 0) return;

    progressPercentage = (myProgressBar.value / maxValueRange) * audio.duration
    audio.currentTime = progressPercentage;

    let currentTimeIs = Math.floor(audio.currentTime);

    currentTimeDur.innerText = getAudLength(audio.currentTime);
    if (isReplayer && audio.ended) {
        masterPlay.click();
        return;
    }
    if (audio.ended) {
        masterPlay.src = play;
        resetplay();
    }
    exitRepeats();


    captionsCalc(currentTimeIs, captionPoints.length - 1);
};

myProgressBar.onchange = (event) => {
    exitRepeats();
};

timeBackward.onclick = () => {
    if (audioContent.length === 0) return;

    let currentTimeIs = Math.floor(audio.currentTime);
    audio.currentTime -= time;
    exitRepeats();
    captionsCalc(currentTimeIs, captionPoints.length - 1);
};

timeForward.onclick = () => {
    if (audioContent.length === 0) return;

    let currentTimeIs = Math.floor(audio.currentTime);
    audio.currentTime += time;
    exitRepeats();
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