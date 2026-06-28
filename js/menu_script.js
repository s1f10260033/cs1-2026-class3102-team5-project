// ========================================
// 献立メーカー - メインスクリプト
// ========================================

// グローバル変数
let allMenus = [];
let filteredMenus = [];

// ページ読み込み時の処理
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// アプリケーション初期化
function initializeApp() {
    // 献立データを平坦化
    flattenMenuData();
    
    // 献立を表示
    displayMenus(allMenus);
    
    // イベントリスナーを設定
    setupEventListeners();
}

// 献立データを平坦化
function flattenMenuData() {
    allMenus = [];
    for (const category in menuData) {
        menuData[category].forEach(menu => {
            allMenus.push({
                ...menu,
                category: category
            });
        });
    }
    filteredMenus = [...allMenus];
}

// 献立を表示
function displayMenus(menus) {
    const menuGrid = document.getElementById('menu-grid');
    menuGrid.innerHTML = '';

    if (menus.length === 0) {
        menuGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #b0b0b0; padding: 40px;">該当する献立がありません</p>';
        return;
    }

    menus.forEach((menu, index) => {
        const card = createMenuCard(menu, index);
        menuGrid.appendChild(card);
    });
}

// 献立カードを作成
function createMenuCard(menu, index) {
    const card = document.createElement('div');
    card.className = 'menu-card';
    
    const difficultyClass = `difficulty-${menu.difficulty === '初級' ? 'beginner' : menu.difficulty === '中級' ? 'intermediate' : 'advanced'}`;
    
    card.innerHTML = `
        <div class="menu-card-header">
            <h3 class="menu-card-title">${menu.title}</h3>
            <span class="menu-card-category">${menu.category}</span>
        </div>
        
        <div class="menu-card-info">
            <div class="info-item">
                <div class="info-label">調理時間</div>
                <div class="info-value">${menu.time}</div>
            </div>
            <div class="info-item">
                <div class="info-label">費用目安</div>
                <div class="info-value">${menu.cost}</div>
            </div>
            <div class="info-item">
                <div class="info-label">カロリー</div>
                <div class="info-value">${menu.calories}</div>
            </div>
            <div class="info-item">
                <div class="info-label">難易度</div>
                <div class="info-value">
                    <span class="menu-card-difficulty ${difficultyClass}">${menu.difficulty}</span>
                </div>
            </div>
        </div>
        
        <div class="menu-card-action">
            <button class="detail-btn" onclick="showMenuDetail(${index})">詳細を見る</button>
        </div>
    `;
    
    return card;
}

// 献立詳細を表示
function showMenuDetail(index) {
    const menu = filteredMenus[index];
    const modal = document.getElementById('detail-modal');
    const modalBody = document.getElementById('modal-body');
    
    const difficultyClass = `difficulty-${menu.difficulty === '初級' ? 'beginner' : menu.difficulty === '中級' ? 'intermediate' : 'advanced'}`;
    
    const materialsHTML = menu.materials.map(m => `<li>${m}</li>`).join('');
    const stepsHTML = menu.steps.map(s => `<li>${s}</li>`).join('');
    
    modalBody.innerHTML = `
        <h2 class="modal-title">${menu.title}</h2>
        
        <div class="modal-section">
            <h3 class="modal-section-title">基本情報</h3>
            <div class="modal-info-grid">
                <div class="modal-info-box">
                    <div class="modal-info-label">カテゴリー</div>
                    <div class="modal-info-value">${menu.category}</div>
                </div>
                <div class="modal-info-box">
                    <div class="modal-info-label">調理時間</div>
                    <div class="modal-info-value">${menu.time}</div>
                </div>
                <div class="modal-info-box">
                    <div class="modal-info-label">費用目安</div>
                    <div class="modal-info-value">${menu.cost}</div>
                </div>
                <div class="modal-info-box">
                    <div class="modal-info-label">カロリー</div>
                    <div class="modal-info-value">${menu.calories}</div>
                </div>
                <div class="modal-info-box">
                    <div class="modal-info-label">難易度</div>
                    <div class="modal-info-value">
                        <span class="menu-card-difficulty ${difficultyClass}">${menu.difficulty}</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="modal-section">
            <h3 class="modal-section-title">材料</h3>
            <ul class="materials-list">
                ${materialsHTML}
            </ul>
        </div>
        
        <div class="modal-section">
            <h3 class="modal-section-title">作り方</h3>
            <ol class="steps-list">
                ${stepsHTML}
            </ol>
        </div>
        
        <div class="modal-section">
            <h3 class="modal-section-title">ポイント</h3>
            <div class="points-box">
                <strong>💡 ${menu.points}</strong>
            </div>
        </div>
        
        <div class="modal-section">
            <h3 class="modal-section-title">合わせやすい副菜・汁物</h3>
            <div class="recommendations">
                <div class="recommendation-box">
                    <h4>合う副菜</h4>
                    <ul>
                        ${menu.side_dishes.map(d => `<li>${d}</li>`).join('')}
                    </ul>
                </div>
                <div class="recommendation-box">
                    <h4>合う汁物</h4>
                    <ul>
                        ${menu.soups.map(s => `<li>${s}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('show');
}

// イベントリスナーを設定
function setupEventListeners() {
    // フィルタリング
    document.getElementById('category-filter').addEventListener('change', applyFilters);
    document.getElementById('time-filter').addEventListener('change', applyFilters);
    document.getElementById('cost-filter').addEventListener('change', applyFilters);
    document.getElementById('difficulty-filter').addEventListener('change', applyFilters);
    document.getElementById('sort-filter').addEventListener('change', applyFilters);
    
    // リセットボタン
    document.getElementById('reset-filters').addEventListener('click', resetFilters);
    
    // モーダル
    const modal = document.getElementById('detail-modal');
    const closeBtn = document.querySelector('.close-btn');
    
    closeBtn.addEventListener('click', function() {
        modal.classList.remove('show');
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.classList.remove('show');
        }
    });
}

// フィルタリングを適用
function applyFilters() {
    const categoryFilter = document.getElementById('category-filter').value;
    const timeFilter = document.getElementById('time-filter').value;
    const costFilter = document.getElementById('cost-filter').value;
    const difficultyFilter = document.getElementById('difficulty-filter').value;
    const sortFilter = document.getElementById('sort-filter').value;
    
    // フィルタリング
    filteredMenus = allMenus.filter(menu => {
        // カテゴリーフィルタ
        if (categoryFilter && menu.category !== categoryFilter) {
            return false;
        }
        
        // 調理時間フィルタ
        if (timeFilter) {
            const timeValue = parseInt(menu.time);
            const filterValue = parseInt(timeFilter);
            if (timeValue > filterValue) {
                return false;
            }
        }
        
        // 費用フィルタ
        if (costFilter) {
            const costValue = parseInt(menu.cost);
            const filterValue = parseInt(costFilter);
            if (costValue > filterValue) {
                return false;
            }
        }
        
        // 難易度フィルタ
        if (difficultyFilter && menu.difficulty !== difficultyFilter) {
            return false;
        }
        
        return true;
    });
    
    // ソート
    applySorting(sortFilter);
    
    // 表示
    displayMenus(filteredMenus);
}

// ソートを適用
function applySorting(sortType) {
    switch(sortType) {
        case 'time-asc':
            filteredMenus.sort((a, b) => {
                const timeA = parseInt(a.time);
                const timeB = parseInt(b.time);
                return timeA - timeB;
            });
            break;
        case 'cost-asc':
            filteredMenus.sort((a, b) => {
                const costA = parseInt(a.cost);
                const costB = parseInt(b.cost);
                return costA - costB;
            });
            break;
        case 'calories-asc':
            filteredMenus.sort((a, b) => {
                const caloriesA = parseInt(a.calories);
                const caloriesB = parseInt(b.calories);
                return caloriesA - caloriesB;
            });
            break;
        default:
            // デフォルト順序
            break;
    }
}

// フィルタをリセット
function resetFilters() {
    document.getElementById('category-filter').value = '';
    document.getElementById('time-filter').value = '';
    document.getElementById('cost-filter').value = '';
    document.getElementById('difficulty-filter').value = '';
    document.getElementById('sort-filter').value = 'default';
    
    filteredMenus = [...allMenus];
    displayMenus(filteredMenus);
}
