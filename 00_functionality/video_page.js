function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

// Function to open the modal with a video URL
function openModal(videoSrc) {
    var modal = document.getElementById("videoModal");
    var modalVideo = document.getElementById("modalVideo");
    modal.style.display = "block";
    modalVideo.src = videoSrc;
    modalVideo.load(); // Ensure the video loads
}

// Function to close the modal
function closeModal() {
    var modal = document.getElementById("videoModal");
    var modalVideo = document.getElementById("modalVideo");
    modal.style.display = "none";
    modalVideo.src = ''; // Stop the video
    modalVideo.pause(); // Optional: Explicitly pause the video
}

// Add click event listeners to each video item in the grid
document.querySelectorAll('.video-item').forEach(item => {
    item.addEventListener('click', () => {
        // Get the video source from the item's data attribute or similar
        const videoSrc = item.getAttribute('data-video-src');
        openModal(videoSrc);
    });
});

// Close functionality for the modal
document.querySelector('.modal .close').addEventListener('click', closeModal);
