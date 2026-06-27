const CAT_COLORS = {
  "料理・キッチン": "#ff6b6b",
  "掃除・洗濯": "#4ecdc4",
  "収納・片付け": "#45b7d1",
  "日常生活・便利": "#f9ca24",
  "仕事・勉強・テック": "#6c63ff"
};

let HACKS = [];
let currentFilter = 'all';
let currentTab = 'all';
let favorites = JSON.parse(localStorage.getItem('fl_favs') || '[]');
let currentModalId = null;

// ===== LOAD DATA =====
function loadHacks() {
  try {
    // LIFE_HACKS_DATA は data.js から読み込まれます
    HACKS = LIFE_HACKS_DATA;
    initCharts();
    applyFilters();
    document.getElementById('lh-statTotal').textContent = HACKS.length;
    document.getElementById('lh-statFav').textContent = favorites.length;
  } catch (error) {
    console.error('Failed to load life hacks:', error);
    document.getElementById('lh-grid').innerHTML = '<p class="lh-empty">データの読み込みに失敗しました。</p>';
  }
}

// ===== CHARTS =====
function initCharts() {
  const cats = Object.keys(CAT_COLORS);
  const counts = cats.map(c => HACKS.filter(h => h.category === c).length);
  const colors = cats.map(c => CAT_COLORS[c]);

  new Chart(document.getElementById('lh-donutChart'), {
    type: 'doughnut',
    data: {
      labels: cats.map(c => c.replace('・', '\n')),
      datasets: [{ data: counts, backgroundColor: colors, borderColor: '#1a1d27', borderWidth: 3 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right', labels: { color: '#9fa3b8', font: { size: 11 }, boxWidth: 12, padding: 10 } }
      }
    }
  });

  new Chart(document.getElementById('lh-barChart'), {
    type: 'bar',
    data: {
      labels: cats.map(c => c.length > 8 ? c.substring(0,8)+'…' : c),
      datasets: [{ data: counts, backgroundColor: colors, borderRadius: 8, borderSkipped: false }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#9fa3b8', font: { size: 10 } }, grid: { color: '#2e3250' } },
        y: { ticks: { color: '#9fa3b8', stepSize: 5 }, grid: { color: '#2e3250' }, min: 0, max: 25 }
      }
    }
  });
}

// ===== FILTER & RENDER =====
function setFilter(cat) {
  currentFilter = cat;
  document.querySelectorAll('.lh-filter-btn').forEach(b => {
    b.classList.toggle('lh-active', b.dataset.cat === cat);
  });
  applyFilters();
}

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.lh-tab-btn').forEach(b => {
    b.classList.toggle('lh-active', b.dataset.tab === tab);
  });
  applyFilters();
}

function applyFilters() {
  const q = document.getElementById('lh-searchInput').value.toLowerCase();
  const sort = document.getElementById('lh-sortSelect').value;

  let data = [...HACKS];
  if (currentTab === 'fav') data = data.filter(h => favorites.includes(h.id));
  if (currentFilter !== 'all') data = data.filter(h => h.category === currentFilter);
  if (q) data = data.filter(h => h.title.toLowerCase().includes(q) || h.description.toLowerCase().includes(q));

  if (sort === 'cat') data.sort((a,b) => a.category.localeCompare(b.category));
  else if (sort === 'title') data.sort((a,b) => a.title.localeCompare(b.title));
  else data.sort((a,b) => a.id - b.id);

  renderGrid(data);
  document.getElementById('lh-resultInfo').innerHTML = `<span>${data.length}</span> 件のライフハックを表示中`;
  document.getElementById('lh-emptyState').style.display = data.length === 0 ? 'block' : 'none';
  document.getElementById('lh-grid').style.display = data.length === 0 ? 'none' : 'grid';
}

function renderGrid(data) {
  const grid = document.getElementById('lh-grid');
  grid.innerHTML = data.map(h => `
    <div class="lh-card" onclick="openModal(${h.id})">
      <div class="lh-card-top">
        <span class="lh-card-num">#${String(h.id).padStart(3,'0')}</span>
        <span class="lh-card-tag lh-tag-${h.category}">${h.category}</span>
      </div>
      <div class="lh-card-title">${h.title}</div>
      <div class="lh-card-desc">${h.description}</div>
      <button class="lh-card-fav ${favorites.includes(h.id)?'lh-active':''}" onclick="toggleFav(event,${h.id})">${favorites.includes(h.id)?'⭐':'☆'}</button>
    </div>
  `).join('');
}

// ===== MODAL =====
function openModal(id) {
  const h = HACKS.find(x => x.id === id);
  currentModalId = id;
  document.getElementById('lh-modalNum').textContent = `#${String(h.id).padStart(3,'0')}`;
  const tag = document.getElementById('lh-modalTag');
  tag.textContent = h.category;
  tag.className = `lh-modal-tag lh-tag-${h.category}`;
  document.getElementById('lh-modalTitle').textContent = h.title;
  document.getElementById('lh-modalDesc').textContent = h.description;
  const btn = document.getElementById('lh-modalFavBtn');
  btn.textContent = favorites.includes(id) ? '⭐ お気に入り済み' : '⭐ お気に入りに追加';
  document.getElementById('lh-modalOverlay').classList.add('lh-open');
}

function closeModal(e) {
  if (!e || e.target === document.getElementById('lh-modalOverlay') || e.currentTarget.classList.contains('lh-modal-close')) {
    document.getElementById('lh-modalOverlay').classList.remove('lh-open');
  }
}

function toggleFavFromModal() {
  if (currentModalId) {
    toggleFavById(currentModalId);
    const btn = document.getElementById('lh-modalFavBtn');
    btn.textContent = favorites.includes(currentModalId) ? '⭐ お気に入り済み' : '⭐ お気に入りに追加';
  }
}

function copyHack() {
  const h = HACKS.find(x => x.id === currentModalId);
  navigator.clipboard.writeText(`【${h.title}】\n${h.description}`).then(() => {
    showToast('コピーしました！');
  });
}

// ===== FAVORITES =====
function toggleFav(e, id) {
  e.stopPropagation();
  toggleFavById(id);
  applyFilters();
}

function toggleFavById(id) {
  if (favorites.includes(id)) favorites = favorites.filter(f => f !== id);
  else favorites.push(id);
  localStorage.setItem('fl_favs', JSON.stringify(favorites));
  document.getElementById('lh-statFav').textContent = favorites.length;
}

// ===== TOAST =====
function showToast(msg) {
  const t = document.getElementById('lh-toast');
  t.textContent = msg;
  t.classList.add('lh-show');
  setTimeout(() => t.classList.remove('lh-show'), 2000);
}

// ===== SCROLL =====
window.addEventListener('scroll', () => {
  const scrollTop = document.getElementById('lh-scrollTop');
  const progressBar = document.getElementById('lh-progressBar');
  const scrolled = window.scrollY;
  const total = document.body.scrollHeight - window.innerHeight;
  const pct = total > 0 ? (scrolled / total) * 100 : 0;
  progressBar.style.width = pct + '%';
  scrollTop.classList.toggle('lh-visible', scrolled > 400);
});

// ===== KEYBOARD =====
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

window.onload = loadHacks;
