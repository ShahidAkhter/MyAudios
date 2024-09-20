const renderAudioContent = async () => {
    playList.innerHTML = "";
    channelListDiv.style.display = 'none';

    for (let i = 0; i < audioContent.length; i++) {
        const element = audioContent[i];
        playList.innerHTML += `
            <div class="songItem flex f-center f-left margin-2 padding-1 bg cursor-pointer playTab" id="play${i}">
                <div class="imgList flex f-center">
                    <img alt="${i}" id="${i}" class="border-radius" src="${element.cover}">
                </div>
                <div class="margin-x infoTabs w-1" id="infoTab${i}">
                    <div class="text-size-1" id="title${i}">${element.title}</div>
                    <div class="text-size-2" id="creator${i}">${element.creator}</div>
                </div>
                <div class="flex f-center">
                    <span class="channels text-center" id="channel${i}">
                        <span class="channel">${element.channel}</span>
                    </span>
                    <span class="time text-center" id="time${i}">
                        <span class="timeDur">${element.audioLength}</span>
                    </span>
                    <span class="audList flex f-center">
                        <span class="playnPause">
                            <img src="assets\\appImgs\\play-solid.svg" class="control-imgs plays" id="isPlayingExpress${i}" alt="play">
                        </span>
                    </span>
                </div>
            </div>`;
    }
    await updateAudioLengths();
    playEvent();
    playList.style.display = 'flex';
};

const fetchAudioData = async (url, splicingNum) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const htmlText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        const anchors = Array.from(doc.querySelectorAll('a'));
        const hrefs = anchors.map(a => a.href);

        if (hrefs.length > splicingNum) {
            hrefs.splice(0, splicingNum);
        }
        return hrefs;
    } catch (error) {
        console.error(`Error fetching audio data: ${error.message}`);
        return [];
    }
};

let audioContentList = {};

const createAudioContentList = async () => {
    try {
        const response = await fetchAudioData('/media/sounds', 4);
        if (response.length === 0) {
            const storedAudioContentList = localStorage.getItem('audioContentList');
            if (storedAudioContentList) {
                audioContentList = JSON.parse(storedAudioContentList);
                renderChannels();
                return;
            } else {
                console.error('No response received and no stored audio content list found.');
                return;
            }
        }

        let audioContent = {};

        for (const e of response) {
            const channelName = e.split('/').pop().replace(/%20/g, ' ');
            const fetchFromFolder = await fetchAudioData(e, 5);

            const audioContentForChannel = await Promise.all(fetchFromFolder.map(async (efol) => {
                // Extract data from the URL
                const [fullTitle, fullCreatorsName] = efol.split('.BY.');
                const title = fullTitle.split('/').pop().replace(/%20/g, ' ');
                const creator = fullCreatorsName.split('.').slice(0, -1).join('.').replace(/%20/g, ' ');
                const coverFileName = efol.split('/').pop().split('.').slice(0, -1).join('.').replace(/%20/g, ' ');
                const coverPath = 'media/covers/' + channelName + '/' + coverFileName + '.jpg';
                const captionResp = await fetch('media/captions/' + channelName + '/' + coverFileName + '.json');

                // Fetch captions
                let captions = {};
                if (captionResp.ok) {
                    captions = await captionResp.json();
                } else {
                    captions = {
                        "fontFamily": ["Arabic"],
                        "0": [
                            "---"
                        ]
                    };

                }

                const pathFileName = efol.split('/').pop().replace(/%20/g, ' ');
                const path = 'media/sounds/' + channelName + '/' + pathFileName;

                return {
                    title,
                    path,
                    cover: coverPath,
                    creator,
                    channel: channelName,
                    captions,
                    audioLength: "00:00",
                    integerLength: 0,
                    bg: "rgb(201, 255, 131)"
                };
            }));

            audioContent[channelName] = audioContentForChannel;
        }

        audioContentList = { "channels": audioContent };
        localStorage.setItem('audioContentList', JSON.stringify(audioContentList));
        renderChannels();
    } catch (error) {
        console.error('Error creating audio content list:', error);
    }
};

const renderChannels = async () => {
    allNoOfAudiosIs = 0;
    noOfChannels = Object.keys(audioContentList['channels']).length;
    myloader.classList.remove(`displayNone`);
    channelListDiv.innerHTML = ""
    a = await loadertoggle(0);
    Object.keys(audioContentList['channels']).forEach(async (element) => {
        allNoOfAudiosIs += audioContentList['channels'][element].length;
    });
    channelListDiv.innerHTML += `
        <div class="channelsListDesign flex f-center f-left margin-2 padding-1 bg min-w-2 border-1 border-radius cursor-pointer" id="allChannelsContent">
            <div class="flex f-center">
                <div class="imgList flex f-center">
                    <img alt="-1" class="border-radius" src="./assets/favicon.ico">
                </div>
                <div class="margin-x-0 w-1">
                    <span>
                        <span class="myChannelName">All Channels</span>
                    </span>
                </div>
                <div class="margin-x-0">
                    <span>
                        <span class="NoOfAudios" id="AllNoOfAudios">AudiosCount: ${allNoOfAudiosIs}</span>
                    </span>
                </div>
            </div>
        </div>`;

    a = await loadertoggle(10);
    Object.keys(audioContentList['channels']).forEach(async (element, i) => {
        channelListDiv.innerHTML += `
            <div class="channelItemIs channelsListDesign flex f-center f-left margin-2 padding-1 bg min-w-2 border-1 border-radius cursor-pointer" id="channelItemNo${i}">
                <div class="flex f-center">
                    <div class="imgListChannelBar flex f-center">
                        <img alt="${i}" class="border-radius" src="${audioContentList['channels'][element][0]["cover"]}">
                    </div>
                    <div class="margin-x-0  w-1 channelNameDiv">
                        <span id="channelList${i}" class="channelName">
                            <span class="myChannelName">${element}</span>
                        </span>
                    </div>
                    <div class="margin-x-0">
                        <span>
                            <span class="NoOfAudios">AudiosCount: ${audioContentList['channels'][element].length}</span>
                        </span>
                    </div>
                </div>
            </div>`;
        a = await loadertoggle(((i + 1) / noOfChannels) * 100);
    });
    setTimeout(() => {
        myloader.classList.add(`displayNone`);
    }, 1000)

    Array.from(document.getElementsByClassName('channelItemIs')).forEach(async (element, i) => {
        element.onclick = async () => {
            let channelDisplaying = element.querySelector(`.channelName .myChannelName`).innerText

            if (currentChannel == channelDisplaying) {
                channelListDiv.style.display = 'none';
                playList.style.display = 'flex';
                return;
            }

            audioContent = await audioContentList['channels'][channelDisplaying];
            index = 0;
            lastIndex = audioContent.length - 1;
            if (currentChannel == channelDisplaying) {
                channelListDiv.style.display = 'none';
                playList.style.display = 'flex';
                return;
            }
            audio.src = audioContent[index].path;
            currentChannel = channelDisplaying
            renderAudioContent();
        };
    });

    document.getElementById('allChannelsContent').onclick = () => {

        if (currentChannel == 'AllChannels') {
            channelListDiv.style.display = 'none';
            playList.style.display = 'flex';
            return;
        }

        audioContent = []
        Object.keys(audioContentList['channels']).forEach(async (element) => {
            audioContentList['channels'][element].forEach(async (audio) => {
                audioContent.push(audio);
            });
        });
        index = 0;
        lastIndex = audioContent.length - 1;
        if (currentChannel == 'AllChannels') {
            channelListDiv.style.display = 'none';
            playList.style.display = 'flex';
            return;
        }
        audio.src = audioContent[index].path;
        renderAudioContent();
        currentChannel = 'AllChannels'
    };
};

let audioContent = [];
createAudioContentList();
