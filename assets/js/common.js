/* ============================================
   灵感岛 AI工具箱 - 公共逻辑
   导航注入 / 主题切换 / 历史记录 / 复制 / Toast
   ============================================ */

/* ---------- 工具配置中心 ---------- */
const TOOLS = [
  {
    slug: 'moments',
    name: '朋友圈文案生成器',
    icon: '💬',
    desc: '输入场景，一键生成走心又有趣的朋友圈文案，配图发圈不再纠结。',
    tag: '高频刚需',
    hot: true,
    gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    soft: '#fef3c7'
  },
  {
    slug: 'xiaohongshu-title',
    name: '小红书爆款标题',
    icon: '🔥',
    desc: '套用爆款公式，批量生成高点击率的小红书标题，笔记流量翻倍。',
    tag: '自媒体必备',
    hot: true,
    gradient: 'linear-gradient(135deg, #ef4444, #ec4899)',
    soft: '#fee2e2'
  },
  {
    slug: 'name',
    name: 'AI 取名神器',
    icon: '🎋',
    desc: '宝宝起名、宠物取名、店铺命名，寓意吉祥又好听，灵感源源不断。',
    tag: '刚需常青',
    hot: true,
    gradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
    soft: '#d1fae5'
  },
  {
    slug: 'weekly-report',
    name: '周报总结生成器',
    icon: '📝',
    desc: '把零散工作变成专业周报，结构清晰、重点突出，职场汇报不求人。',
    tag: '职场效率',
    hot: false,
    gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    soft: '#dbeafe'
  },
  {
    slug: 'eq-reply',
    name: '高情商回复助手',
    icon: '✨',
    desc: '尴尬聊天不用慌，高情商话术帮你优雅回应各种难接的场景。',
    tag: '趣味传播',
    hot: false,
    gradient: 'linear-gradient(135deg, #8b5cf6, #d946ef)',
    soft: '#ede9fe'
  },
  {
    slug: 'nickname',
    name: '网名生成器大全',
    icon: '🎮',
    desc: '空白名、重复名、翅膀、花藤、花体字，一次性集齐所有个性网名工具。',
    tag: '超多玩法',
    hot: true,
    gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
    soft: '#fce7f3'
  },
  {
    slug: 'text-effect',
    name: '文字特效生成器',
    icon: '✨',
    desc: '居中签名、竖排、倒序、上标、爱心字、火星文，玩转文字花样。',
    tag: '趣味好玩',
    hot: false,
    gradient: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
    soft: '#e0f2fe'
  },
  {
    slug: 'utility',
    name: '实用小工具箱',
    icon: '🔧',
    desc: '随机密码、金额大写、随机抽奖、文字隐身、诗词起名，日常够用。',
    tag: '生活常用',
    hot: false,
    gradient: 'linear-gradient(135deg, #14b8a6, #22c55e)',
    soft: '#d1fae5'
  }
];

function getTool(slug) {
  return TOOLS.find(t => t.slug === slug);
}

/* ---------- 本地存储工具 ---------- */
const Store = {
  get(key, fallback) {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : fallback;
    } catch (e) { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }
};

/* ---------- 主题管理 ---------- */
function initTheme() {
  const saved = Store.get('ld_theme', 'light');
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  Store.set('ld_theme', next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('themeToggle');
  if (!btn || !window.Icons) return;
  // 浅色主题显示月亮，深色主题显示太阳
  const type = theme === 'light' ? 'moon' : 'sun';
  btn.innerHTML = '';
  btn.appendChild(window.Icons.createIcon(type, 20, 6));
}

// 重新渲染页面内所有 Canvas 图标（动态注入内容后调用）
function refreshIcons() {
  if (window.Icons) window.Icons.paintIcons(document);
}

/* ---------- 注入 Header ---------- */
function injectHeader(activeSlug) {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  const navLinks = TOOLS.map(t =>
    `<a href="/tools/${t.slug}.html" class="${activeSlug === t.slug ? 'active' : ''}"><span class="nav-icon" data-icon="${t.slug}" data-size="18" data-radius="5"></span>${t.name}</a>`
  ).join('');
  header.innerHTML = `
    <div class="header-inner">
      <a href="/index.html" class="logo">
        <span class="logo-icon" data-icon="logo" data-size="36" data-radius="10"></span>
        <span>灵感<span class="logo-gradient">岛</span></span>
      </a>
      <nav class="nav-links" id="navLinks">
        <a href="/index.html" class="${!activeSlug ? 'active' : ''}"><span class="nav-icon" data-icon="logo" data-size="18" data-radius="5"></span>首页</a>
        ${navLinks}
      </nav>
      <div class="header-actions">
        <button class="icon-btn" id="themeToggle" onclick="toggleTheme()" title="切换主题"></button>
        <button class="icon-btn mobile-menu-btn" onclick="document.getElementById('navLinks').classList.toggle('open')" title="菜单">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        </button>
      </div>
    </div>
  `;
}

/* ---------- 注入 Footer ---------- */
function injectFooter() {
  const footer = document.getElementById('siteFooter');
  if (!footer) return;
  const toolLinks = TOOLS.map(t =>
    `<a href="/tools/${t.slug}.html">${t.name}</a>`
  ).join('');
  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="/index.html" class="logo">
            <span class="logo-icon" data-icon="logo" data-size="36" data-radius="10"></span>
            <span>灵感<span class="logo-gradient">岛</span></span>
          </a>
          <p>让每一次创作都有灵感。提供简单、好用、免费的 AI 效率工具，帮你把想法变成成果。</p>
        </div>
        <div class="footer-col">
          <h4>热门工具</h4>
          ${toolLinks}
        </div>
        <div class="footer-col">
          <h4>关于我们</h4>
          <a href="/index.html#features">产品特性</a>
          <a href="/index.html">全部工具</a>
          <a href="/index.html#faq">常见问题</a>
          <a href="#" onclick="return false;">商务合作</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© <span id="year"></span> 灵感岛 AI工具箱 · 本站部分内容由 AI 辅助生成，仅供参考</p>
      </div>
    </div>
  `;
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ---------- Toast 提示 ---------- */
function showToast(message, duration = 2000) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
}

/* ---------- 复制文本 ---------- */
async function copyText(text, silent = false) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    if (!silent) showToast('✅ 已复制到剪贴板');
    return true;
  } catch (e) {
    if (!silent) showToast('❌ 复制失败，请手动选择');
    return false;
  }
}

/* ---------- 历史记录管理 ---------- */
function saveHistory(toolSlug, inputs, results) {
  const all = Store.get('ld_history', []);
  all.unshift({
    id: Date.now(),
    tool: toolSlug,
    inputs: inputs,
    results: results,
    time: new Date().toLocaleString('zh-CN', { hour12: false })
  });
  Store.set('ld_history', all.slice(0, 50)); // 最多50条
}

function getHistory(toolSlug) {
  const all = Store.get('ld_history', []);
  return toolSlug ? all.filter(h => h.tool === toolSlug) : all;
}

function clearHistory() {
  Store.set('ld_history', []);
  showToast('🗑️ 历史记录已清空');
}

/* ---------- 渲染工具页历史列表 ---------- */
function renderHistory(containerId, toolSlug, onRestore) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const records = getHistory(toolSlug);
  if (records.length === 0) {
    container.innerHTML = '<p style="color:var(--text-light);font-size:0.88rem;text-align:center;padding:20px;">暂无历史记录，生成内容后会自动保存在这里。</p>';
    return;
  }
  container.innerHTML = records.slice(0, 8).map((r, i) => {
    const tool = getTool(r.tool);
    const preview = (r.results && r.results[0]) || JSON.stringify(r.inputs) || '';
    return `
      <div class="history-item" data-id="${r.id}">
        <div class="history-item-icon" data-icon="${tool ? tool.slug : 'doc'}" data-size="38" data-radius="10"></div>
        <div class="history-item-body" style="cursor:pointer;" onclick="window._restoreHistory(${r.id})">
          <div class="history-item-title">${tool ? tool.name : '生成记录'}</div>
          <div class="history-item-preview">${escapeHtml(preview).slice(0, 60)}</div>
        </div>
        <div class="history-item-time">${r.time}</div>
      </div>
    `;
  }).join('');

  // 渲染历史图标
  refreshIcons();

  // 绑定恢复回调
  window._restoreHistory = function(id) {
    const record = getHistory(toolSlug).find(r => r.id === id);
    if (record && onRestore) onRestore(record);
  };
}

/* ---------- HTML 转义 ---------- */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

/* ---------- 初始化 ---------- */
document.addEventListener('DOMContentLoaded', function() {
  initTheme();
  injectHeader(document.body.dataset.tool || '');
  injectFooter();
  // 注入导航/页脚后渲染 Canvas 图标，并初始化主题按钮图标
  refreshIcons();
  updateThemeIcon(document.documentElement.getAttribute('data-theme') || 'light');
});
