/* ============================================
   灵感岛 AI工具箱 - 内容生成引擎
   内置模板库 + 规则引擎（无需API即可用）
   同时预留真实AI大模型接口（可选接入）
   ============================================ */

/* ---------- 通用工具函数 ---------- */
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pickMany(arr, n) { return shuffle(arr).slice(0, n); }
function fill(template, topic) { return template.replace(/\{topic\}/g, topic || '今天'); }

/* ============================================
   可选：接入真实大模型（OpenAI 兼容格式）
   在 window.AI_CONFIG 中配置 apiKey 和 baseUrl 即可启用
   不配置则自动使用下方内置引擎（免费、离线可用）
   ============================================ */
async function callAI(prompt, systemPrompt) {
  const cfg = window.AI_CONFIG;
  if (!cfg || !cfg.apiKey) return null; // 未配置，使用本地引擎
  try {
    const res = await fetch(cfg.baseUrl + '/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + cfg.apiKey
      },
      body: JSON.stringify({
        model: cfg.model || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt || '你是一个专业的中文文案助手。' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.9
      })
    });
    const data = await res.json();
    return data.choices[0].message.content.trim();
  } catch (e) {
    console.warn('AI接口调用失败，回退到本地引擎', e);
    return null;
  }
}

/* ============================================
   1. 朋友圈文案生成器
   ============================================ */
const MOMENTS_TEMPLATES = {
  '文艺': [
    '{topic}，是生活给的小确幸。把日子过成诗，把平凡过成光。✨',
    '所有的{topic}，终会变成生命里温柔的注脚。慢慢来，比较快。🌿',
    '{topic}。愿你历尽千帆，归来仍是少年；愿你不忘初心，方得始终。',
    '把{topic}写进岁月里，等到白发苍苍，再翻出来慢慢读。📖',
    '生活不止眼前的{topic}，还有诗和远方的田野。🌾',
    '愿每一个{topic}的瞬间，都值得被时光温柔收藏。'
  ],
  '搞笑': [
    '{topic}？不存在的，我这个人只会躺平和干饭。🍚',
    '别人都在{topic}，而我在思考中午吃什么。格局，不一样。😎',
    '关于{topic}这件事，我总结了一个字：难。两个字：好难。三个字：太难了！😂',
    '{topic}使我快乐，不{topic}使我更快乐。🤪',
    '今日份{topic}已完成，奖励自己一杯奶茶，不过分吧？🧋',
    '谁再说{topic}简单，我把这个表情包发给他（微笑）。🙂'
  ],
  '励志': [
    '每一个不曾起舞的日子，都是对生命的辜负。今天，为{topic}全力以赴！💪',
    '{topic}的路上也许有风雨，但请相信，坚持本身就是一种胜利。🌟',
    '你流的每一滴汗，熬的每一个夜，都会在未来的{topic}里，给你答案。🔥',
    '不要让未来的你，讨厌现在不努力的自己。{topic}，冲！🚀',
    '星光不问赶路人，时光不负有心人。为{topic}加油！✨',
    '真正的强者，不是没有眼泪，而是含着眼泪依然奔跑在{topic}的路上。'
  ],
  '扎心': [
    '后来才明白，{topic}这件事，从来都不是一个人的独角戏。',
    '有些人，出现在你的{topic}里，却停留在回忆中。',
    '我们终其一生，不过是在{topic}中，寻找那个懂自己的人。',
    '小时候觉得{topic}很简单，长大了才知道，简单的是小时候。',
    '成年人最大的崩溃，是含着泪把{topic}说完，然后继续微笑。',
    '{topic}教会我最重要的事：别把希望寄托在别人身上。'
  ],
  '简洁': [
    '{topic}。📍',
    '今日：{topic}。',
    '{topic}，记录一下。',
    '关于{topic}，仅此而已。',
    '{topic} · 日常。',
    '是{topic}，也是好心情。☀️'
  ],
  '卖货': [
    '✨{topic}｜终于等到你！品质看得见，用过都说好，手慢无哦～',
    '被问了800遍的{topic}，今天它来了！限量供应，先到先得！🔥',
    '{topic}好物分享｜真心推荐，自用款，闭眼入不踩雷！💯',
    '还在纠结{topic}怎么选？看我就对了，专业测评，良心推荐！👍',
    '今日精选{topic}，价格美丽，质量保证，想要的赶紧私信我～📩'
  ]
};

async function generateMoments(params) {
  const { topic, style } = params;
  const aiResult = await callAI(
    `请以"${style}"风格，围绕"${topic}"写5条朋友圈文案，每条简短有趣，直接换行分隔。`,
    '你是资深朋友圈文案写手，擅长写出真实、有共鸣的短文案。'
  );
  if (aiResult) return aiResult.split('\n').filter(Boolean).map(s => s.replace(/^\d+[\.、)]\s*/, ''));

  const templates = MOMENTS_TEMPLATES[style] || MOMENTS_TEMPLATES['文艺'];
  const emojis = ['😊', '✨', '🌸', '💫', '🎈'];
  const results = pickMany(templates, 5).map((t, i) => fill(t, topic));
  // 随机给部分文案加 emoji
  return results.map((r, i) => i % 2 === 0 ? r + ' ' + emojis[i % emojis.length] : r);
}

/* ============================================
   2. 小红书爆款标题生成器
   ============================================ */
const TITLE_FORMULAS = [
  (t) => `救命！${t}居然可以这么绝，我直接封神🔥`,
  (t) => `${t}｜这谁顶得住啊！90%的人都不知道的真相`,
  (t) => `谁懂啊！${t}真的太上头了，后悔没有早点发现😭`,
  (t) => `全网都在问的${t}，终于被我找到了！附详细攻略`,
  (t) => `${t}天花板！手把手教你，小白也能一次成功✅`,
  (t) => `被问爆的${t}！吐血整理，建议收藏（超详细）📒`,
  (t) => `别再踩坑了！${t}的正确打开方式，看完省下几千块💰`,
  (t) => `${t}｜我宣布这是我的年度最佳！无限回购清单🛒`,
  (t) => `沉浸式${t}｜这也太治愈了吧，看完心情都变好了✨`,
  (t) => `打工人必看！${t}这样做，效率直接翻倍🚀`,
  (t) => `${t}的隐藏用法，99%的人都用错了！快码住⚠️`,
  (t) => `亲测有效！${t}一周见效，方法我都整理好了👇`,
  (t) => `${t}｜从入门到精通，这一篇就够了（干货满满）`,
  (t) => `我悟了！原来${t}的关键在这里，少走十年弯路💡`,
  (t) => `绝了！${t}还能这样操作？我已经惊呆了🤯`,
  (t) => `姐妹们冲！${t}真的yyds，不买真的会后悔💥`,
  (t) => `0基础也能学会的${t}，3分钟搞定，有手就会🙌`,
  (t) => `${t}踩坑实录｜花了3000块买的血泪教训，别再犯了😤`
];

const TITLE_EMOJIS = ['🔥', '✨', '😭', '💯', '👇', '📒', '⚠️', '💡', '🚀', '🛒', '🙌', '💥'];

async function generateXiaohongshuTitle(params) {
  const { topic, count } = params;
  const aiResult = await callAI(
    `围绕"${topic}"生成${count}个小红书爆款标题，要有吸引力、有情绪、多用数字和emoji，直接换行分隔。`,
    '你是小红书运营专家，深谙爆款标题公式，擅长制造点击欲望。'
  );
  if (aiResult) return aiResult.split('\n').filter(Boolean).map(s => s.replace(/^\d+[\.、)]\s*/, ''));

  const formulas = shuffle(TITLE_FORMULAS);
  const results = [];
  for (let i = 0; i < count; i++) {
    let title = formulas[i % formulas.length](topic);
    if (i >= formulas.length) title = title + ' ' + pick(TITLE_EMOJIS);
    results.push(title);
  }
  return results;
}

/* ============================================
   3. AI 取名神器
   ============================================ */
const NAME_DATA = {
  '宝宝': {
    surnames: ['李', '王', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '马', '朱', '胡', '林', '何', '郭'],
    words: {
      '古风': ['梓轩', '雨桐', '子墨', '若曦', '慕白', '清越', '云舒', '景行', '知远', '诗涵', '修远', '静姝', '明哲', '语嫣', '思齐', '致远'],
      '现代': ['一诺', '欣怡', '浩然', '思源', '子涵', '宇轩', '若溪', '嘉懿', '晨曦', '语桐', '睿哲', '可欣', '博文', '诗雅', '俊熙', '芷晴'],
      '可爱': ['糖糖', '豆豆', '果果', '嘟嘟', '萌萌', '团团', '圆圆', '童童', '妞妞', '皮皮', '小米', '小满', '安安', '乐乐', '奇奇', '妙妙'],
      '大气': ['宇轩', '浩然', '梓睿', '俊杰', '思远', '博文', '天佑', '子豪', '嘉诚', '鹏飞', '伟宸', '煜城', '璟睿', '鸿鹄', '巍然', '擎苍']
    },
    meanings: ['寓意才华横溢，前程似锦', '象征平安喜乐，一生顺遂', '取自诗经，文雅有内涵', '寓意胸怀宽广，志向高远', '代表温润如玉，品行高洁', '寓意聪明睿智，学识渊博', '象征阳光开朗，积极向上', '取自楚辞，大气磅礴']
  },
  '宠物': {
    surnames: [''],
    words: {
      '可爱': ['团子', '奶昔', '布丁', '麻薯', '糯米', '汤圆', '饼干', '棉花', '豆包', '年糕', '栗子', '桃子', '可乐', '雪碧', '摩卡', '拿铁'],
      '古风': ['阿黄', '小黑', '白雪', '阿福', '来财', '旺财', '招财', '平安', '如意', '小七', '阿宝', '豆豆', '虎子', '灰灰', '花花', '星星'],
      '现代': ['Lucky', 'Coco', 'Momo', '豆豆', '皮皮', '球球', '咪咪', '汪汪', '嘟嘟', '小宝', '闪电', '巧克力', '咖啡', '泡泡', '点点', '小可爱'],
      '大气': ['霸王', '将军', '老大', '皇帝', '大王', '骑士', '王子', '公主', '霸总', '大侠', '英雄', '闪电', '雷神', '战神', '国王', '天王']
    },
    meanings: ['寓意健康长寿，快乐成长', '象征招财进宝，福气满满', '朗朗上口，叫起来特别亲切', '寓意聪明伶俐，活泼可爱', '独一无二，充满个性', '取自美食，软萌又好吃', '寓意好运连连，幸福相伴', '简单好记，宠物一听就懂']
  },
  '店铺': {
    surnames: [''],
    words: {
      '古风': ['云栖', '听雨', '拾光', '半山', '归隐', '清欢', '墨香', '竹里', '桃源', '静谧', '如初', '拾贰', '南巷', '北屿', '初见', '余生'],
      '现代': ['遇见', '初见', '美好', '时光', '小筑', '优选', '良品', '生活', '日记', '拾光', '简爱', '一米', '晴天', '微光', '初心', '本味'],
      '可爱': ['喵喵', '朵朵', '甜甜', '布丁', '糖果', '萌萌', '小屋', '芝士', '泡芙', '奶盖', '桃桃', '莓莓', '啵啵', '元气', '软软', 'bean'],
      '大气': ['盛世', '华章', '鼎盛', '环球', '卓越', '领航', '巅峰', '宏图', '嘉业', '汇通', '万佳', '德隆', '昌盛', '瑞丰', '广达', '金源']
    },
    meanings: ['寓意生意兴隆，财源广进', '名字独特，容易让人记住', '文艺范十足，吸引年轻客群', '朗朗上口，传播力强', '寓意顾客盈门，好评如潮', '格调高雅，提升品牌调性', '简洁有力，利于口碑传播', '寓意财气源于好名字']
  }
};

async function generateNames(params) {
  const { type, keyword, style, count } = params;
  const aiResult = await callAI(
    `请为"${type}"取${count}个"${style}"风格的名字，${keyword ? '包含或关联"' + keyword + '"元素，' : ''}每个名字附上简短寓意，格式为：名字 - 寓意，直接换行分隔。`,
    '你是资深命名大师，擅长起寓意美好、朗朗上口的名字。'
  );
  if (aiResult) return aiResult.split('\n').filter(Boolean).map(s => s.trim());

  const data = NAME_DATA[type] || NAME_DATA['宝宝'];
  const words = data.words[style] || data.words['现代'];
  const selected = pickMany(words, Math.min(count, words.length));
  const results = [];
  for (let i = 0; i < count; i++) {
    const word = selected[i % selected.length];
    let name;
    if (type === '宝宝') {
      // 关键词（1-2字）作为姓氏，否则随机姓氏，保证"姓+名"结构
      const surname = (keyword && keyword.length <= 2) ? keyword : pick(data.surnames);
      name = surname + word;
    } else {
      // 宠物 / 店铺：关键词作为前缀融入
      name = (keyword ? keyword : '') + word;
    }
    results.push(`${name}  —— ${pick(data.meanings)}`);
  }
  return results;
}

/* ============================================
   4. 周报总结生成器
   ============================================ */
const WEEKLY_SECTIONS = {
  '简洁': {
    done: ['完成{topic}相关工作，推进顺利', '{topic}按计划落地，达成预期', '高效完成{topic}，质量达标'],
    progress: ['{topic}持续跟进中，进展良好', '{topic}进入收尾阶段'],
    next: ['继续推进{topic}，确保按时交付', '优化{topic}流程，提升效率'],
    summary: ['本周工作节奏紧凑，各项任务有序推进。', '整体进展符合预期，下周继续努力。']
  },
  '详细': {
    done: [
      '1. 主导{topic}项目，完成需求梳理与方案制定，已同步相关方；',
      '2. 推进{topic}落地执行，协调资源解决关键问题，完成既定目标；',
      '3. 参与{topic}相关会议，输出会议纪要并跟进待办事项；'
    ],
    progress: [
      '1. {topic}优化方案已完成初稿，待评审后进入实施；',
      '2. 跨部门协作的{topic}事项正在推进，预计下周完成；'
    ],
    next: [
      '1. 完成{topic}的收尾工作，做好复盘总结；',
      '2. 深入优化{topic}流程，进一步提升交付质量与效率；',
      '3. 主动对接需求，提前规划下周重点工作；'
    ],
    summary: ['本周围绕{topic}等核心工作展开，整体推进有序，关键节点均按期完成。工作中也发现了一些可优化的细节，将在下周持续改进。']
  },
  '数据化': {
    done: [
      '完成{topic}相关工作，完成率100%，交付质量达标；',
      '{topic}项目推进取得阶段性成果，核心指标达成预期；',
      '本周共处理{topic}相关事项 N 项，按时完成率 95%+；'
    ],
    progress: [
      '{topic}当前进度 80%，按计划推进，无重大风险；',
      '{topic}数据指标环比提升，趋势向好；'
    ],
    next: [
      '下周目标：{topic}完成度提升至 100%，关键指标再优化；',
      '持续优化{topic}效率，力争各项指标环比增长；'
    ],
    summary: ['本周核心指标整体向好，{topic}相关工作高效完成。下周将聚焦关键目标，进一步提升产出质量与效率。']
  }
};

const WEEKLY_HEADERS = ['📋 本周完成', '🔄 进行中', '📅 下周计划', '💬 工作总结'];

async function generateWeeklyReport(params) {
  const { work, style, name } = params;
  const aiResult = await callAI(
    `请根据以下工作内容，写一份${style}风格的周报，包含"本周完成、进行中、下周计划、工作总结"四个部分：\n${work}`,
    '你是职场写作专家，擅长把零散工作整理成专业、结构清晰的周报。'
  );
  if (aiResult) return [{ title: '完整周报', content: aiResult }];

  // 将用户输入的工作拆成条目，避免整段塞进模板造成语义重复
  const items = work.split(/[，,。；;、\n]+/).map(s => s.trim()).filter(s => s.length > 1);
  const list = items.length ? items : [work.trim()];
  const topic = list[0].length > 12 ? list[0].slice(0, 12) + '…' : list[0];

  let done, progress, next, summary;
  if (style === '详细') {
    done = list.map((it, i) => `${i + 1}. 完成${it}，已同步相关方并跟进落地；`).join('\n');
    progress = '1. 部分工作进入收尾阶段，待最终确认；\n2. 跨部门协作事项持续推进中。';
    next = '1. 完成剩余工作的收尾与复盘；\n2. 优化流程，提升下周交付效率；\n3. 主动对接新需求，提前规划。';
    summary = `本周围绕${topic}等重点工作展开，各项任务推进有序，关键节点按期完成。工作中发现的一些细节问题将在下周持续改进。`;
  } else if (style === '数据化') {
    done = list.map((it, i) => `${i + 1}. ${it} —— 完成率100%，质量达标；`).join('\n');
    progress = '当前整体进度约 80%，核心指标达成预期，无重大风险。';
    next = '1. 推进剩余工作，目标完成度提升至 100%；\n2. 优化关键指标，力争环比提升。';
    summary = `本周共完成 ${list.length} 项重点工作，交付质量达标，核心指标整体向好。下周将聚焦关键目标，进一步提升产出效率。`;
  } else {
    // 简洁
    done = list.map((it, i) => `${i + 1}. ${it}`).join('\n');
    progress = '各项工作按计划推进中，进展顺利。';
    next = '继续推进手头工作，确保按节点交付。';
    summary = `本周工作有序完成，围绕${topic}等事项展开，整体进展符合预期。`;
  }
  return [
    { title: WEEKLY_HEADERS[0], content: done },
    { title: WEEKLY_HEADERS[1], content: progress },
    { title: WEEKLY_HEADERS[2], content: next },
    { title: WEEKLY_HEADERS[3], content: summary }
  ];
}

/* ============================================
   5. 高情商回复助手
   ============================================ */
const EQ_DATA = {
  '同事': {
    '赞美': ['这个项目多亏有你，专业度满分！👍', '跟你合作特别省心，效率太高了。', '你的想法总是很有启发，受益匪浅。'],
    '婉拒': ['谢谢你的信任，不过我这边手头有点排不开，怕耽误你进度，建议找XX会更合适。', '这个我确实不太擅长，硬接反而拖后腿，不好意思哈。'],
    '幽默': ['收到！这就安排，保证比你老板还积极（狗头）。', '没问题，我这个人别的没有，就是靠谱。😎']
  },
  '朋友': {
    '赞美': ['你也太厉害了吧，我服了！', '不愧是你，这事儿也就你能搞定。', '跟你做朋友真是赚到了～'],
    '婉拒': ['真的想去，但这次实在排不开，下次一定！', '我这次就先不凑热闹啦，你们玩开心点！'],
    '幽默': ['你这话说的，我都不好意思拒绝了（笑）。', '行啊，但先说好，到时候别中途把我卖了。😂']
  },
  '恋人': {
    '赞美': ['你今天也太好看了吧，我看到你心情就好了。', '有你在身边，做什么都觉得有意思。', '谢谢你一直包容我，我真的很幸运。'],
    '婉拒': ['我懂你的意思，但今天状态不太好，我们改天好好聊，好吗？', '不是不想答应，是想给你一个更好的我，再等等我。'],
    '幽默': ['遵命，女王大人！👑', '这要求不过分，我答应了，但你要亲我一口作为交换。😘']
  },
  '长辈': {
    '赞美': ['您太厉害了，这些经验我们年轻人得多学学。', '听您一席话，胜读十年书，受教了。', '您这身体保养得真好，精神头比我们还足！'],
    '婉拒': ['谢谢您的好意，不过我这边已经安排好了，您别操心。', '您的心意我领了，但这个我自己能处理，您放心。'],
    '幽默': ['您这话说得我都不好意思了，我哪有那么优秀～', '哈哈您太逗了，跟您聊天总是特别开心。']
  },
  '客户': {
    '赞美': ['您这个想法非常专业，一下就点到关键了。', '和您沟通特别顺畅，合作起来很愉快。', '感谢您的反馈，让我们的产品变得更好。'],
    '婉拒': ['感谢您的提议，不过结合目前情况，我们建议换个方案，我整理好发您参考。', '这个需求我们需要评估一下，给您一个更稳妥的答复，稍等好吗？'],
    '幽默': ['您太懂行了，跟您合作我们省心不少（笑）。', '哈哈您这要求提得专业，我们一定尽力做到最好。']
  },
  '暧昧': {
    '赞美': ['跟你聊天总觉得时间过得特别快。', '你今天穿这件衣服，真的很适合你。', '发现你不仅好看，还特别有趣。'],
    '婉拒': ['谢谢你，我很珍惜我们现在的相处，再慢慢来好吗？', '你人很好，但我现在想先专注自己，希望你理解。'],
    '幽默': ['你这话我可记住了啊，别到时候不认账。😏', '哟，今天嘴巴这么甜，是不是有什么企图？']
  }
};

const EQ_TONES = ['赞美', '婉拒', '幽默'];

async function generateEqReplies(params) {
  const { situation, relation, count } = params;
  const aiResult = await callAI(
    `场景：${situation}。请以"${relation}"的身份，给出${count}条高情商回复，要得体、自然、有分寸，直接换行分隔。`,
    '你是人际交往专家，擅长各种场景下的高情商话术，回复要真诚不做作。'
  );
  if (aiResult) return aiResult.split('\n').filter(Boolean).map(s => s.replace(/^[\d\-•]+[\.、)]?\s*/, ''));

  const data = EQ_DATA[relation] || EQ_DATA['朋友'];
  const results = [];
  const tones = shuffle(EQ_TONES);
  for (let i = 0; i < count; i++) {
    const tone = tones[i % tones.length];
    const pool = data[tone] || data['赞美'];
    let reply = pick(pool);
    // 当输入包含具体场景时，尝试让回复更贴合（轻微改写）
    if (situation && situation.length > 4 && i === 0) {
      reply = reply + `\n（针对"${situation.length > 15 ? situation.slice(0, 15) + '…' : situation}"）`;
    }
    results.push(`【${tone}】${reply}`);
  }
  return results;
}

/* ============================================
   生成调度中心
   ============================================ */
const GENERATORS = {
  'moments': generateMoments,
  'xiaohongshu-title': generateXiaohongshuTitle,
  'name': generateNames,
  'weekly-report': generateWeeklyReport,
  'eq-reply': generateEqReplies
};

async function generate(toolSlug, params) {
  const fn = GENERATORS[toolSlug];
  if (!fn) throw new Error('未知工具: ' + toolSlug);
  return await fn(params);
}
