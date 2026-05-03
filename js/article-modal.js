// 文章模态窗口功能
(function() {
  'use strict';

  var modal = null;
  var modalTitle = null;
  var modalClose = null;
  var modalIframe = null;
  var observer = null;

  function initArticleModal() {
    var isSmallScreen = window.innerWidth <= 768;
    if (!window.theme || !window.theme.article_list || window.theme.article_list.view_mode !== 'modal' || isSmallScreen) {
      return;
    }

    if (modal) {
      addClickEventToLinks();
      return;
    }

    modal = document.createElement('div');
    modal.className = 'article-modal';
    modal.innerHTML =
      '<div class="article-modal-content">' +
        '<div class="article-modal-header">' +
          '<h2 class="article-modal-title"></h2>' +
          '<button class="article-modal-close" aria-label="关闭">' +
            '<i class="fas fa-times"></i>' +
          '</button>' +
        '</div>' +
        '<div class="article-modal-body">' +
          '<iframe class="article-modal-iframe" src="" title="文章内容"></iframe>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);

    modalTitle = modal.querySelector('.article-modal-title');
    modalClose = modal.querySelector('.article-modal-close');
    modalIframe = modal.querySelector('.article-modal-iframe');

    modalClose.addEventListener('click', closeModal);

    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });

    addClickEventToLinks();

    observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
          addClickEventToLinks();
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  function addClickEventToLinks() {
    document.querySelectorAll('.article-title a, .article-image a, .read-more').forEach(function(link) {
      if (link.hasAttribute('data-modal-event')) return;

      link.setAttribute('data-modal-event', 'true');
      link.addEventListener('click', function(e) {
        e.preventDefault();

        var articleUrl = this.getAttribute('href');
        var articleTitle = this.textContent.trim();

        modalTitle.textContent = articleTitle;
        modalIframe.src = articleUrl;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        var musicPlayer = document.querySelector('.music-player');
        if (musicPlayer) {
          musicPlayer.style.zIndex = '10000';
        }

        var style = document.createElement('style');
        style.id = 'modal-nav-style';
        style.innerHTML = '.article-modal-iframe::-webkit-scrollbar { display: none; }';
        document.head.appendChild(style);

        modalIframe.onload = function() {
          try {
            var iframeDoc = modalIframe.contentDocument || modalIframe.contentWindow.document;
            var iframeStyle = iframeDoc.createElement('style');
            iframeStyle.id = 'iframe-nav-style';
            iframeStyle.innerHTML = '.header { display: none !important; height: 0; margin: 0; padding: 0; } .post-wrapper { margin-top: -60px; } .music-player { display: none !important; }';
            iframeDoc.head.appendChild(iframeStyle);
          } catch (e) {
            console.error('无法访问iframe内容:', e);
          }
        };
      });
    });
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    modalIframe.src = '';
    document.body.style.overflow = '';

    var modalStyle = document.getElementById('modal-nav-style');
    if (modalStyle) {
      modalStyle.remove();
    }

    var musicPlayer = document.querySelector('.music-player');
    if (musicPlayer) {
      musicPlayer.style.zIndex = '';
    }
  }

  document.addEventListener('DOMContentLoaded', initArticleModal);
  document.addEventListener('pjax:contentLoaded', initArticleModal);

  window.initArticleModal = initArticleModal;
})();
