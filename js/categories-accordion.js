// 分类页面展开/折叠功能
document.addEventListener('DOMContentLoaded', function() {
  initCategoriesAccordion();
});

function initCategoriesAccordion() {
  const isAccordionLayout = document.querySelector('.categories-accordion');
  if (!isAccordionLayout) return;

  const accordionAnimation = window.theme && window.theme.categories && window.theme.categories.accordion_animation !== false;

  function setVisible(el, visible) {
    if (!el) return;
    el.style.display = visible ? 'block' : 'none';
    if (visible && accordionAnimation) {
      el.style.opacity = '0';
      requestAnimationFrame(function() {
        el.style.opacity = '1';
      });
    }
  }

  function collapseAll(exceptSection) {
    document.querySelectorAll('.category-section').forEach(function(section) {
      if (section === exceptSection) return;
      section.classList.remove('active');
      setVisible(section.querySelector('.category-posts'), false);
      setVisible(section.querySelector('.no-posts'), false);
    });
  }

  function handleCategoryClick(e) {
    e.preventDefault();
    e.stopPropagation();

    const section = this.closest('.category-section');
    const isActive = section.classList.contains('active');

    if (isActive) {
      section.classList.remove('active');
      setVisible(section.querySelector('.category-posts'), false);
      setVisible(section.querySelector('.no-posts'), false);
    } else {
      collapseAll(section);
      section.classList.add('active');
      setVisible(section.querySelector('.category-posts'), true);
      setVisible(section.querySelector('.no-posts'), true);

      setTimeout(function() {
        section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }

  document.querySelectorAll('.category-header').forEach(function(header) {
    header.addEventListener('click', handleCategoryClick);
  });

  // 如果URL中包含分类参数，自动展开对应分类
  const categoryParam = new URLSearchParams(window.location.search).get('category');
  if (categoryParam) {
    const target = document.querySelector('.category-section[data-category="' + categoryParam + '"]');
    if (target) {
      setTimeout(function() {
        handleCategoryClick.call(target.querySelector('.category-header'), {
          preventDefault: function() {},
          stopPropagation: function() {}
        });
      }, 500);
    }
  }
}

window.initCategoriesAccordion = initCategoriesAccordion;
