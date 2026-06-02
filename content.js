window.addEventListener('load', () => {
  const asciiLines = [
    '██╗    ██╗███████╗██╗      ██████╗ ██████╗ ███╗   ███╗███████╗    ██████╗ ███████╗██╗   ██╗',
    '██║    ██║██╔════╝██║     ██╔════╝██╔═══██╗████╗ ████║██╔════╝    ██╔══██╗██╔════╝╚██╗ ██╔╝',
    '██║ █╗ ██║█████╗  ██║     ██║     ██║   ██║██╔████╔██║█████╗      ██████╔╝█████╗   ╚████╔╝ ',
    '██║███╗██║██╔══╝  ██║     ██║     ██║   ██║██║╚██╔╝██║██╔══╝      ██╔══██╗██╔══╝    ╚██╔╝  ',
    '╚███╔███╔╝███████╗███████╗╚██████╗╚██████╔╝██║ ╚═╝ ██║███████╗    ██║  ██║███████╗   ██║   ',
    ' ╚══╝╚══╝ ╚══════╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝    ╚═╝  ╚═╝╚══════╝   ╚═╝   '
  ];

  const msgLines = [
    'Welcome to Moodle University Portal.',
    'Initializing session...',
    'Authenticating...'
  ];

  const TYPING_SPEED = 10;
  const LINE_PAUSE = 150;
  const ASCII_DELAY = 80;
  const DISMISS_DELAY = 1500;
  const FADE_DURATION = 500;

  const style = document.createElement('style');
  style.textContent = `
    #terminal-overlay {
      position: fixed;
      top: 0; left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.88);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Consolas', 'Courier New', monospace;
      opacity: 1;
      transition: opacity ${FADE_DURATION}ms ease;
    }
    #terminal-overlay.fade-out { opacity: 0; }
    .terminal-window {
      width: 90%;
      max-width: 960px;
      background: #0c0c0c;
      border-radius: 0;
      box-shadow: 0 10px 40px rgba(0,0,0,0.6);
      overflow: hidden;
    }
    .terminal-title-bar {
      background: #1a1a1a;
      padding: 10px 16px;
      text-align: center;
      border-bottom: 1px solid #2a2a2a;
      user-select: none;
    }
    .terminal-title {
      color: #888;
      font-size: 13px;
    }
    .terminal-body { padding: 28px 32px; min-height: 250px; }
    .ascii {
      line-height: 1.1;
    }
    .terminal-output {
      color: #00ff41;
      font-size: 16px;
      line-height: 1.8;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .terminal-cursor-line {
      color: #00ff41;
      font-size: 16px;
      line-height: 1.8;
      margin-top: 4px;
    }
    .cursor {
      animation: blink 0.8s step-end infinite;
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.id = 'terminal-overlay';
  overlay.innerHTML = `
    <div class="terminal-window">
      <div class="terminal-title-bar">
        <span class="terminal-title">moodle@university: ~</span>
      </div>
      <div class="terminal-body">
        <div class="terminal-output"></div>
        <div class="terminal-cursor-line" style="display:none">
          <span>moodle@university:~$ </span><span class="cursor">▊</span>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const output = overlay.querySelector('.terminal-output');
  const cursorLine = overlay.querySelector('.terminal-cursor-line');

  let phase = 'ascii';
  let lineIndex = 0;
  let charIndex = 0;

  function asciiHTML(count) {
    let html = '<div class="ascii">';
    for (let i = 0; i < count; i++)
      html += asciiLines[i] + '<br>';
    html += '</div>';
    return html;
  }

  function tick() {
    if (phase === 'ascii') {
      if (lineIndex < asciiLines.length) {
        output.innerHTML = asciiHTML(lineIndex + 1);
        lineIndex++;
        setTimeout(tick, ASCII_DELAY);
      } else {
        phase = 'msg';
        lineIndex = 0;
        charIndex = 0;
        setTimeout(tick, LINE_PAUSE);
      }
      return;
    }

    if (lineIndex >= msgLines.length) {
      cursorLine.style.display = 'block';
      setTimeout(() => {
        overlay.classList.add('fade-out');
        setTimeout(() => {
          overlay.remove();
          doAutoLogin();
        }, FADE_DURATION);
      }, DISMISS_DELAY);
      return;
    }

    const line = msgLines[lineIndex];

    if (charIndex <= line.length) {
      let html = asciiHTML(asciiLines.length);
      for (let i = 0; i < lineIndex; i++)
        html += '> ' + msgLines[i] + '<br>';
      html += '> ' + line.substring(0, charIndex);
      html += '<span class="cursor">▊</span>';
      output.innerHTML = html;
      charIndex++;
      setTimeout(tick, TYPING_SPEED);
    } else {
      lineIndex++;
      charIndex = 0;
      setTimeout(tick, LINE_PAUSE);
    }
  }

  tick();

  function doAutoLogin() {
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const loginBtn = document.querySelector('button[type="submit"]');

    if (username && password && loginBtn) {
      username.value = 'username';
      password.value = 'password';
      loginBtn.click();
    }
  }
});
