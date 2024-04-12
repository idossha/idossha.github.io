function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}


const main_video = document.querySelector('.main-video video');
const main_video_title = document.querySelector('.main-video .title');
const video_playlist = document.querySelector('.video-playlist .videos');


let data = [
    {  
        'id': 'a1',
        'title': 'JiggyJamz Live - 06-22-2023 - Ido x jiggy',
        'name': 'JiggyJamz Live - 06-22-2023 - Ido x jiggy.mp4',
        'duration': '2hours',
    },
    {  
        'id': 'a2',
        'title': 'Vinyl Set - January 7th, 2023',
        'name': 'Vinyl Set - January 7th, 2023.mp4',
        'duration': '50 minutes'
    },
    {  
        'id': 'a3',
        'title': 'Video 3',
        'name': 'Video 3.mp4',
        'duration': '1 minute'
    },
    {  
        'id': 'a4',
        'title': 'Video 4',
        'name': 'Video 4.mp4',
        'duration': '1 minute'
    },
];


data.forEach((video, i) => {
    let videoDiv = document.createElement('div');
    videoDiv.className = 'video';
    videoDiv.dataset.id = video.id;

    let img = document.createElement('img');
    img.src = '../05_assets_music_vids/play.jpg';
    img.alt = '';

    let p = document.createElement('p');
    p.textContent = `0${i + 1}. `;

    let h3 = document.createElement('h3');
    h3.className = 'title';
    h3.textContent = video.title;

    let pTime = document.createElement('p');
    pTime.className = 'time';
    pTime.textContent = video.duration;

    videoDiv.appendChild(img);
    videoDiv.appendChild(p);
    videoDiv.appendChild(h3);
    videoDiv.appendChild(pTime);

    video_playlist.appendChild(videoDiv);
});

let videos = document.querySelectorAll('.video');
if (videos.length > 0) {
    videos[0].classList.add('active');
    videos[0].querySelector('img').src = '../05_assets_music_vids/pause.jpg';

    videos.forEach(selected_video => {
        selected_video.onclick = (event) => {
            for (let all_videos of videos) {
                all_videos.classList.remove('active');
                all_videos.querySelector('img').src = '../05_assets_music_vids/play.jpg';
            }
            const currentSelected = event.currentTarget;
            currentSelected.classList.add('active');
            currentSelected.querySelector('img').src = '../05_assets_music_vids/pause.jpg';

            let match_video = data.find(video => video.id == currentSelected.dataset.id);
            main_video.src = '../05_assets_music_vids/' + match_video.name;
            main_video_title.innerHTML = match_video.title;
        }
    });
}


