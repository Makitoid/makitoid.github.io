// MathJax 按需加载：页面中确实存在公式定界符时才注入本地 MathJax。
// 之前无条件从 CDN 加载 1.2MB 的 MathJax（bootcdn 最慢时 9 秒+），拖慢所有页面的 load 事件。
(function () {
  var bodyText = "";
  try {
    bodyText = document.body.innerText || document.body.textContent || "";
  } catch (e) {
    return;
  }
  if (!bodyText) return;

  // 四种公式定界符：$$...$$、\(...\)、\[...\]、$...$（单 $ 要求同行且非空，避免把价格等误判为公式）
  var hasMath =
    /\$\$[\s\S]+?\$\$/.test(bodyText) ||
    /\\\([\s\S]+?\\\)/.test(bodyText) ||
    /\\\[[\s\S]+?\\\]/.test(bodyText) ||
    /\$[^\s$][^$\n]*?\$/.test(bodyText);
  if (!hasMath) return;

  window.MathJax = {
    tex: {
      inlineMath: [
        ["$", "$"],
        ["\\(", "\\)"],
      ], // 行内公式格式
      displayMath: [
        ["$$", "$$"],
        ["\\[", "\\]"],
      ], // 块级公式格式
      processEscapes: true,
    },
    options: {
      skipHtmlTags: ["script", "noscript", "style", "textarea", "pre", "code"], // 忽略这些标签内的公式
    },
    startup: {
      pageReady: () => {
        return MathJax.startup.defaultPageReady().then(() => {
          console.log("MathJax initialised");
        });
      },
    },
  };

  let script = document.createElement("script");
  script.src = "/js/mathjax/tex-mml-chtml.js";
  script.async = true;
  script.id = "MathJax-script";
  document.head.appendChild(script);
})();
