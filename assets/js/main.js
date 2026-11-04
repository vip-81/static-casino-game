(function () {
  'use strict';

  /* ---------- 移动端导航 ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const open = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });

    navLinks.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- 老虎机演示 ---------- */
  const SYMBOLS = ['🍒', '🍋', '🍇', '🔔', '⭐', '7️⃣'];
  const reels = document.querySelectorAll('.reel');
  const spinBtn = document.getElementById('spin-btn');
  const resultMsg = document.getElementById('result-msg');
  const creditsEl = document.getElementById('credits');

  const START_CREDITS = 1000;
  const BET = 10;
  const TRIPLE_WIN = 100;

  let credits = START_CREDITS;
  let spinning = false;

  function randomSymbol() {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  }

  function updateCredits() {
    if (creditsEl) creditsEl.textContent = String(credits);
  }

  function spin() {
    if (spinning) return;
    if (credits < BET) {
      resultMsg.textContent = '演示积分不足，刷新页面即可重新开始。';
      return;
    }

    spinning = true;
    credits -= BET;
    updateCredits();

    spinBtn.disabled = true;
    spinBtn.setAttribute('aria-busy', 'true');
    resultMsg.textContent = '旋转中…';

    reels.forEach(function (reel, idx) {
      reel.classList.add('spinning');
      window.setTimeout(function () {
        reel.textContent = randomSymbol();
        reel.classList.remove('spinning');
      }, idx * 150 + 200);
    });

    window.setTimeout(function () {
      const vals = Array.from(reels).map(function (r) { return r.textContent; });
      const win = vals.every(function (v) { return v === vals[0]; });

      if (win) {
        credits += TRIPLE_WIN;
        updateCredits();
        resultMsg.textContent = '🎉 三个相同图案！演示奖励 +' + TRIPLE_WIN + ' 积分（无实际奖品）';
      } else {
        resultMsg.textContent = '未中奖，再试一次吧～（当前演示积分：' + credits + '）';
      }

      spinning = false;
      spinBtn.disabled = false;
      spinBtn.removeAttribute('aria-busy');
    }, 1000);
  }

  if (spinBtn && reels.length) {
    spinBtn.addEventListener('click', spin);
    updateCredits();
  }

  /* ---------- Service Worker（生产环境离线缓存） ---------- */
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function () {
        /* 离线缓存失败不影响游戏运行 */
      });
    });
  }
})();
