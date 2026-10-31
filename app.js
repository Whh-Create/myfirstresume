const experienceRoot = document.querySelector('.experience-list');
const chapterIndex = document.querySelector('.chapter-index');
const storyDialog = document.querySelector('.story-dialog');
const dialogImage = document.querySelector('.dialog-image');
const dialogNumber = document.querySelector('.dialog-number');
const dialogTitle = document.querySelector('#dialog-title');
const dialogPhase = document.querySelector('.dialog-phase');
const dialogText = document.querySelector('.dialog-text');
const dialogPrev = document.querySelector('.dialog-prev');
const dialogNext = document.querySelector('.dialog-next');
let chapters = [];
let activeChapter = 0;
let observedRows = [];
const fallbackMarkdown = String.raw`
# 欣然之家 · 个人经历

## 01 出生在合肥的十八年
2005年出生，0-18岁在合肥长大

## 02 幼儿园的快乐时光
幼儿园

## 03 瑶海区的小学
小学在瑶海区

## 04 庐阳区的初中
初中在庐阳区

## 05 中考旗开得胜
中考取得好成绩

## 06 考入合肥顶尖高中
去了合肥数一数二的高中，信心满满，我们全家都很高兴

## 07 问心无愧的高中三年
结果高中三年的结果并不尽如人意，但是父母和我的付出都很大，我们问心无愧

## 08 西行兰州，大学启程
之后去了兰州上大学

## 09 独自成长的兰州岁月
在这期间个人能力得到空前提升，人格完善，思想较高中成熟许多，远离家乡，事事都靠自己，更加独立自律

## 10 受益终生的人生观
在这期间培养的人生观，价值观受益终生

## 11 大一的认真与专注
大一保持高中作风，认真学习

## 12 初遇王阳明，种子悄然埋下
大一下学期到大二上学期的暑假意外接触王阳明的故事，埋下一颗种子

## 13 住院时的亲情与珍惜
大二上学期食物中毒意外住院，父母从合肥来看我，跑步锻炼暂停，对自己的身体更加重视，更加珍惜

## 14 二十岁，与王阳明重逢
大二下学期，也就是2025年，我20岁，听完百家讲坛《五百年来王阳明》后

## 15 听从内心，未来可期
确定了2025年的年度词汇，或者说大方向，"听从内心，未来可期"

## 16 大三：心态的转变
大三学年继续努力学习，心态转变

## 17 游泳，与更好的自己相遇
同时开始学习游泳，跟过去的自己比，提升自己，投资未来的自己，树立终身学习，终身体育的理念

## 18 自驾318，西藏之旅
大四开学前的暑假，一家人自驾318进藏，与沿海的大城市不同，西藏的风景与人文让我大开眼界，同一个地球，一快一慢，受益匪浅

## 19 意外的保研名额
大四开学准备就业，却意外获得保研名额，保研本校，继续留在兰州

## 20 徐徐打开的新画卷
一段新的人生画卷正在徐徐打开
`;

const phases = [
  { from: 1, to: 5, name: '合肥 · 童年与求学' },
  { from: 6, to: 8, name: '高中 · 走向远方' },
  { from: 9, to: 13, name: '兰州 · 独立生长' },
  { from: 14, to: 17, name: '兰州 · 听从内心' },
  { from: 18, to: 20, name: '远方 · 新的画卷' },
];

function escapeHTML(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function phaseFor(number) {
  return phases.find((phase) => number >= phase.from && number <= phase.to)?.name ?? '成长途中';
}

function parseExperiences(markdown) {
  return markdown.trimEnd().split(/^##\s+/m).slice(1).map((block, index) => {
    const lines = block.split(/\r?\n/);
    const match = lines.shift().trim().match(/^(\d+)\s+(.+)$/);
    if (!match) return null;
    const number = Number(match[1]);
    const rest = lines.join('\n').replace(/^\r?\n/, '').replace(/\n+$/, '');
    const detailStart = rest.search(/^###[ \t]/m);
    const body = (detailStart === -1 ? rest : rest.slice(0, detailStart)).trim();
    const detail = detailStart === -1
      ? ''
      : rest.slice(detailStart).replace(/^###[^\n]*\n?/, '').trim();
    return { number, title: match[2], body, detail, image: `images/${number}.webp`, phase: phaseFor(number), index };
  }).filter(Boolean);
}

function renderParagraphs(text) {
  return text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHTML(paragraph).replace(/\n/g, '<br />')}</p>`)
    .join('');
}

function renderExperiences() {
  chapterIndex.innerHTML = chapters.map((chapter) => `
    <li><a href="#chapter-${chapter.number}" data-index-link="${chapter.number}"><span>${String(chapter.number).padStart(2, '0')}</span>${escapeHTML(chapter.title)}</a></li>
  `).join('');

  experienceRoot.innerHTML = chapters.map((chapter) => `
    <article class="experience-row" id="chapter-${chapter.number}" data-chapter="${chapter.number}">
      <button class="experience-media" type="button" data-open="${chapter.number}" aria-label="查看第 ${chapter.number} 章：${escapeHTML(chapter.title)}">
        <img src="${chapter.image}" alt="${escapeHTML(chapter.title)}" loading="${chapter.number <= 2 ? 'eager' : 'lazy'}" decoding="async" />
        <span class="media-open" aria-hidden="true">↗</span>
      </button>
      <div class="experience-copy">
        <div class="chapter-meta"><strong>${String(chapter.number).padStart(2, '0')}</strong><i></i><span>${escapeHTML(chapter.phase)}</span></div>
        <h3>${escapeHTML(chapter.title)}</h3>
        <p>${escapeHTML(chapter.body)}</p>
        <button class="open-text" type="button" data-open="${chapter.number}">展开这段经历 <span aria-hidden="true">↗</span></button>
      </div>
    </article>
  `).join('');
  observedRows = [...document.querySelectorAll('.experience-row')];
  observeRows();
}

function openChapter(number) {
  const chapter = chapters.find((entry) => entry.number === number);
  if (!chapter) return;
  activeChapter = chapters.indexOf(chapter);
  dialogNumber.textContent = `CHAPTER ${String(chapter.number).padStart(2, '0')} / ${String(chapters.length).padStart(2, '0')}`;
  dialogTitle.textContent = chapter.title;
  dialogPhase.textContent = chapter.phase.toUpperCase();
  dialogText.innerHTML = renderParagraphs(chapter.detail || chapter.body);
  dialogText.scrollTop = 0;
  dialogImage.src = chapter.image;
  dialogImage.alt = chapter.title;
  dialogPrev.disabled = activeChapter === 0;
  dialogNext.disabled = activeChapter === chapters.length - 1;
  if (!storyDialog.open) storyDialog.showModal();
  document.body.classList.add('dialog-open');
}

function closeDialog() {
  if (storyDialog.open) storyDialog.close();
  document.body.classList.remove('dialog-open');
}

experienceRoot.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-open]');
  if (trigger) openChapter(Number(trigger.dataset.open));
});

chapterIndex.addEventListener('click', (event) => {
  const link = event.target.closest('[data-index-link]');
  if (link) setActiveIndex(Number(link.dataset.indexLink));
});

document.querySelector('.dialog-close').addEventListener('click', closeDialog);
storyDialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
storyDialog.addEventListener('click', (event) => {
  if (event.target === storyDialog) closeDialog();
});
storyDialog.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft' && activeChapter > 0) openChapter(chapters[activeChapter - 1].number);
  if (event.key === 'ArrowRight' && activeChapter < chapters.length - 1) openChapter(chapters[activeChapter + 1].number);
});
dialogPrev.addEventListener('click', () => {
  if (activeChapter > 0) openChapter(chapters[activeChapter - 1].number);
});
dialogNext.addEventListener('click', () => {
  if (activeChapter < chapters.length - 1) openChapter(chapters[activeChapter + 1].number);
});

function setActiveIndex(number) {
  chapterIndex.querySelectorAll('a').forEach((link) => {
    const isActive = Number(link.dataset.indexLink) === number;
    link.classList.toggle('is-active', isActive);
    if (isActive) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}

function observeRows() {
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((items) => {
    const visible = items.filter((item) => item.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) setActiveIndex(Number(visible.target.dataset.chapter));
  }, { rootMargin: '-36% 0px -52% 0px', threshold: [0, .2, .5, .8] });
  observedRows.forEach((row) => observer.observe(row));
}

async function loadExperiences() {
  try {
    const response = await fetch(`experiences.md?v=${Date.now()}`, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Unable to load experiences.md (${response.status})`);
    chapters = parseExperiences(await response.text());
    if (chapters.length !== 20) throw new Error(`Expected 20 chapters, found ${chapters.length}`);
    renderExperiences();
  } catch (error) {
    chapters = parseExperiences(fallbackMarkdown);
    if (chapters.length === 20) {
      renderExperiences();
      return;
    }
    experienceRoot.innerHTML = '<p class="loading-state">经历暂时无法载入，请检查 experiences.md。</p>';
    console.error(error);
  }
}

const progressFill = document.querySelector('.reading-progress span');
let progressQueued = false;
window.addEventListener('scroll', () => {
  if (progressQueued) return;
  progressQueued = true;
  requestAnimationFrame(() => {
    const range = document.documentElement.scrollHeight - window.innerHeight;
    progressFill.style.width = `${range > 0 ? (window.scrollY / range) * 100 : 0}%`;
    progressQueued = false;
  });
}, { passive: true });

function startStarfield() {
  const canvas = document.querySelector('.starfield');
  const context = canvas.getContext('2d', { alpha: true });
  if (!context) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stars = [];
  const splashes = [];
  let width = 0;
  let height = 0;
  let scale = 1;
  let pointer = { x: .5, y: .5 };
  let lastTime = 0;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    scale = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    context.setTransform(scale, 0, 0, scale, 0, 0);
    const count = Math.min(320, Math.max(120, Math.round(width * height / 4800)));
    stars.length = 0;
    for (let i = 0; i < count; i += 1) {
      stars.push({ x: Math.random(), y: Math.random(), depth: Math.random(), size: .35 + Math.random() * 1.15, phase: Math.random() * Math.PI * 2 });
    }
  }

  function draw(time) {
    const delta = Math.min((time - lastTime) || 16, 40);
    lastTime = time;
    context.clearRect(0, 0, width, height);
    stars.forEach((star) => {
      const drift = reduceMotion ? 0 : Math.sin(time * .00011 + star.phase) * 2.2;
      const x = star.x * width + (pointer.x - .5) * 10 * star.depth;
      const y = (star.y * height + drift + height) % height;
      const alpha = .2 + (Math.sin(time * .001 + star.phase) + 1) * .18;
      context.fillStyle = star.phase > 4.4 ? `rgba(217,235,135,${alpha})` : `rgba(205,224,235,${alpha})`;
      context.beginPath();
      context.arc(x, y, star.size, 0, Math.PI * 2);
      context.fill();
    });

    for (let i = splashes.length - 1; i >= 0; i -= 1) {
      const splash = splashes[i];
      const elapsed = time - splash.start;
      if (elapsed > 1500) { splashes.splice(i, 1); continue; }
      const progress = elapsed / 1500;
      splash.particles.forEach((particle) => {
        const distance = progress * particle.distance;
        const x = splash.x + Math.cos(particle.angle) * distance;
        const y = splash.y + Math.sin(particle.angle) * distance + progress * progress * 18;
        context.globalAlpha = (1 - progress) * particle.alpha;
        context.fillStyle = particle.color;
        context.beginPath();
        context.arc(x, y, Math.max(.3, particle.size * (1 - progress * .55)), 0, Math.PI * 2);
        context.fill();
      });
      context.globalAlpha = 1;
    }
    if (!reduceMotion || splashes.length) requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pointermove', (event) => {
    pointer = { x: event.clientX / Math.max(width, 1), y: event.clientY / Math.max(height, 1) };
  }, { passive: true });
  window.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || event.target.closest('a, button, dialog')) return;
    const colors = ['#f28b70', '#d9eb87', '#bcd9e8', '#f2c96d'];
    splashes.push({
      x: event.clientX,
      y: event.clientY,
      start: performance.now(),
      particles: Array.from({ length: 24 }, () => ({
        angle: Math.random() * Math.PI * 2,
        distance: 45 + Math.random() * 155,
        size: 1 + Math.random() * 3,
        alpha: .28 + Math.random() * .55,
        color: colors[Math.floor(Math.random() * colors.length)],
      })),
    });
    if (reduceMotion && splashes.length === 1) requestAnimationFrame(draw);
  });
  if (!reduceMotion) requestAnimationFrame(draw);
}

loadExperiences();
startStarfield();
