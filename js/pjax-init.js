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
    // Check if Pjax library is loaded
    if (typeof Pjax === 'undefined') {
      console.warn('Pjax library not loaded');
      return;
    }

    // Check if Pjax is supported
    if (!Pjax.isSupported()) {
      console.warn('Pjax is not supported in this browser');
      return;
    }

    // Initialize Pjax
    // Only replace the main content area, keeping header/footer/player intact
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

    // Before Pjax request - save music player state
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

    // After Pjax completes - restore music player state and reinitialize components
    document.addEventListener('pjax:complete', function() {
      var mainContent = document.querySelector('#main-content');
      if (mainContent) {
        mainContent.style.opacity = '1';
      }

      // Restore music player state
      restoreMusicPlayerState();

      // Reinitialize page-specific components
      reinitializeComponents();

      // Update active nav item
      updateActiveNav();
    });

    // On Pjax error - fallback to normal navigation
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

  // Reinitialize components that need to be set up on each page
  function reinitializeComponents() {
    // Reinitialize scroll animations
    if (typeof initScrollAnimations === 'function') {
      initScrollAnimations();
    }

    // Reinitialize lazy loading
    if (typeof initLazyLoading === 'function') {
      initLazyLoading();
    }

    // Reinitialize article filter
    if (typeof initArticleFilter === 'function') {
      initArticleFilter();
    }

    // Reinitialize load more
    if (typeof initLoadMore === 'function') {
      initLoadMore();
    }

    // Reinitialize post share
    if (typeof initPostShare === 'function') {
      initPostShare();
    }

    // Reinitialize TOC
    if (typeof initToc === 'function') {
      initToc();
    }

    // Reinitialize image zoom
    if (typeof initImageZoom === 'function') {
      initImageZoom();
    }

    // Reinitialize code block folding
    if (typeof initCodeBlockFolding === 'function') {
      initCodeBlockFolding();
    }

    // Reinitialize article modal (exposed on window by article-modal.js)
    if (typeof window.initArticleModal === 'function') {
      window.initArticleModal();
    }

    // Reinitialize hide inline interactions
    if (typeof initHideInlineInteraction === 'function') {
      initHideInlineInteraction();
    }

    // Reinitialize hide toggle interactions
    if (typeof initHideToggleInteraction === 'function') {
      initHideToggleInteraction();
    }

    // Reinitialize tags
    if (typeof initTags === 'function') {
      initTags();
    }

    // Reinitialize categories accordion
    if (typeof initCategoriesAccordion === 'function') {
      initCategoriesAccordion();
    }

    // Reinitialize search
    if (typeof initSearch === 'function') {
      initSearch();
    }

    // Dispatch custom event for other scripts to hook into
    document.dispatchEvent(new CustomEvent('pjax:contentLoaded'));
  }

  // Update active navigation item based on current URL
  function updateActiveNav() {
    var currentPath = window.location.pathname;
    var navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(function(item) {
      var link = item.querySelector('a');
      if (!link) return;

      var href = link.getAttribute('href');
      if (!href) return;

      // Normalize paths for comparison
      var itemPath = href.replace(/\/$/, '');
      var current = currentPath.replace(/\/$/, '');

      if (itemPath === current || (current !== '' && itemPath !== '' && current.startsWith(itemPath))) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
})();
