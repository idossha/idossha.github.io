function openProject(url) {
  window.location.href = url; // Redirects to the project details page
}

document.addEventListener('DOMContentLoaded', function() {
  const projects = document.querySelectorAll('.project');
  projects.forEach(project => {
      project.addEventListener('click', function() {
          // The redirection is already handled by the openProject function inline in the HTML
      });
  });
});
