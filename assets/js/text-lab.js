/* ============================================
   灵感岛 AI工具箱 - 文字工具实验室渲染器
   配置驱动：一套逻辑渲染所有字符变换工具
   ============================================ */

const TextLab = (() => {
  'use strict';
  const E = window.TextEngine;

  /* ---------- 工具定义（按分类） ---------- */
  const DEFS = {
    /* ===== 网名昵称类 ===== */
    'repeat-name': {
      name: '王者荣耀重复名', desc: '生成视觉相同、系统却认为是不同的昵称，解决重名烦恼',
      icon: '🎮', tip: '复制后在游戏里粘贴，若提示重名就换一个试试',
      fields: [
        { key: 'name', label: '你的昵称', type: 'text', placeholder: '如：孤影', required: true },
        { key: 'count', label: '生成数量', type: 'select', options: ['10', '20', '50'], value: '20' }
      ],
      run: p => E.repeatName(p.name, +p.count)
    },
    'blank-name': {
      name: '空白昵称生成器', desc: '生成透明空白的昵称，设置后别人看不到名字',
      icon: '⬜', tip: '复制下方空白字符直接粘贴到昵称框，微信/QQ/游戏均可用',
      fields: [{ key: 'count', label: '生成数量', type: 'select', options: ['5', '10', '20'], value: '10' }],
      run: p => E.blankName(+p.count)
    },
    'wing-name': {
      name: '翅膀昵称生成器', desc: '给名字套上炫酷翅膀边框，个性十足',
      icon: '🕊️', tip: '点击结果即可复制，粘贴到任意昵称框',
      fields: [
        { key: 'name', label: '你的昵称', type: 'text', placeholder: '如：追风', required: true },
        { key: 'count', label: '生成数量', type: 'select', options: ['10', '20', '50'], value: '20' }
      ],
      run: p => E.wingName(p.name, +p.count)
    },
    'vine-name': {
      name: '花藤昵称生成器', desc: '在名字里穿插飘逸花藤符号，唯美古风',
      icon: '🌸', tip: '花藤符号在部分平台可能显示不同，选择喜欢的复制',
      fields: [
        { key: 'name', label: '你的昵称', type: 'text', placeholder: '如：浅夏', required: true },
        { key: 'count', label: '生成数量', type: 'select', options: ['10', '20', '50'], value: '20' }
      ],
      run: p => E.vineName(p.name, +p.count)
    },
    'pattern-name': {
      name: '花样字体昵称', desc: '下划线、删除线、爱心、间隔等多种花样效果',
      icon: '✨', tip: '不同花样在不同 App 显示效果不同，多试几个',
      fields: [
        { key: 'name', label: '输入文字', type: 'text', placeholder: '如：最爱', required: true },
        { key: 'count', label: '生成数量', type: 'select', options: ['10', '20', '30'], value: '15' }
      ],
      run: p => E.fancyPattern(p.name, +p.count)
    },
    'symbol-name': {
      name: '符号网名生成器', desc: '纯符号组合的个性网名，简约又特别',
      icon: '⭐', tip: '复制喜欢的符号组合作为昵称',
      fields: [{ key: 'count', label: '生成数量', type: 'select', options: ['10', '20', '50'], value: '20' }],
      run: p => E.symbolName(+p.count)
    },
    'fancy-font': {
      name: '花体英文字母', desc: '粗体/斜体/空心/双线/圆圈等多种 Unicode 花体字',
      icon: '𝑨', tip: '适用于 Instagram、游戏 ID、个性签名',
      fields: [
        { key: 'name', label: '输入英文/数字', type: 'text', placeholder: '如：Love2024', required: true },
        { key: 'count', label: '字体样式', type: 'select', options: Object.keys(FONT_STYLES_LOCAL()), value: '粗体' }
      ],
      run: p => Object.keys(FONT_STYLES_LOCAL()).map(s => `${s}：${E.fancyFont(p.name, s)}`)
    },

    /* ===== 文字特效类 ===== */
    'center-sign': {
      name: '居中签名生成器', desc: '一键生成朋友圈、个性签名的居中文字效果',
      icon: '🎯', tip: '全角空格实现居中，复制到签名框即可',
      fields: [{ key: 'name', label: '输入文字（换行可多行）', type: 'textarea', placeholder: '如：相遇是缘分\n相知是真心', required: true }],
      run: p => [E.centerText(p.name)]
    },
    'vertical-text': {
      name: '竖排文字转换器', desc: '把横排文字转成古风竖排效果，支持边框',
      icon: '📜', tip: '适合朋友圈文案、个性签名',
      fields: [
        { key: 'name', label: '输入文字', type: 'textarea', placeholder: '如：明月几时有', required: true },
        { key: 'count', label: '边框样式', type: 'select', options: ['无', '方框', '星星'], value: '无' }
      ],
      run: p => [E.verticalText(p.name, p.count === '方框' ? 'box' : p.count === '星星' ? 'star' : 'none')]
    },
    'reverse-text': {
      name: '文字倒序转换器', desc: '字符倒序、单词倒序、按行倒序',
      icon: '🔄', tip: '常用于制作趣味文字、网名',
      fields: [
        { key: 'name', label: '输入文字', type: 'textarea', placeholder: '如：我爱灵感岛', required: true },
        { key: 'count', label: '倒序方式', type: 'select', options: ['字符', '单词', '按行'], value: '字符' }
      ],
      run: p => [E.reverseText(p.name, p.count === '单词' ? 'word' : p.count === '按行' ? 'line' : 'char')]
    },
    'sup-text': {
      name: '上标下标生成器', desc: '把数字字母转成上标/下标，如 ⁽¹⁾ 或 ₁₂₃',
      icon: 'ˣ', tip: '常用于商标符号、化学式、可爱昵称',
      fields: [
        { key: 'name', label: '输入文字/数字', type: 'text', placeholder: '如：Love2024', required: true },
        { key: 'count', label: '样式', type: 'select', options: ['上标', '下标'], value: '上标' }
      ],
      run: p => [E.supSubText(p.name, p.count === '下标' ? 'sub' : 'sup')]
    },
    'love-text': {
      name: '520爱心文字', desc: '用爱心、星星等符号包裹文字，表白朋友圈必备',
      icon: '❤️', tip: '520、七夕、表白发圈神器',
      fields: [
        { key: 'name', label: '输入文字', type: 'text', placeholder: '如：我爱你', required: true },
        { key: 'count', label: '装饰符号', type: 'select', options: ['❤', '✿', '✧', '★', '♪'], value: '❤' }
      ],
      run: p => [E.loveText(p.name, p.count)]
    },
    'scream-text': {
      name: '尖叫字体生成器', desc: '给每个字加疯狂符号，制造"尖叫"视觉特效',
      icon: '😱', tip: '抖音、朋友圈流行的炸裂字体',
      fields: [
        { key: 'name', label: '输入文字', type: 'text', placeholder: '如：太震撼了', required: true },
        { key: 'count', label: '生成数量', type: 'select', options: ['1', '3', '5'], value: '3' }
      ],
      run: p => {
        const res = [];
        for (let i = 0; i < +p.count; i++) res.push(E.screamText(p.name));
        return res;
      }
    },
    'mars-text': {
      name: '火星文转换器', desc: '把简体中文转成非主流火星文',
      icon: '🔥', tip: '怀旧非主流风格，趣味十足',
      fields: [{ key: 'name', label: '输入中文', type: 'textarea', placeholder: '如：我爱你，亲爱的', required: true }],
      run: p => [E.marsText(p.name)]
    },
    'traditional': {
      name: '简繁体转换', desc: '简体中文一键转繁体中文',
      icon: '繁', tip: '常用字转换，适合繁体环境',
      fields: [{ key: 'name', label: '输入简体中文', type: 'textarea', placeholder: '如：我爱中国文字', required: true }],
      run: p => [E.toTraditional(p.name)]
    },

    /* ===== 实用工具类 ===== */
    'password': {
      name: '随机密码生成器', desc: '自定义长度和字符类型，生成高强度随机密码',
      icon: '🔐', tip: '密码在本地生成，不上传服务器，安全可靠',
      fields: [
        { key: 'count', label: '密码长度', type: 'select', options: ['8', '12', '16', '20', '32'], value: '16' },
        { key: 'lower', label: '小写字母', type: 'check', value: true },
        { key: 'upper', label: '大写字母', type: 'check', value: true },
        { key: 'number', label: '数字', type: 'check', value: true },
        { key: 'symbol', label: '特殊符号', type: 'check', value: true },
        { key: 'quantity', label: '生成数量', type: 'select', options: ['1', '5', '10'], value: '5' }
      ],
      run: p => {
        const res = [];
        for (let i = 0; i < +p.quantity; i++) res.push(E.randomPassword(+p.count, p));
        return res;
      }
    },
    'random-pick': {
      name: '随机选择器', desc: '名单抽奖、随机点名、随机分组',
      icon: '🎲', tip: '每行一个选项，支持是否可重复',
      fields: [
        { key: 'name', label: '选项列表（每行一个）', type: 'textarea', placeholder: '张三\n李四\n王五\n赵六', required: true },
        { key: 'count', label: '抽取数量', type: 'select', options: ['1', '2', '3', '5', '10'], value: '1' },
        { key: 'unique', label: '不重复抽取', type: 'check', value: true }
      ],
      run: p => E.randomPick(p.name, +p.count, p.unique)
    },
    'amount': {
      name: '金额大写转换', desc: '数字金额转人民币大写，财务报销必备',
      icon: '💰', tip: '如 1234.56 → 壹仟贰佰叁拾肆元伍角陆分',
      fields: [{ key: 'name', label: '输入金额', type: 'text', placeholder: '如：1234.56', required: true }],
      run: p => [E.amountToChinese(p.name)]
    },
    'invisible': {
      name: '文字隐身术', desc: '把文字藏进不可见字符，粘贴后看似空白',
      icon: '👻', tip: '复制结果发送，对方需用什么方式还原？用下方的解码功能',
      fields: [{ key: 'name', label: '输入要隐藏的文字', type: 'textarea', placeholder: '如：这是秘密', required: true }],
      run: p => [E.invisibleText(p.name)]
    },
    'invisible-decode': {
      name: '隐身文字解码', desc: '把隐藏在空白字符里的内容还原出来',
      icon: '🔍', tip: '粘贴别人发的"空白"文字，即可看到真实内容',
      fields: [{ key: 'name', label: '粘贴隐身文字', type: 'textarea', placeholder: '粘贴看似空白的文字...', required: true }],
      run: p => [E.decodeInvisible(p.name) || '未检测到隐藏内容']
    },
    'poem-name': {
      name: '诗词起名', desc: '从唐诗宋词名句里提取灵感，生成诗意名字',
      icon: '📖', tip: '每次生成都不同，多刷几次找灵感',
      fields: [
        { key: 'name', label: '姓氏（可选）', type: 'text', placeholder: '如：李' },
        { key: 'count', label: '生成数量', type: 'select', options: ['10', '20', '50'], value: '20' }
      ],
      run: p => {
        const res = [];
        for (let i = 0; i < +p.count; i++) res.push(E.pickPoemName(p.name));
        return [...new Set(res)];
      }
    }
  };

  // 花体样式 key（供 select 用）
  function FONT_STYLES_LOCAL() {
    return { '粗体': 1, '斜体': 1, '粗斜体': 1, '空心': 1, '双线': 1, '无衬线': 1, '等宽': 1, '圆圈': 1 };
  }

  /* ---------- 渲染工具 UI ---------- */
  function renderTool(def, container, toolId) {
    const fieldsHtml = def.fields.map(f => {
      if (f.type === 'check') {
        return `<label class="check-field"><input type="checkbox" data-key="${f.key}" ${f.value ? 'checked' : ''}> <span>${f.label}</span></label>`;
      }
      if (f.type === 'select') {
        return `<div class="form-group"><label class="form-label">${f.label}</label>
          <select class="select" data-key="${f.key}">${f.options.map(o =>
            `<option value="${o}" ${o === f.value ? 'selected' : ''}>${o}</option>`).join('')}</select></div>`;
      }
      const inputCls = f.type === 'textarea' ? 'textarea' : 'input';
      const tag = f.type === 'textarea' ? 'textarea' : 'input';
      const attrs = f.type === 'textarea' ? `style="min-height:90px;"` : `type="text"`;
      return `<div class="form-group"><label class="form-label">${f.label}</label>
        <${tag} class="${inputCls}" data-key="${f.key}" ${attrs} placeholder="${f.placeholder || ''}"></${tag}></div>`;
    }).join('');

    container.innerHTML = `
      <div class="lab-tool">
        <div class="lab-tool-input">
          <h3 class="lab-tool-title"><span class="lab-tool-icon">${def.icon}</span>${def.name}</h3>
          <p class="lab-tool-desc">${def.desc}</p>
          <div class="lab-fields">${fieldsHtml}</div>
          <button class="btn btn-primary btn-block btn-lg" onclick="TextLab.run('${toolId}')">${def.icon} 开始生成</button>
          <p class="lab-tip">💡 ${def.tip}</p>
        </div>
        <div class="lab-tool-output">
          <div class="lab-output-head"><span>生成结果</span><span id="labCount_${toolId}" style="font-size:.8rem;color:var(--text-light);"></span></div>
          <div class="lab-result-area" id="labResult_${toolId}">
            <div class="result-empty"><div class="result-empty-icon">${def.icon}</div><p>填写内容并点击生成<br>结果会出现在这里</p></div>
          </div>
          <div class="lab-output-actions" id="labActions_${toolId}" style="display:none;">
            <button class="btn btn-outline" onclick="TextLab.copyAll('${toolId}')">📋 复制全部</button>
          </div>
        </div>
      </div>`;
  }

  /* ---------- 收集参数 ---------- */
  function collectParams(container) {
    const p = {};
    container.querySelectorAll('[data-key]').forEach(el => {
      if (el.type === 'checkbox') p[el.dataset.key] = el.checked;
      else p[el.dataset.key] = el.value.trim();
    });
    return p;
  }

  /* ---------- 运行 ---------- */
  function run(toolId) {
    const def = DEFS[toolId];
    const container = document.getElementById('labHost_' + toolId);
    if (!def || !container) return;
    const p = collectParams(container);
    // 必填校验
    for (const f of def.fields) {
      if (f.required && !p[f.key]) {
        if (window.showToast) showToast('请填写：' + f.label);
        return;
      }
    }
    let results;
    try { results = def.run(p); }
    catch (e) { console.error(e); if (window.showToast) showToast('生成失败，请重试'); return; }
    const area = document.getElementById('labResult_' + toolId);
    area.innerHTML = `<div class="result-list">${results.map((r, i) => `
      <div class="result-item" onclick="TextLab.copyOne('${toolId}',${i},this)">
        <span class="result-index">${i + 1}</span>
        <p class="result-text">${escapeHtmlLocal(r)}</p>
        <span class="result-copy-hint">📋 点击复制</span>
      </div>`).join('')}</div>`;
    document.getElementById('labActions_' + toolId).style.display = 'flex';
    document.getElementById('labCount_' + toolId).textContent = `共 ${results.length} 条`;
    container._results = results;
    // 历史记录
    if (window.saveHistory) {
      saveHistory('lab-' + toolId, p, results.slice(0, 30));
      if (window.renderHistory && document.getElementById('historyList')) {
        renderHistory('historyList', 'lab-' + toolId, null);
      }
    }
  }

  function escapeHtmlLocal(s) {
    return String(s).replace(/[&<>"']/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));
  }

  async function copyOne(toolId, idx, el) {
    const c = document.getElementById('labHost_' + toolId);
    if (c._results && window.copyText) await copyText(c._results[idx]);
    if (el) { el.classList.add('copied'); setTimeout(() => el.classList.remove('copied'), 800); }
  }
  async function copyAll(toolId) {
    const c = document.getElementById('labHost_' + toolId);
    if (c._results && window.copyText) await copyText(c._results.join('\n'));
    if (window.showToast) showToast('已复制全部结果');
  }

  /* ---------- 初始化页面 ---------- */
  function init(categoryToolIds) {
    categoryToolIds.forEach(id => {
      const host = document.getElementById('labHost_' + id);
      if (host && DEFS[id]) renderTool(DEFS[id], host, id);
    });
  }

  return { DEFS, init, run, copyOne, copyAll };
})();

if (typeof window !== 'undefined') window.TextLab = TextLab;
