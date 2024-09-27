// Changing cover style
const coverStyleChange = () => {
    audBanner.classList.toggle(`posChange`);
    info.classList.toggle(`infoWidthChange`);
}

const loadertoggle = async (widthLoad) => {
    document.getElementById('loadingBar').style.width = widthLoad + '%';
}

const getAudLength = (audioLength) => {
    let audioLen = Number.parseInt(audioLength);
    let hours = Math.floor(audioLen / 3600);
    let minutes = Math.floor((audioLen % 3600) / 60);
    let seconds = audioLen % 60;

    // Add leading zeros if necessary
    let minutesStr = minutes.toString().padStart(2, '0');
    let secondsStr = seconds.toString().padStart(2, '0');

    if (hours <= 0) {
        return `${minutesStr}:${secondsStr}`;
    }

    let hoursStr = hours.toString().padStart(2, '0');
    return `${hoursStr}:${minutesStr}:${secondsStr}`;
};

const getIntegerAudLength = async (audio) => {
    let audioLength = Number.parseInt(audio.duration);
    return audioLength;
}

const playEvent = async () => {
    Array.from(document.getElementsByClassName("playTab")).forEach((element) => {
        element.onclick = async () => {
            // adding click to play and pause funtionality to playTab
            index = Number.parseInt(element.id.split("y")[1]);
            if (audioChanged != audioContent[index].path && audioContent[index].path) {
                audio.src = audioContent[index].path;
            }
            a = await alwaysRun(index);

            let url = JSON.stringify(document.querySelector(`#${element.id} #isPlayingExpress${index}`).src)

            if (url.includes(pause)) {
                document.querySelector(`#${element.id} #isPlayingExpress${index}`).src = play;
                masterPlay.src = play;
                audio.pause();
            } else {
                resetplay();
                document.querySelector(`#${element.id} #isPlayingExpress${index}`).src = pause;
                masterPlay.src = pause;
                audio.play();
            }
            audioChanged = audioContent[index].path;
        };
    });
}

const resetplay = async () => {
    Array.from(document.getElementsByClassName("plays")).forEach((element) => {
        element.src = `assets/appImgs/play-solid.svg`;
    });
}

const alwaysRun = async (i) => {
    audio.addEventListener('loadedmetadata', async () => {
        setData(i);
    });
}

const setData = async (i) => {
    // console.log(i)
    captionsDisplayer.innerHTML="Caption Tab!"
    audioChanged = audioContent[index].path;

    currentTimeDur.innerText = "00:00";
    timeDuration.innerText = audioContent[i].audLength;
    audTitle.innerText = audioContent[i].title;
    audBanner.src = audioContent[i].cover!=""?audioContent[i].cover:defaultCover;
    audCreator.innerText = audioContent[i].creator;
    audChannel.innerText = audioContent[i].channel;

    // favIcon.href = audBanner.src;
    if (audioContent[i].captions['fontFamily'][0] && audioContent[i].captions['fontFamily'][0] != "") {
        captionsDisplayer.style.fontFamily = audioContent[i].captions['fontFamily'][0]
    }else{
        captionsDisplayer.style.fontFamily = 'auto'
    };

    // captionPoints
    captionPoints = Object.keys(audioContent[i].captions)
    captionPoints.map((e, i) => { captionPoints[i] = parseInt(e) })

    // mediaUpdater
    mediaUpdater(audTitle.innerText, audCreator.innerText, audChannel.innerText, audBanner.src)

}

const volumemeter = () => {
    audio.volume = audioVolume.value / volMaxValueRange;
}

const masterPlayerFunc = async () => {
    if (audioContent.length === 0) return;

    if (audio.paused || audio.currentTime <= 0) {
        audio.play();
        masterPlay.src = pause;
        a = await resetplay();
        document.querySelector(`#play${index} #isPlayingExpress${index}`).src = pause;
    }
    else {
        audio.pause();
        masterPlay.src = play;
        a = await resetplay();
    }
    a = await alwaysRun(index);
}

const prevNextbtnRunner = async (index) => {
    a = await resetplay();
    document.querySelector(`#play${index} #isPlayingExpress${index}`).src = pause;
    masterPlay.src = pause;
    audio.src = audioContent[index].path ? audioContent[index].path : audio.src;
    a = await alwaysRun(index);
    myProgressBar.value = 0;
    audio.play();
};

// Define the function to update audio lengths
const updateAudioLengths = async () => {
    // Iterate through each audio
    audioContentLength = audioContent.length
    myloader.classList.remove(`displayNone`);
    a = await loadertoggle(0);
    for (let i = 0; i < audioContentLength; i++) {
        const element = audioContent[i];
        const audio = new Audio(element.path);
        try {
            // Wait for audio metadata to be loaded
            await new Promise(async (resolve, reject) => {
                audio.onloadedmetadata = resolve;
                audio.onerror = reject; // Handle errors
                a = await loadertoggle(((i + 1) / audioContentLength) * 100);
            });

            // Update audio length
            element.audLength = await getAudLength(audio.duration);
            element.integerLength = await getIntegerAudLength(audio);

            // Update UI with audio duration
            document.querySelector(`#time${i} .timeDur`).innerText = `${element.audLength}`;
            // Show loader while loading audio metadata
        } catch (error) {
            console.error('Error loading audio:', error);
            a = await loadertoggle(10);
            // Handle error, e.g., display an error message
        } finally {
            // Hide loader after loading
            a = await loadertoggle(100);
            // Update data (if needed)
            setData(index);
            setTimeout(() => {
                myloader.classList.add(`displayNone`);
            }, 1000)
        }
    }
};
