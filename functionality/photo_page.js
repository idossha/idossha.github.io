var currentImageIndex = 0;
var images = Array.from(document.getElementsByClassName('gallery-item'));

var placeholderSrc = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

var photoDims = null;

function loadPhotoDims() {
    // Optional: used to reserve correct aspect ratio before loading.
    var url = new URL("../functionality/photo_dims.json", document.baseURI);
    return fetch(url)
        .then(function(res) {
            if (!res.ok) {
                return null;
            }
            return res.json();
        })
        .then(function(json) {
            photoDims = json || null;
        })
        .catch(function() {
            photoDims = null;
        });
}

function applyReservedSize(img, src) {
    if (!img || !src || !photoDims || !photoDims[src]) {
        return;
    }
    var pair = photoDims[src];
    if (!Array.isArray(pair) || pair.length < 2) {
        return;
    }
    var w = Number(pair[0]);
    var h = Number(pair[1]);
    if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) {
        return;
    }

    img.width = w;
    img.height = h;
    img.style.aspectRatio = w + " / " + h;
}

function setupPreloadAll() {
    // Convert all <img> to placeholder + data-src, then we'll load everything at once.
    images.forEach(function(img) {
        var originalSrc = img.dataset.src || img.getAttribute("src") || img.src;
        applyReservedSize(img, originalSrc);

        if (!img.dataset.src) {
            img.dataset.src = originalSrc;
            img.src = placeholderSrc;
        }

        img.classList.add("lazy");
        img.loading = "eager";
        img.decoding = "async";
    });
}

function loadImage(img) {
    if (!img || img.dataset.loaded) {
        return Promise.resolve();
    }

    var source = img.dataset.src;
    if (!source) {
        return Promise.resolve();
    }

    return new Promise(function(resolve) {
        img.classList.add("loading");
        img.src = source;

        var done = function() {
            img.classList.remove("lazy", "loading");
            img.classList.add("loaded");
            img.dataset.loaded = "true";
            resolve();
        };

        img.onload = function() {
            // Wait for decode to reduce flicker and keep scroll smooth.
            if (img.decode) {
                img.decode().then(done).catch(done);
            } else {
                done();
            }
        };

        img.onerror = function() {
            img.classList.remove("loading");
            img.classList.add("error");
            resolve();
        };
    });
}

function initPageLoader() {
    var body = document.body;
    var loader = document.querySelector(".page-loader");
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var fadeDelay = reduceMotion ? 0 : 150;

    body.classList.add("photo-ready");
    if (loader) {
        window.setTimeout(function() {
            loader.classList.add("page-loader--hide");
            window.setTimeout(function() {
                loader.remove();
            }, 900);
        }, fadeDelay);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    loadPhotoDims().finally(function() {
        setupPreloadAll();

        // Load *all* images while the "Loading photo gallery..." overlay is visible.
        Promise.allSettled(images.map(loadImage)).then(function() {
            initPageLoader();
        });
    });
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
