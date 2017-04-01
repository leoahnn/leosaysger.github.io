var projectIcon = document.getElementById('project-icon');
var projectWindow = document.getElementById('project-window');
var close = document.getElementById('close');

projectIcon.addEventListener('click', function(event) {
  if (projectWindow.classList.contains('hidden')) {
    projectWindow.classList.remove('hidden');
  } else {
    projectWindow.classList.add('hidden')
  }
});

close.addEventListener('click', function(event) {
  projectWindow.classList.add('hidden')
});
