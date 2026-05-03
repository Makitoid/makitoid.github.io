// Pjax Initialization - Seamless page transitions
// Keeps the music player playing across page navigations

(function() {
  'use strict';

  var musicPlayerState = {
    wasPlaying: false,
    currentTime: 0
  };

  document.addEventListener('DOMContentLoaded', function() {
    console.log('[PJAX] DOMContentLoaded fired');
    initPjax();
  });

  function initPjax() {
    console.log('[PJAX] initPjax called, typeof Pjax:', typeof Pjax);

    // Check if Pjax library is loaded
    if (typeof Pjax === 'undefined') {
      console.warn('[PJAX] Pjax library not loaded');
      return;
    }

    // Check if Pjax is supported
    if (!Pjax.isSupported()) {
      console.warn('[PJAX] Pjax is not supported in this browser');
      return;
    }

    console.log('[PJAX] Initializing PJAX');
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
      console.log('[PJAX] pjax:send fired');
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
      console.log('[PJAX] pjax:complete fired');
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

    // Reinitialize categories accordion
    if (typeof initCategoriesAccordion === 'function') {
      initCategoriesAccordion();
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

    // Initialize categories accordion
    function initCategoriesAccordion() {
      console.log('[PJAX] Initializing categories accordion');
      
      // 检查是否为展开式布局
      const isAccordionLayout = document.querySelector('.categories-accordion');
      if (!isAccordionLayout) return;

      // 获取主题配置
      const accordionAnimation = window.theme && window.theme.categories && window.theme.categories.accordion_animation !== false;

      // 获取所有分类头部
      const categoryHeaders = document.querySelectorAll('.category-header');

      // 为每个分类头部添加点击事件
      categoryHeaders.forEach(header => {
        // 移除旧的事件监听器（如果存在）
        header.removeEventListener('click', handleCategoryClick);
        
        // 添加新的事件监听器
        header.addEventListener('click', handleCategoryClick, false);
      });

      // 处理分类点击的函数
      function handleCategoryClick(e) {
        // 阻止默认行为，防止链接跳转
        e.preventDefault();
        
        // 获取父级分类区块
        const categorySection = this.closest('.category-section');
        const isActive = categorySection.classList.contains('active');

        // 获取文章列表区域
        const categoryPosts = categorySection.querySelector('.category-posts');
        const noPosts = categorySection.querySelector('.no-posts');

        // 如果当前分类已经是展开状态，则折叠它
        if (isActive) {
          categorySection.classList.remove('active');

          if (categoryPosts) {
            categoryPosts.style.display = 'none';
          }

          if (noPosts) {
            noPosts.style.display = 'none';
          }
        } else {
          // 如果当前分类是折叠状态，则展开它并折叠其他分类

          // 先折叠所有其他分类
          document.querySelectorAll('.category-section').forEach(section => {
            if (section !== categorySection) { // 不处理当前点击的分类
              section.classList.remove('active');

              const posts = section.querySelector('.category-posts');
              const empty = section.querySelector('.no-posts');

              if (posts) {
                posts.style.display = 'none';
              }

              if (empty) {
                empty.style.display = 'none';
              }
            }
          });

          // 展开当前分类
          categorySection.classList.add('active');

          if (categoryPosts) {
            categoryPosts.style.display = 'block';
            if (accordionAnimation) {
              // 添加淡入效果
              categoryPosts.style.opacity = '0';
              setTimeout(() => {
                categoryPosts.style.opacity = '1';
              }, 10);
            }
          }

          if (noPosts) {
            noPosts.style.display = 'block';
            if (accordionAnimation) {
              // 添加淡入效果
              noPosts.style.opacity = '0';
              setTimeout(() => {
                noPosts.style.opacity = '1';
              }, 10);
            }
          }

          // 添加平滑滚动效果
          setTimeout(() => {
            categorySection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 100);
        }

        // 阻止事件冒泡
        e.stopPropagation();
        return false;
      }
    }

    // 初始化categories accordion
    initCategoriesAccordion();

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
    var currentFull = window.location.href;
    console.log('[PJAX] updateActiveNav called, currentPath:', currentPath);

    var navItems = document.querySelectorAll('.nav-item');
    console.log('[PJAX] Found nav items:', navItems.length);

    navItems.forEach(function(item) {
      var link = item.tagName === 'A' ? item : item.querySelector('a');
      if (!link) return;

      var href = link.getAttribute('href');
      if (!href) return;

      console.log('[PJAX] Checking nav item:', href);

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

        console.log('[PJAX] itemPathname:', itemPathname, 'currentPathname:', currentPathname, 'isActive:', isActive);

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
})();
