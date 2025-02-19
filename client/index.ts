class CodeBlock extends HTMLElement {
  constructor() {
    super();

    // Create a pre element
    const pre = document.createElement('pre');
    const code = document.createElement('code');

    // Copy content inside <code-block> to <code>
    code.textContent = this.innerHTML;
    pre.appendChild(code);

    // Optional styling
    const style = document.createElement('style');
    style.textContent = `
      pre {
        background: #2d2d2d;
        color: #f8f8f2;
        padding: 10px;
        border-radius: 5px;
        overflow-x: auto;
      }
    `;

    // Attach elements
    this.append(style, pre);
  }
}

customElements.define('code-block', CodeBlock);
