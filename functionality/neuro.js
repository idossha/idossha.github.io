
document.addEventListener('DOMContentLoaded', function() {
  // ================================
  // 1. Navigation Logic
  // ================================
  
  // Grab all nav links and content sections
  const navItems = document.querySelectorAll('.nav-links li');
  const contentSections = document.querySelectorAll('.content-section');

  // Add click event to each nav link
  navItems.forEach((navItem) => {
    navItem.addEventListener('click', () => {
      // Get the target section id
      const targetId = navItem.getAttribute('data-target');

      // Remove active states from all nav items
      navItems.forEach((item) => item.classList.remove('active-link'));
      // Remove active state from all sections
      contentSections.forEach((section) => section.classList.remove('active-section'));

      // Add active state to clicked nav
      navItem.classList.add('active-link');
      // Add active to corresponding section
      document.getElementById(targetId).classList.add('active-section');
    });
  });


  // ================================
  // 2. Carousel (Media Gallery) Logic for Multiple Carousels
  // ================================
  
  // Grab all carousel elements
  const carousels = document.querySelectorAll('.media-gallery');

  // Iterate through each carousel and initialize its functionality
  carousels.forEach((carousel) => {
    const arrowLeft = carousel.querySelector('.arrow-left');
    const arrowRight = carousel.querySelector('.arrow-right');
    const mediaItems = carousel.querySelectorAll('.media-item');
    let currentIndex = 0; // index of the currently displayed media item

    // Helper function: Hide all items except the one matching currentIndex
    function showItem(index) {
      mediaItems.forEach((item, i) => {
        item.classList.toggle('active', i === index);
      });
    }

    // Initialize the first media item
    showItem(currentIndex);

    // Event listener for the left arrow
    if (arrowLeft) {
      arrowLeft.addEventListener('click', () => {
        currentIndex = (currentIndex === 0) ? mediaItems.length - 1 : currentIndex - 1;
        showItem(currentIndex);
      });
    }

    // Event listener for the right arrow
    if (arrowRight) {
      arrowRight.addEventListener('click', () => {
        currentIndex = (currentIndex === mediaItems.length - 1) ? 0 : currentIndex + 1;
        showItem(currentIndex);
      });
    }
  });
});

