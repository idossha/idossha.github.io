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
        description: 'B2B by IdoHaber and GeoffK. Good House..',
        tracks: [
            'Track 1: coming soon...',
            'Track 2: coming soon...',
            'Track 3: coming soon...',
            // Add more tracks as needed
        ]
    },
    {
        title: 'Bedroom Session 001 - Hypnagogia',
        audioSrc: '../03_assets_music_audio/Bedroom Session - Hypnagogia.mp3',
        coverSrc: '../03_assets_music_audio/Bedroom Session - Hypnagogia.jpg',
        description: 'Recorded on December 9, 2021. Downtempo, psychedelic.',
        tracks: [
            'Track 1: coming soon...',
            'Track 2: coming soon...',
            'Track 3: coming soon...',
            // Add more tracks as needed
        ]
    },
    {
        title: 'Bedroom Session 002 - Yoshev (AKA Influences)',
        audioSrc: '../03_assets_music_audio/Bedroom Session 002 - Yoshev.mp3',
        coverSrc: '../03_assets_music_audio/yoshev.png',
        description: 'Jazz to Techno and in-between. Some past influences.',
        tracks: [
            'Track 1: coming soon...',
            'Track 2: coming soon...',
            'Track 3: coming soon...',
            // Add more tracks as needed
        ]
    },
    {
        title: 'Bedroom Session 003 - NoName (AKA Jazz Elements)',
        audioSrc: '../03_assets_music_audio/Bedroom Session 003 - Jazz Elements.mp3',
        coverSrc: '../03_assets_music_audio/jazz.png',
        description: 'Recorded on March 1, 2022. Some shit, some Jazz.',
        tracks: [
            'Track 1: coming soon...',
            'Track 2: coming soon...',
            'Track 3: coming soon...',
            // Add more tracks as needed
        ]
    },    

    {
        title: 'Bedroom Session 004 - BamBa (AKA PHMT)',
        audioSrc: '../03_assets_music_audio/Bedroom Session 004 - BamBa.mp3',
        coverSrc: '../03_assets_music_audio/PHMT.png',
        description: ' Recorded on March 8, 2022. More of a tranditional clubby mix.',
        tracks: [
            'Track 1: coming soon...',
            'Track 2: coming soon...',
            'Track 3: coming soon...',
            // Add more tracks as needed
        ]
    },
    {
        title: 'Bedroom Session 005 - Dub Jazz Techno',
        audioSrc: '../03_assets_music_audio/Bedroom Session 005 - Dub Jazz Techno.mp3',
        coverSrc: '../03_assets_music_audio/dubjazz.jpg',
        description: 'Recorded on July 18, 2022. Hybrid mix on technics and DDJ400.',
        tracks: [
            'Track 1: coming soon...',
            'Track 2: coming soon...',
            'Track 3: coming soon...',
            // Add more tracks as needed
        ]
    },
    {
        title: 'Bedroom Session 006 - w.t.fM.i.A',
        audioSrc: '../03_assets_music_audio/Bedroom Session 006 - w.t.fM.i.A.mp3',
        coverSrc: '../03_assets_music_audio/wtfmia.png',
        description: ' Recorded on September 6, 2022. Minimal House with surprises. Digital.',
        tracks: [
            'Track 1: coming soon...',
            'Track 2: coming soon...',
            'Track 3: coming soon...',
            // Add more tracks as needed
        ]
    },
    {
        title: 'Bedroom Session 007 - AugustAux',
        audioSrc: '../03_assets_music_audio/Bedroom Session 007 - AugustAux.mp3',
        coverSrc: '../03_assets_music_audio/augustaux.jpg',
        description: 'Recorded on Feb 19, 2023 for August Shop radio.',
        tracks: [
            'Track 1: coming soon...',
            'Track 2: coming soon...',
            'Track 3: coming soon...',
            // Add more tracks as needed
        ]
    },
    {
        title: 'Bedroom Session 008 -Adom',
        audioSrc: '../03_assets_music_audio/Bedroom Session 008 - Adom.mp3',
        coverSrc: '../03_assets_music_audio/adom.png',
        description: 'Recorded on April 25, 2023. Vinyl mix of minimal house',
        tracks: [
            'Track 1: coming soon...',
            'Track 2: coming soon...',
            'Track 3: coming soon...',
            // Add more tracks as needed
        ]
    },
    {
        title: 'Bedroom Session 009 - 400',
        audioSrc: '../03_assets_music_audio/Bedroom Session 009 - 400.mp3',
        coverSrc: '../03_assets_music_audio/400.png',
        description: 'XXXXXXX XXXXXXXX',
        tracks: [
            'Track 1: coming soon...',
            'Track 2: coming soon...',
            'Track 3: coming soon...',
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
    descriptionEl.innerText = mix.description;
    updateTrackList(mix.tracks);
}

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
}

function pauseSong() {
    musicContainer.classList.remove("play");
    playBtn.querySelector('i.fas').classList.add('fa-play');
    playBtn.querySelector('i.fas').classList.remove('fa-pause');

    audio.pause();
}

function prevMix() {
    mixIndex--;
    if (mixIndex < 0) {
        mixIndex = mixes.length - 1;
    }
    loadMix(mixes[mixIndex]);
    playSong();
}

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

// Set progress bar on click (you can keep this if you want to allow click-to-seek)
function setProgress(e) {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;

    audio.currentTime = (clickX / width) * duration;
}

// Variables to track dragging
let isDragging = false;

// Functions to handle dragging
function startDrag(e) {
    isDragging = true;
    updateProgressOnDrag(e);
}

function stopDrag() {
    isDragging = false;
}

function updateProgressOnDrag(e) {
    if (isDragging) {
        const width = progressContainer.clientWidth;
        const rect = progressContainer.getBoundingClientRect();
        let offsetX;

        if (e.type.startsWith('touch')) {
            offsetX = e.touches[0].clientX - rect.left;
        } else {
            offsetX = e.clientX - rect.left;
        }

        if (offsetX < 0) offsetX = 0;
        if (offsetX > width) offsetX = width;

        const duration = audio.duration;

        audio.currentTime = (offsetX / width) * duration;

        // Update progress bar width
        const progressPercent = (audio.currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;

        // Update current time display
        currentTimeEl.textContent = formatTime(audio.currentTime);
    }
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

// Remove existing progressContainer click listener if desired
// progressContainer.addEventListener("click", setProgress);

// Event listeners for dragging
progressContainer.addEventListener('mousedown', startDrag);
progressContainer.addEventListener('touchstart', startDrag);

document.addEventListener('mouseup', stopDrag);
document.addEventListener('touchend', stopDrag);

document.addEventListener('mousemove', updateProgressOnDrag);
document.addEventListener('touchmove', updateProgressOnDrag, { passive: false });

// Optionally keep the click event to allow clicking on the progress bar
progressContainer.addEventListener("click", setProgress);

audio.addEventListener("ended", nextMix);