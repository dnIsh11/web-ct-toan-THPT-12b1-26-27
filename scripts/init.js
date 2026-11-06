window.MathJax = {
    tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']]
    }
};
const mathJaxScript = document.createElement('script');
mathJaxScript.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
mathJaxScript.id = 'MathJax-script';
mathJaxScript.async = true;
document.head.appendChild(mathJaxScript);