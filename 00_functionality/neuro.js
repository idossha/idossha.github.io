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
    // Remove active sections
    contentSections.forEach((section) => section.classList.remove('active-section'));

    // Add active state to clicked nav
    navItem.classList.add('active-link');
    // Add active to corresponding section
    document.getElementById(targetId).classList.add('active-section');
  });
});
