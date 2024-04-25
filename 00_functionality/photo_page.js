var currentImageIndex = 0;
var images = document.getElementsByClassName('gallery-item');

// Function to open the modal
function openModal(img) {
    // Get the modal
    var modal = document.getElementById("myModal");
    var modalImg = document.getElementById("img01");
    var captionText = document.getElementById("caption");

    // Find the index of the image that was clicked
    currentImageIndex = Array.from(images).indexOf(img);

    modal.style.display = "block";
    modalImg.src = img.src;
    captionText.innerHTML = img.alt;

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
        modal.style.display = "none";
    }

    // Add keyboard event listener for arrow keys
    document.addEventListener('keydown', navigateImages);
}

function navigateImages(event) {
    if (event.key === "ArrowRight") {
        changeImage(1); // Next image
    } else if (event.key === "ArrowLeft") {
        changeImage(-1); // Previous image
    }
}

function changeImage(step) {
    currentImageIndex += step;
    
    // Loop back to the first image if the index is out of bounds
    if (currentImageIndex >= images.length) {
        currentImageIndex = 0;
    } else if (currentImageIndex < 0) {
        currentImageIndex = images.length - 1;
    }
    
    var img = images[currentImageIndex];
    var modalImg = document.getElementById("img01");
    var captionText = document.getElementById("caption");
    
    modalImg.src = img.src;
    captionText.innerHTML = img.alt;
}

// Function to remove the event listener when modal is closed
function closeModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
    document.removeEventListener('keydown', navigateImages);
}

// Change how the close functionality is bound to the span
document.getElementsByClassName("close")[0].onclick = closeModal;
