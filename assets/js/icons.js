/* ============================================
   灵感岛 AI工具箱 - Canvas 图标库
   用 Canvas 绘制统一风格的精美图标，替换 emoji
   支持高清屏(DPR)，一致渐变背景 + 白色图形
   ============================================ */

(function () {
  'use strict';

  // 每个工具的渐变配色（与 style.css 保持一致）
  const THEMES = {
    logo:              ['#6366f1', '#8b5cf6'],
    moments:           ['#f59e0b', '#ef4444'],   // 朋友圈 - 暖橙红
    'xiaohongshu-title': ['#ef4444', '#ec4899'], // 小红书 - 红粉
    name:              ['#10b981', '#06b6d4'],   // 取名 - 青绿
    'weekly-report':   ['#3b82f6', '#6366f1'],   // 周报 - 蓝靛
    'eq-reply':        ['#8b5cf6', '#d946ef'],   // 高情商 - 紫品红
    sun:               ['#f59e0b', '#f97316'],
    moon:              ['#6366f1', '#8b5cf6'],
    bolt:              ['#6366f1', '#818cf8'],   // 打开即用 - 闪电
    target:            ['#f59e0b', '#fbbf24'],   // 懂你所需 - 靶心
    shield:            ['#10b981', '#34d399'],   // 隐私安全 - 盾牌
    medal:             ['#ec4899', '#f472b6'],   // 完全免费 - 奖章
    doc:               ['#94a3b8', '#64748b']    // 默认文档
  };

  // 绘制函数：ctx 已按 100x100 逻辑坐标系缩放
  const DRAW = {
    // 灵感岛 logo：岛屿 + 太阳 + 水波
    logo(ctx) {
      // 太阳
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.beginPath(); ctx.arc(66, 33, 11, 0, Math.PI * 2); ctx.fill();
      // 岛屿/山峰
      ctx.beginPath();
      ctx.moveTo(18, 72);
      ctx.lineTo(40, 44); ctx.lineTo(53, 58); ctx.lineTo(68, 38); ctx.lineTo(88, 72);
      ctx.closePath(); ctx.fill();
      // 水波
      ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 4; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(22, 82); ctx.quadraticCurveTo(32, 77, 42, 82); ctx.quadraticCurveTo(52, 87, 62, 82); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(58, 90); ctx.quadraticCurveTo(66, 86, 74, 90); ctx.quadraticCurveTo(80, 93, 86, 90); ctx.stroke();
    },

    // 朋友圈文案：聊天气泡 + 文字行 + 心
    moments(ctx) {
      ctx.fillStyle = '#fff';
      roundRect(ctx, 16, 20, 60, 45, 12); ctx.fill();
      ctx.beginPath(); ctx.moveTo(30, 64); ctx.lineTo(24, 80); ctx.lineTo(44, 64); ctx.closePath(); ctx.fill();
      // 文字行（用主题色）
      ctx.fillStyle = THEMES.moments[1];
      ctx.fillRect(26, 33, 38, 4); ctx.fillRect(26, 43, 30, 4); ctx.fillRect(26, 53, 34, 4);
      // 小心形
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.moveTo(74, 24);
      ctx.bezierCurveTo(74, 18, 66, 18, 66, 25);
      ctx.bezierCurveTo(66, 31, 74, 35, 74, 39);
      ctx.bezierCurveTo(74, 35, 82, 31, 82, 25);
      ctx.bezierCurveTo(82, 18, 74, 18, 74, 24);
      ctx.fill();
    },

    // 小红书标题：文档 + 上升箭头/火焰
    'xiaohongshu-title'(ctx) {
      ctx.fillStyle = '#fff';
      roundRect(ctx, 20, 18, 46, 62, 8); ctx.fill();
      ctx.fillStyle = THEMES['xiaohongshu-title'][0];
      ctx.fillRect(29, 32, 28, 5); ctx.fillRect(29, 44, 22, 5); ctx.fillRect(29, 56, 26, 5);
      // 火箭/上升箭头
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.moveTo(70, 66); ctx.lineTo(88, 48); ctx.lineTo(80, 48); ctx.lineTo(84, 34);
      ctx.lineTo(64, 54); ctx.lineTo(72, 54); ctx.closePath(); ctx.fill();
    },

    // 取名：毛笔字牌 / 印章
    name(ctx) {
      ctx.fillStyle = '#fff';
      roundRect(ctx, 22, 16, 56, 68, 10); ctx.fill();
      // 竖排装饰线
      ctx.strokeStyle = THEMES.name[0]; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(50, 26); ctx.lineTo(50, 74); ctx.stroke();
      // 用文字"名"
      ctx.fillStyle = THEMES.name[0];
      ctx.font = 'bold 30px "PingFang SC","Microsoft YaHei",sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('名', 50, 50);
    },

    // 周报：文档 + 列表勾选
    'weekly-report'(ctx) {
      ctx.fillStyle = '#fff';
      roundRect(ctx, 20, 16, 60, 68, 9); ctx.fill();
      ctx.fillStyle = THEMES['weekly-report'][0];
      ctx.fillRect(30, 28, 40, 4);
      // 勾选项
      ctx.strokeStyle = THEMES['weekly-report'][0]; ctx.lineWidth = 3.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      [44, 58, 72].forEach(y => {
        ctx.fillStyle = THEMES['weekly-report'][0];
        roundRect(ctx, 30, y - 4, 8, 8, 2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(32, y); ctx.lineTo(34.5, y + 2.5); ctx.lineTo(37, y - 2); ctx.stroke();
        ctx.fillRect(44, y - 2, 16, 4);
      });
    },

    // 高情商回复：双气泡 + 星
    'eq-reply'(ctx) {
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      roundRect(ctx, 30, 24, 52, 38, 10); ctx.fill();
      ctx.fillStyle = '#fff';
      roundRect(ctx, 18, 40, 52, 38, 10); ctx.fill();
      // 星星
      ctx.fillStyle = THEMES['eq-reply'][0];
      drawStar(ctx, 44, 59, 12, 5);
    },

    // 太阳（浅色主题图标）
    sun(ctx) {
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(50, 50, 18, 0, Math.PI * 2); ctx.stroke();
      for (let i = 0; i < 8; i++) {
        const a = (Math.PI * 2 / 8) * i;
        ctx.beginPath();
        ctx.moveTo(50 + Math.cos(a) * 28, 50 + Math.sin(a) * 28);
        ctx.lineTo(50 + Math.cos(a) * 38, 50 + Math.sin(a) * 38);
        ctx.stroke();
      }
    },

    // 月亮（深色主题图标）
    moon(ctx) {
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(52, 48, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath(); ctx.arc(66, 40, 28, 0, Math.PI * 2); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    },

    // 闪电（打开即用）
    bolt(ctx) {
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.moveTo(56, 14); ctx.lineTo(28, 56); ctx.lineTo(46, 56);
      ctx.lineTo(40, 86); ctx.lineTo(72, 42); ctx.lineTo(52, 42); ctx.closePath();
      ctx.fill();
    },

    // 靶心（懂你所需）
    target(ctx) {
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 7;
      ctx.beginPath(); ctx.arc(50, 50, 32, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(50, 50, 18, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(50, 50, 6, 0, Math.PI * 2); ctx.fill();
    },

    // 盾牌（隐私安全）
    shield(ctx) {
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.moveTo(50, 16); ctx.lineTo(82, 28); ctx.lineTo(82, 52);
      ctx.quadraticCurveTo(82, 74, 50, 86); ctx.quadraticCurveTo(18, 74, 18, 52);
      ctx.lineTo(18, 28); ctx.closePath(); ctx.fill();
      // 对勾
      ctx.strokeStyle = THEMES.shield[0]; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(36, 50); ctx.lineTo(46, 60); ctx.lineTo(66, 40); ctx.stroke();
    },

    // 奖章（完全免费）
    medal(ctx) {
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(50, 58, 30, 0, Math.PI * 2); ctx.fill();
      // 星
      ctx.fillStyle = THEMES.medal[0]; drawStar(ctx, 50, 58, 16, 5);
      // 绶带
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.moveTo(36, 30); ctx.lineTo(30, 10); ctx.lineTo(46, 22); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(64, 30); ctx.lineTo(70, 10); ctx.lineTo(54, 22); ctx.closePath(); ctx.fill();
    },

    // 默认文档
    doc(ctx) {
      ctx.fillStyle = '#fff';
      roundRect(ctx, 26, 18, 48, 64, 7); ctx.fill();
      ctx.fillStyle = THEMES.doc[0];
      ctx.fillRect(34, 34, 32, 4); ctx.fillRect(34, 46, 32, 4); ctx.fillRect(34, 58, 22, 4);
    }
  };

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function drawStar(ctx, cx, cy, r, points) {
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? r : r * 0.45;
      const a = (Math.PI / points) * i - Math.PI / 2;
      const x = cx + Math.cos(a) * radius, y = cy + Math.sin(a) * radius;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath(); ctx.fill();
  }

  // 生成单个图标 canvas
  function createIcon(type, size, radius) {
    const canvas = document.createElement('canvas');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr; canvas.height = size * dpr;
    canvas.style.width = size + 'px'; canvas.style.height = size + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale((size / 100) * dpr, (size / 100) * dpr);

    const theme = THEMES[type] || THEMES.logo;
    // 渐变背景
    const g = ctx.createLinearGradient(0, 0, 100, 100);
    g.addColorStop(0, theme[0]); g.addColorStop(1, theme[1]);
    ctx.fillStyle = g;
    roundRect(ctx, 0, 0, 100, 100, radius != null ? radius : 22);
    ctx.fill();

    // 绘制图形
    const drawFn = DRAW[type] || DRAW.logo;
    ctx.save(); drawFn(ctx); ctx.restore();
    return canvas;
  }

  // 把页面内所有带 data-icon 的元素渲染成 Canvas 图标
  function paintIcons(root) {
    root = root || document;
    root.querySelectorAll('[data-icon]').forEach(el => {
      if (el.dataset.iconPainted) return;
      const type = el.dataset.icon;
      const size = parseInt(el.dataset.size || el.clientWidth || 52, 10);
      const radius = el.dataset.radius ? parseInt(el.dataset.radius, 10) : undefined;
      const canvas = createIcon(type, size, radius);
      el.innerHTML = '';
      el.appendChild(canvas);
      el.dataset.iconPainted = '1';
    });
  }

  // 暴露到全局
  window.Icons = { createIcon, paintIcons, THEMES };

  // DOM 就绪后自动渲染（common.js 注入导航后需再次调用）
  document.addEventListener('DOMContentLoaded', function () {
    paintIcons(document);
  });
})();
