// Navigation Active State Handler
// Updates navigation highlight on page change without PJAX dependency

document.addEventListener('DOMContentLoaded', function() {
  initNavActiveState();
});

function initNavActiveState() {
  updateActiveNav();
  bindNavClickHandlers();
}

function updateActiveNav() {
  var currentPath = window.location.pathname;
  var currentFull = window.location.href;
  var navItems = document.querySelectorAll('.nav-item');

  navItems.forEach(function(item) {
    var link = item.tagName === 'A' ? item : item.querySelector('a');
    if (!link) return;

    var href = link.getAttribute('href');
    if (!href) return;

    try {
      var itemUrl = new URL(href, window.location.origin);
      var currentUrl = new URL(currentFull);
      var itemPathname = itemUrl.pathname.replace(/\/$/, '') || '/';
      var currentPathname = currentUrl.pathname.replace(/\/$/, '') || '/';

      var isActive = false;
      if (itemPathname === currentPathname) {
        isActive = true;
      } else if (itemPathname !== '/' && currentPathname.startsWith(itemPathname + '/')) {
        isActive = true;
      }

      if (isActive) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    } catch (e) {
      var itemPath = href.replace(/\/$/, '');
      var current = currentPath.replace(/\/$/, '');
      if (itemPath === current || (itemPath !== '' && current.startsWith(itemPath + '/'))) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    }
  });
}

function bindNavClickHandlers() {
  var navLinks = document.querySelectorAll('.nav-menu a');

  navLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      var href = this.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) {
        return;
      }

      var navItems = document.querySelectorAll('.nav-item');
      navItems.forEach(function(item) {
        item.classList.remove('active');
      });

      var parentNavItem = this.closest('.nav-item');
      if (parentNavItem) {
        parentNavItem.classList.add('active');
      } else {
        this.classList.add('active');
      }
    });
  });
}
