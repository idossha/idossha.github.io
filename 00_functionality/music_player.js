function toggleMenu() {
    console.log("Menu toggled"); // This will print in the console each time the menu is toggled
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

const musicContainer = document.querySelector('.music-container');
const progress = document.querySelector(".progress");
const progressContainer = document.querySelector(".progress-container");
const playBtn = document.querySelector("#play");
const prevBtn = document.querySelector("#prev");
const nextBtn = document.querySelector("#next");
const audio = document.querySelector("#audio");
const title = document.querySelector("#title");
const cover = document.querySelector("#cover");

// song titles

const songs = ['IdoHaber x GeoffK 2023-06-22' , 'Bedroom Session - Hypnagogia']

// keep track of songs

let songIndex = 0

// Initially load the songs

loadSong(songs[songIndex]) 

// update song details
function loadSong(song) {
    title.innerText = song;
    audio.src = `../04_assets_music_audio/${song}.mp3`; // Updated path
    cover.src = `../04_assets_music_audio/${song}.jpg`; // Updated path
}

function playSong() {
musicContainer.classList.add("play");
playBtn.querySelector('i.fas').classList.remove('fa-play')
playBtn.querySelector('i.fas').classList.add('fa-pause')

audio.play()
}

function pauseSong() {
    musicContainer.classList.remove("play");
    playBtn.querySelector('i.fas').classList.add('fa-play')
    playBtn.querySelector('i.fas').classList.remove('fa-pause')

    audio.pause()
}

function prevSong() {
    songIndex--
    if(songIndex < 0) {
        songIndex = songs.length - 1
    }
    loadSong(songs[songIndex])
    playSong()
}
function nextSong() {
    songIndex++
    if(songIndex  > songs.length - 1) {
        songIndex = 0
    }
    loadSong(songs[songIndex])
    playSong()
}

function updateProgress (e) {
    const {duration, currentTime} = e.srcElement
    const progressPercent = (currentTime / duration) * 100
    progress.style.width = `${progressPercent}%`
}


function setProgress(e) {
    const width = progressContainer.clientWidth; // use the actual element here instead of 'this'
    const clickX = e.offsetX; // Get the horizontal click position within the element
    const duration = audio.duration;

    audio.currentTime = (clickX / width) * duration; // Update the current playing time
}
// Event listeners

playBtn.addEventListener("click", () => {
    const isPlaying = musicContainer.classList.contains("play");

    if(isPlaying) {
        pauseSong()
    } else {
        playSong()
    }
})

prevBtn.addEventListener("click", prevSong)
nextBtn.addEventListener("click", nextSong)

audio.addEventListener("timeupdate", updateProgress)

progressContainer.addEventListener("click", setProgress)

audio.addEventListener("ended", nextSong)

