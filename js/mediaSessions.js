// Define initial metadata
let mediaMetadata = {
    title: "MyAudios",
    artist: 'Shahid Akhter',
    album: 'Projects'
};

// Media session handling
if ("mediaSession" in navigator) {
    try {
        navigator.mediaSession.metadata = new MediaMetadata(mediaMetadata);
    } catch (error) {
        
    }

    const handleMediaAction = (action, callback) => {
        navigator.mediaSession.setActionHandler(action, () => {
            try {
                callback();
            } catch (error) {
                console.log(`Error while handling ${action} action: ${error.message}`);
            }
        });
    };

    handleMediaAction("play", () => {
        masterPlay.click();
        navigator.mediaSession.playbackState = "playing";
    });

    handleMediaAction("pause", () => {
        masterPlay.click();
        navigator.mediaSession.playbackState = "paused";
    });

    handleMediaAction("seekbackward", () => {
        timeBackward.click();
    });

    handleMediaAction("seekforward", () => {
        timeForward.click();
    });

    handleMediaAction("previoustrack", () => {
        audPrevious.click();
    });

    handleMediaAction("nexttrack", () => {
        audNext.click();
    });
}

// Action handlers
const actionHandlers = [
    // play
    [
        "play",
        async () => {
            masterPlay.click();
            navigator.mediaSession.playbackState = "playing";
        },
    ],
    // pause
    [
        "pause",
        () => {
            masterPlay.click();
            navigator.mediaSession.playbackState = "paused";
        },
    ],
];

for (const [action, handler] of actionHandlers) {
    try {
        navigator.mediaSession.setActionHandler(action, handler);
    } catch (error) {
        console.log(`The media session action "${action}" is not supported yet.`);
    }
}

// mediaUpdater()
const mediaUpdater = (titleIs, artistIs, albumIs, imgSource) => {
    mediaMetadata = {
        title: titleIs,
        artist: artistIs,
        album: albumIs,
        artwork: [
            { src: imgSource }
        ]
    };
    try {
        navigator.mediaSession.metadata = new MediaMetadata(mediaMetadata);
    } catch (error) {
        
    }
}