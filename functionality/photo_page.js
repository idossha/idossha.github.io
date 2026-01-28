var currentImageIndex = 0;
var images = Array.from(document.getElementsByClassName('gallery-item'));

var placeholderSrc = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

function setupLazyLoading() {
    images.forEach(function(img) {
        if (!img.dataset.src) {
            img.dataset.src = img.src;
            img.src = placeholderSrc;
        }
        img.classList.add("lazy");
        img.loading = "lazy";
        img.decoding = "async";
    });

    if (!("IntersectionObserver" in window)) {
        images.forEach(loadImage);
        return;
    }

    var observer = new IntersectionObserver(function(entries, obs) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                loadImage(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { rootMargin: "200px 0px", threshold: 0.01 });

    images.forEach(function(img) {
        observer.observe(img);
    });
}

function loadImage(img) {
    if (!img || img.dataset.loaded) {
        return;
    }

    var source = img.dataset.src;
    if (!source) {
        return;
    }

    img.classList.add("loading");
    img.src = source;
    img.onload = function() {
        img.classList.remove("lazy", "loading");
        img.classList.add("loaded");
        img.dataset.loaded = "true";
    };
    img.onerror = function() {
        img.classList.remove("loading");
        img.classList.add("error");
    };
}

function initPageLoader() {
    var body = document.body;
    var loader = document.querySelector(".page-loader");
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var delay = reduceMotion ? 0 : 1800;

    window.setTimeout(function() {
        body.classList.add("photo-ready");
        if (loader) {
            loader.classList.add("page-loader--hide");
            window.setTimeout(function() {
                loader.remove();
            }, 900);
        }
    }, delay);
}

document.addEventListener("DOMContentLoaded", function() {
    setupLazyLoading();
    initPageLoader();
});

// Function to open the modal
function openModal(img) {
    // Get the modal
    var modal = document.getElementById("myModal");
    var modalImg = document.getElementById("img01");
    var captionText = document.getElementById("caption");

    // Find the index of the image that was clicked
    currentImageIndex = Array.from(images).indexOf(img);

    modal.style.display = "block";
    var fullSrc = img.dataset.src || img.src;
    modalImg.src = fullSrc;
    captionText.innerHTML = img.alt;

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
    
    var fullSrc = img.dataset.src || img.src;
    modalImg.src = fullSrc;
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
