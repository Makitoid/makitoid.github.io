document.addEventListener("DOMContentLoaded", function () {
  if (typeof Pjax === "undefined") return;

  const pjax = new Pjax({
    elements:
      "a:not([target='_blank']):not([href^='#']):not([data-pjax-state=''])",
    selectors: [
      "title",
      "main.main",
      ".nav-menu",
    ],
    cacheBust: false,
    timeout: 5000,
  });

  document.addEventListener("pjax:send", function () {
    const main = document.querySelector("main.main");
    if (main) {
      main.style.transition = "opacity 0.3s ease";
      main.style.opacity = "0.4";
    }
  });

  document.addEventListener("pjax:complete", function () {
    const main = document.querySelector("main.main");
    if (main) main.style.opacity = "1";

    window.dispatchEvent(new Event("DOMContentLoaded"));
    window.dispatchEvent(new Event("load"));

    if (typeof MathJax !== "undefined" && MathJax.typesetPromise) {
      MathJax.typesetPromise();
    }

    if (typeof twikoo !== "undefined") {
      try {
        twikoo.init({
          envId: window.theme.comments.twikoo.envId,
          el: "#twikoo",
        });
      } catch (e) {}
    }
  });
});
