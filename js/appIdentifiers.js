let maxValueRange = 10000;
let playList = document.getElementById('Playlist');
let info = document.getElementById('info');
let myloader = document.getElementById('myloader');
let playerControl = document.getElementById('player-control');
// let expanCont = document.getElementById('expanCont');
let masterPlay = document.getElementById('masterPlay');
let myProgressBar = document.getElementById('progress-bar');
let timeDuration = document.getElementById('time-duration');
let currentTimeDur = document.getElementById('currentTimeDur');
let volumeIcon = document.getElementById('volumeIcon');
let volumeSideBar = document.getElementById('volumeSideBar');
let audioVolume = document.getElementById('volume-bar');
let timeBackward = document.getElementById('time_backward');
let timeForward = document.getElementById('time_forward');

let audBanner = document.getElementById('banner');
let audTitle = document.getElementById('title');
let audCreator = document.getElementById('creator');
let audChannel = document.getElementById('channel');

let audPrevious = document.getElementById('previous');
let audNext = document.getElementById('next');

let captionsDisplayer = document.getElementById('captionDisplayer');

let isReplay = document.getElementById('isReplay');

let repeatTimeBegin = document.getElementById('repeatTimeBegin')
let repeatTimeEnd = document.getElementById('repeatTimeEnd')
let repeatTimeExitter = document.getElementById('repeatTimeExitter')

let favIcon = document.querySelector('link[rel="shortcut icon"]');

let isRepeaterOn = false
let repeatTimeBeginVar = 0
let repeatTimeEndVar = 0
let repeatPause = true;
let repeatPlay = true;


isReplay.innerHTML = `<abbr title="Replayer"><img src="assets\\appImgs\\not-rotate-solid.svg" class="control-imgs height-sm font-bolder" alt="Replayer"></abbr>`
let time = 5;
let index = 0;
let lastIndex = 0;
captionPoints = [];
captionsWhenSeek=[]

let audio = new Audio();
audioVolume.value = maxValueRange;
let pause = `assets/appImgs/pause-solid.svg`;
let play = `assets/appImgs/play-solid.svg`;

let replayOn = `<abbr title="Replayer"><img src="assets\\appImgs\\rotate-solid.svg" class="control-imgs height-sm font-bolder" alt="Replayer"></abbr>`;
let replayOff = `<abbr title="Replayer"><img src="assets\\appImgs\\not-rotate-solid.svg" class="control-imgs height-sm font-bolder" alt="Replayer"></abbr>`;
