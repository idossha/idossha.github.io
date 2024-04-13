document.addEventListener('DOMContentLoaded', function() {
    // Example function to switch between image and video
    function loadMedia(type, source) {
        const image = document.getElementById('mediaImage');
        const video = document.getElementById('mediaVideo');

        if (type === 'image') {
            image.src = source;
            image.style.display = 'block';
            video.style.display = 'none';
        } else if (type === 'video') {
            video.querySelector('source').src = source;
            video.load(); // Necessary to update the video source
            video.style.display = 'block';
            image.style.display = 'none';
        }
    }

    // Example usage
    loadMedia('video', 'sample.mp4'); // Load a video by default
});
