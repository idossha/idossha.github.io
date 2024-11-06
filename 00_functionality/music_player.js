// Select elements
const musicContainer = document.querySelector('.music-container');
const progress = document.querySelector(".progress");
const progressContainer = document.querySelector(".progress-container");
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const playBtn = document.querySelector("#play");
const prevBtn = document.querySelector("#prev");
const nextBtn = document.querySelector("#next");
const audio = document.querySelector("#audio");
const title = document.querySelector("#title");
const cover = document.querySelector("#cover");
const descriptionEl = document.querySelector('#description');


// Mixes data with track lists
const mixes = [
    {
        title: 'IdoHaber x GeoffK 2023-06-22',
        audioSrc: '../03_assets_music_audio/IdoHaber x GeoffK 2023-06-22.mp3',
        coverSrc: '../03_assets_music_audio/IdoHaber x GeoffK 2023-06-22.jpg',
        description: 'A collaborative mix by IdoHaber and GeoffK, blending various electronic genres.',
        tracks: [
            'Track 1: Intro',
            'Track 2: Beat Drop',
            'Track 3: Melody',
            // Add more tracks as needed
        ]
    },
    {
        title: 'Bedroom Session - Hypnagogia',
        audioSrc: '../03_assets_music_audio/Bedroom Session - Hypnagogia.mp3',
        coverSrc: '../03_assets_music_audio/Bedroom Session - Hypnagogia.jpg',
        description: 'An ambient mix exploring the state between wakefulness and sleep.',
        tracks: [
            'Track 1: Dream State',
            'Track 2: Lucid',
            'Track 3: Awakening',
            // Add more tracks as needed
        ]
    }
];

// Keep track of mixes
let mixIndex = 0;

// Initially load the mix
loadMix(mixes[mixIndex]);

function loadMix(mix) {
    title.innerText = mix.title;
    audio.src = mix.audioSrc;
    cover.src = mix.coverSrc;
    descriptionEl.innerText = mix.description; // Add this line
    updateTrackList(mix.tracks);
}

// Update the track list in the sidebar
function updateTrackList(tracks) {
    const trackList = document.querySelector('#track-list');
    trackList.innerHTML = ''; // Clear existing tracks

    tracks.forEach((track, index) => {
        const li = document.createElement('li');
        li.innerText = track;
        // Optional: Add click event to jump to specific time if time data is available
        trackList.appendChild(li);
    });
}

function playSong() {
    musicContainer.classList.add("play");
    playBtn.querySelector('i.fas').classList.remove('fa-play');
    playBtn.querySelector('i.fas').classList.add('fa-pause');

    audio.play();

    // Commented out to prevent errors
    // if (audioContext.state === 'suspended') {
    //     audioContext.resume();
    // }
}


// Pause the song
function pauseSong() {
    musicContainer.classList.remove("play");
    playBtn.querySelector('i.fas').classList.add('fa-play');
    playBtn.querySelector('i.fas').classList.remove('fa-pause');

    audio.pause();
}

// Previous mix
function prevMix() {
    mixIndex--;
    if (mixIndex < 0) {
        mixIndex = mixes.length - 1;
    }
    loadMix(mixes[mixIndex]);
    playSong();
}

// Next mix
function nextMix() {
    mixIndex++;
    if (mixIndex > mixes.length - 1) {
        mixIndex = 0;
    }
    loadMix(mixes[mixIndex]);
    playSong();
}

// Update progress bar and time display
function updateProgress(e) {
    const { duration, currentTime } = e.target;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    // Update current time
    currentTimeEl.textContent = formatTime(currentTime);

    // Update duration
    if (duration) {
        durationEl.textContent = formatTime(duration);
    } else {
        durationEl.textContent = '0:00';
    }
}

// Helper function to format time
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    if (seconds < 10) {
        seconds = `0${seconds}`;
    }
    return `${minutes}:${seconds}`;
}
// Set progress bar
function setProgress(e) {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;

    audio.currentTime = (clickX / width) * duration;
}

// Event listeners
playBtn.addEventListener("click", () => {
    const isPlaying = musicContainer.classList.contains("play");

    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

prevBtn.addEventListener("click", prevMix);
nextBtn.addEventListener("click", nextMix);

audio.addEventListener("timeupdate", updateProgress);

progressContainer.addEventListener("click", setProgress);

audio.addEventListener("ended", nextMix);
