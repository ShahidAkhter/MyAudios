const renderAudioContent = async () => {
    playList.innerHTML = "";
    channelListDiv.style.display = 'none';

    for (let i = 0; i < audioContent.length; i++) {
        const element = audioContent[i];
        // console.log(element.cover)
        if (!audioContent[i - 1] || audioContent[i - 1].channel !== element.channel) {
            playList.innerHTML +=`<div class="channelWithAudioList channelsListDesign margin-2 channelsListDesignMini flex f-center f-between padding-1 bg-1 border-1 border-radius cursor-pointer" aria-labelledby="${element.channel.replace(/\s/g, "|")}">
            <div class="flex f-center">
                <div class="imgList flex f-center">
                    <img alt="" class="border-radius" src="${element.cover === 'channelLogo' ? `media/${element.channel}/info/logo.jpg` : element.cover !== "" ? element.cover : defaultCover}">
                </div>
                <div class="margin-x-0">
                    <span>
                        <span class="myChannelName">${element.channel}</span> 
                    </span>
                </div>
            </div>
            <div class="flex f-center">
                <span class="toggleChannelTab">
                    <img src="assets\\appImgs\\angle-up.svg" class="control-imgs-0" alt="Close">
                </span>
            </div>
        </div>`
        }
        playList.innerHTML += `
            <div class="${element.channel.replace(/\s/g, "|")} songItem flex f-center f-left margin-2 padding-1 bg cursor-pointer playTab" id="play${i}" aria-labelledby="${element.channel.replace(/\s/g, "|")}Item">
                <div class="imgList flex f-center">
                    <img alt="${i}" id="${i}" class="border-radius" src="${element.cover === 'channelLogo' ? `media/${element.channel}/info/logo.jpg` : element.cover !== "" ? element.cover : defaultCover}">
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

        // Splicing anchors that not required
        if (anchors.length > splicingNum) {
            anchors.splice(0, splicingNum);
        }

        // Extracting and Decoding hrefs and saved to decodedHrefs
        const decodedHrefs = anchors.map(a => decodeURIComponent(a.href));

        // Returning decodedHrefs
        return decodedHrefs;
    } catch (error) {
        console.error(`Error fetching audio data: ${error.message}`);
        return [];
    }
};

let audioContentList = {};

const createAudioContentList = async () => {
    try {
        const response = await fetchAudioData('media', 3);
        // console.log(response)
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
            const channelName = e.split('/').pop();
            // console.log(channelName)
            const fetchFromFolder = await fetchAudioData('media/' + channelName + '/audios', 5);
            // const channelLogo='media/' + channelName + '/info/logo.jpg'
            // console.log(fetchFromFolder)
            const audioContentForChannel = await Promise.all(fetchFromFolder.map(async (efol) => {
                // Extract data from the URL
                // console.log(efol)
                let fullTitle, fullCreatorsName, title, creator, fileName, coverPath;
                if (efol.includes('.BY.')) {
                    [fullTitle, fullCreatorsName] = efol.split('.BY.');
                    title = fullTitle.split('/').pop();
                    creator = fullCreatorsName.split('.').slice(0, -1).join('.');
                } else {
                    title = efol.split('/').pop().split('.').slice(0, -1).join('.');
                    creator = channelName;
                }

                fileName = efol.split('/').pop().split('.').slice(0, -1).join('.');
                coverPath = 'media/' + channelName + '/covers/' + fileName + '.jpg';
                const captionResp = await fetch('media/' + channelName + '/captions/' + fileName + '.json');

                // Fetch cover to check its ok
                let coverOk;
                let channelLogoOk;
                try {
                    coverOk = await fetch(coverPath);
                } catch (error) {
                    coverPath = "";
                }

                if (!coverOk || !coverOk.ok) {
                    try {
                        channelLogoOk = await fetch('media/' + channelName + '/info/logo.jpg');
                    } catch (error) {
                        coverPath = "";
                    }

                    if (channelLogoOk && channelLogoOk.ok) {
                        coverPath = 'channelLogo';
                    } else {
                        // Optional handling if channelLogoOk fails
                        coverPath = "";
                    }
                }



                // Fetch captions
                let captions = {};
                if (captionResp.ok) {
                    try {
                        captions = await captionResp.json();
                    } catch (e) {
                        captions = defaultCaption;
                    }
                } else {
                    captions = defaultCaption;

                }

                const pathFileName = efol.split('/').pop();
                const path = 'media/' + channelName + '/audios/' + pathFileName;

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
        <div class="channelsListDesign flex f-center f-left margin-2 margin-t-1 padding-1 bg min-w-2 border-1 border-radius cursor-pointer" id="allChannelsContent">
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
                        <img alt="${i}" class="border-radius" src="${audioContentList['channels'][element][0]["cover"] === 'channelLogo' ? `media/${audioContentList['channels'][element][0]["creator"]}/info/logo.jpg` : audioContentList['channels'][element][0]["cover"] != "" ? audioContentList['channels'][element][0]["cover"] : defaultCover}">
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

        audio.src = audioContent[index].path;
        currentChannel = 'AllChannels'
        renderAudioContent();
    };
};

let audioContent = [];
createAudioContentList();
