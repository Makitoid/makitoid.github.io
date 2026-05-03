// Pjax Initialization - Seamless page transitions
// Keeps the music player playing across page navigations

(function() {
  'use strict';

  var musicPlayerState = {
    wasPlaying: false,
    currentTime: 0
  };

  document.addEventListener('DOMContentLoaded', function() {
    initPjax();
  });

  function initPjax() {
    if (typeof Pjax === 'undefined') {
      console.warn('[PJAX] Pjax library not loaded');
      return;
    }

    if (!Pjax.isSupported()) {
      console.warn('[PJAX] Pjax is not supported in this browser');
      return;
    }

    var pjax = new Pjax({
      selectors: [
        'title',
        'meta[name="description"]',
        '#main-content'
      ],
      switches: {
        'title': function(oldEl, newEl) {
          document.title = newEl.innerHTML;
        }
      },
      cacheBust: false,
      timeout: 10000
    });

    document.addEventListener('pjax:send', function() {
      var audio = document.querySelector('.music-player-audio');
      if (audio) {
        musicPlayerState.wasPlaying = !audio.paused;
        musicPlayerState.currentTime = audio.currentTime;
      }

      var mainContent = document.querySelector('#main-content');
      if (mainContent) {
        mainContent.style.opacity = '0.6';
        mainContent.style.transition = 'opacity 0.2s ease';
      }
    });

    document.addEventListener('pjax:complete', function() {
      var mainContent = document.querySelector('#main-content');
      if (mainContent) {
        mainContent.style.opacity = '1';
      }

      restoreMusicPlayerState();
      reinitializeComponents();
      updateActiveNav();
    });

    document.addEventListener('pjax:error', function(e) {
      console.warn('Pjax error, falling back to normal navigation:', e);
      window.location.href = e.triggerElement.href;
    });
  }

  function restoreMusicPlayerState() {
    var audio = document.querySelector('.music-player-audio');
    if (!audio) return;

    if (musicPlayerState.currentTime > 0) {
      audio.currentTime = musicPlayerState.currentTime;
    }

    if (musicPlayerState.wasPlaying) {
      audio.play().catch(function() {});
    }
  }

  function reinitializeComponents() {
    var initFns = [
      'initScrollAnimations',
      'initLazyLoading',
      'initArticleFilter',
      'initLoadMore',
      'initPostShare',
      'initToc',
      'initImageZoom',
      'initCodeBlockFolding',
      'initHideInlineInteraction',
      'initHideToggleInteraction',
      'initTags',
      'initSearch',
      'initCategoriesAccordion'
    ];

    initFns.forEach(function(name) {
      if (typeof window[name] === 'function') {
        window[name]();
      }
    });

    if (typeof window.initArticleModal === 'function') {
      window.initArticleModal();
    }

    document.dispatchEvent(new CustomEvent('pjax:contentLoaded'));
  }

  function updateActiveNav() {
    var currentPath = window.location.pathname;
    var currentFull = window.location.href;

    document.querySelectorAll('.nav-item').forEach(function(item) {
      var link = item.tagName === 'A' ? item : item.querySelector('a');
      if (!link) return;

      var href = link.getAttribute('href');
      if (!href) return;

      var isActive = false;

      try {
        var itemUrl = new URL(href, window.location.origin);
        var currentUrl = new URL(currentFull);
        var itemPathname = itemUrl.pathname.replace(/\/$/, '') || '/';
        var currentPathname = currentUrl.pathname.replace(/\/$/, '') || '/';

        if (itemPathname === currentPathname) {
          isActive = true;
        } else if (itemPathname !== '/' && currentPathname.startsWith(itemPathname + '/')) {
          isActive = true;
        }
      } catch (e) {
        var itemPath = href.replace(/\/$/, '');
        var current = currentPath.replace(/\/$/, '');
        if (itemPath === current || (itemPath !== '' && current.startsWith(itemPath + '/'))) {
          isActive = true;
        }
      }

      item.classList.toggle('active', isActive);
    });
  }
})();
