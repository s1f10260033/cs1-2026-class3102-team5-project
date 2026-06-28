// ========================================
// 家事タイマー - JavaScriptロジック
// ========================================

// グローバル変数
let currentChoreId = 1;
let timerInterval = null;
let isRunning = false;
let remainingTime = 1727; // 28:47 in seconds

// 家事データ
const choreData = {
    1: { name: '洗濯', icon: '🧺', duration: 1800, location: '洗濯機を回す' },
    2: { name: '食器洗い', icon: '🍽️', duration: 1500, location: 'キッチン' },
    3: { name: '掃除', icon: '🧹', duration: 1800, location: 'リビング・廊下' },
    4: { name: 'トイレ掃除', icon: '🧽', duration: 900, location: 'トイレ' },
    5: { name: '料理', icon: '🍳', duration: 2400, location: 'キッチン' },
    6: { name: 'ゴミ出し', icon: '🗑️', duration: 600, location: '玄関・定期タスク' }
};

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    updateDisplay();
});

// アプリ初期化
function initializeApp() {
    remainingTime = choreData[currentChoreId].duration;
    updateDisplay();
}

// イベントリスナー設定
function setupEventListeners() {
    // サイドバー家事選択
    document.querySelectorAll('.chore-item').forEach(item => {
        item.addEventListener('click', function() {
            selectChore(this.dataset.choreId);
        });
    });

    // コントロールボタン
    document.getElementById('pauseBtn').addEventListener('click', toggleTimer);
    document.getElementById('resetBtn').addEventListener('click', resetTimer);
    document.getElementById('skipBtn').addEventListener('click', skipTask);

    // 新規タイマー追加ボタン
    document.getElementById('addChoreBtn').addEventListener('click', addNewChore);
}

// 家事選択
function selectChore(choreId) {
    currentChoreId = parseInt(choreId);
    
    // アクティブ状態を更新
    document.querySelectorAll('.chore-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-chore-id="${choreId}"]`).classList.add('active');

    // タイマーをリセット
    stopTimer();
    remainingTime = choreData[currentChoreId].duration;
    updateDisplay();
}

// タイマー開始/一時停止
function toggleTimer() {
    if (isRunning) {
        stopTimer();
    } else {
        startTimer();
    }
}

// タイマー開始
function startTimer() {
    isRunning = true;
    document.getElementById('pauseBtn').textContent = '⏸ Pause';
    
    timerInterval = setInterval(function() {
        if (remainingTime > 0) {
            remainingTime--;
            updateDisplay();
        } else {
            completeTask();
        }
    }, 1000);
}

// タイマー停止
function stopTimer() {
    isRunning = false;
    document.getElementById('pauseBtn').textContent = '▶ Start';
    clearInterval(timerInterval);
}

// タイマーリセット
function resetTimer() {
    stopTimer();
    remainingTime = choreData[currentChoreId].duration;
    updateDisplay();
}

// タスクスキップ
function skipTask() {
    stopTimer();
    completeTask();
}

// タスク完了
function completeTask() {
    stopTimer();
    
    // 完了メッセージ
    alert(`✓ ${choreData[currentChoreId].name}が完了しました！`);
    
    // 次の家事に移動
    const nextChoreId = currentChoreId < 6 ? currentChoreId + 1 : 1;
    selectChore(nextChoreId);
}

// 新規家事追加
function addNewChore() {
    const choreName = prompt('新しい家事の名前を入力してください:');
    if (choreName) {
        const newId = Math.max(...Object.keys(choreData).map(Number)) + 1;
        choreData[newId] = {
            name: choreName,
            icon: '✓',
            duration: 1800,
            location: '未設定'
        };
        
        // UIに追加
        const choreList = document.getElementById('choreList');
        const newItem = document.createElement('li');
        newItem.className = 'chore-item';
        newItem.dataset.choreId = newId;
        newItem.innerHTML = `
            <span class="chore-icon">✓</span>
            <span class="chore-name">${choreName}</span>
        `;
        newItem.addEventListener('click', function() {
            selectChore(newId);
        });
        choreList.appendChild(newItem);
        
        alert(`${choreName}を追加しました！`);
    }
}

// 表示更新
function updateDisplay() {
    // 現在のタスク情報を更新
    const chore = choreData[currentChoreId];
    document.getElementById('currentTaskIcon').textContent = chore.icon;
    document.getElementById('currentTaskName').textContent = chore.name;
    
    // タイマー表示を更新
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    document.getElementById('timerDisplay').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    // プログレスリングを更新
    updateProgressRing();
}

// プログレスリング更新
function updateProgressRing() {
    const circle = document.querySelector('.progress-ring-circle');
    const totalDuration = choreData[currentChoreId].duration;
    const circumference = 2 * Math.PI * 90; // radius = 90
    
    const progress = (totalDuration - remainingTime) / totalDuration;
    const offset = circumference * (1 - progress);
    
    circle.style.strokeDashoffset = offset;
}

// ページを離れる時の確認
window.addEventListener('beforeunload', function(e) {
    if (isRunning) {
        e.preventDefault();
        e.returnValue = '';
    }
});
