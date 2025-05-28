// DOM元素
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startResetBtn = document.getElementById('start-reset-btn');
const pauseResumeBtn = document.getElementById('pause-resume-btn');
const pinBtn = document.getElementById('pin-btn');
const restTip = document.getElementById('rest-tip');
const confirmBtnWrapper = document.getElementById('confirm-btn-wrapper');
const confirmBtn = document.getElementById('confirm-btn');

// 状态变量
let timer = null;
let isRunning = false;
let isPaused = false;
let isRest = false;
let isPinned = false;
let workDuration = 45 * 60; // 45分钟
let restDuration = 10 * 60; // 10分钟
let currentSeconds = workDuration;
let flashInterval = null;

function updateDisplay() {
    const min = Math.floor(currentSeconds / 60).toString().padStart(2, '0');
    const sec = (currentSeconds % 60).toString().padStart(2, '0');
    minutesDisplay.textContent = min;
    secondsDisplay.textContent = sec;
}

function setFlashing(enable) {
    if (enable) {
        let flag = false;
        flashInterval = setInterval(() => {
            document.body.style.background = flag ? 'linear-gradient(135deg, #fff 0%, #e74c3c 100%)' : 'linear-gradient(135deg, #e74c3c 0%, #fff 100%)';
            flag = !flag;
        }, 400);
    } else {
        clearInterval(flashInterval);
        document.body.style.background = '';
    }
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    isPaused = false;
    pauseResumeBtn.textContent = '暂停';
    startResetBtn.textContent = '重置倒计时';
    pauseResumeBtn.disabled = false;
    timer = setInterval(() => {
        if (!isPaused) {
            if (currentSeconds > 0) {
                currentSeconds--;
                updateDisplay();
            } else {
                clearInterval(timer);
                isRunning = false;
                pauseResumeBtn.disabled = true;
                setFlashing(true);
                confirmBtnWrapper.style.display = '';
                if (!isRest) {
                    startResetBtn.disabled = true;
                }
            }
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    setFlashing(false);
    isRunning = false;
    isPaused = false;
    pauseResumeBtn.textContent = '暂停';
    pauseResumeBtn.disabled = false;
    startResetBtn.textContent = '开始倒计时';
    startResetBtn.disabled = false;
    confirmBtnWrapper.style.display = 'none';
    restTip.style.display = 'none';
    isRest = false;
    currentSeconds = workDuration;
    updateDisplay();
}

function pauseOrResume() {
    if (!isRunning) return;
    isPaused = !isPaused;
    pauseResumeBtn.textContent = isPaused ? '继续倒计时' : '暂停';
}

function enterRest() {
    setFlashing(false);
    confirmBtnWrapper.style.display = 'none';
    restTip.style.display = '';
    isRest = true;
    currentSeconds = restDuration;
    updateDisplay();
    startResetBtn.textContent = '重置倒计时';
    startResetBtn.disabled = true;
    pauseResumeBtn.disabled = false;
    isRunning = false;
    isPaused = false;
    setTimeout(() => {
        startTimer();
    }, 500);
}

function finishRest() {
    setFlashing(false);
    restTip.style.display = 'none';
    confirmBtnWrapper.style.display = 'none';
    isRest = false;
    currentSeconds = 0;
    updateDisplay();
    startResetBtn.textContent = '开始倒计时';
    startResetBtn.disabled = false;
    pauseResumeBtn.disabled = true;
}

startResetBtn.addEventListener('click', () => {
    if (!isRunning && !isRest) {
        // 开始工作倒计时
        currentSeconds = workDuration;
        updateDisplay();
        startTimer();
    } else {
        // 重置
        resetTimer();
    }
});

pauseResumeBtn.addEventListener('click', pauseOrResume);

confirmBtn.addEventListener('click', () => {
    if (!isRest) {
        // 进入休息
        enterRest();
    } else {
        // 休息结束
        finishRest();
    }
});

// 休息倒计时结束自动弹确认
function checkRestEnd() {
    if (isRest && currentSeconds === 0) {
        clearInterval(timer);
        isRunning = false;
        pauseResumeBtn.disabled = true;
        setFlashing(true);
        confirmBtnWrapper.style.display = '';
        confirmBtn.textContent = '确认';
    }
}
setInterval(checkRestEnd, 500);

// 置顶按钮交互
function setPinBtnState(pinned) {
    isPinned = pinned;
    pinBtn.classList.toggle('pinned', isPinned);
}

// 支持主进程返回置顶状态
if (window.electronAPI && window.electronAPI.getAlwaysOnTop) {
    window.electronAPI.getAlwaysOnTop().then(setPinBtnState);
}

pinBtn.addEventListener('click', () => {
    isPinned = !isPinned;
    setPinBtnState(isPinned);
    if (window.electronAPI && window.electronAPI.setAlwaysOnTop) {
        window.electronAPI.setAlwaysOnTop(isPinned);
    }
});

// 初始化
resetTimer();

