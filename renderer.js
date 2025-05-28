// DOM elements
const timerDisplay = document.getElementById('timer');
const hoursInput = document.getElementById('hours');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const resetBtn = document.getElementById('reset-btn');

// Timer variables
let countdown;
let totalSeconds = 0;
let isRunning = false;

// Format time as HH:MM:SS
function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0')
    ].join(':');
}

// Update timer display
function updateDisplay() {
    timerDisplay.textContent = formatTime(totalSeconds);
}

// Validate inputs to ensure they're within valid ranges
function validateInputs() {
    // Ensure hours is a non-negative number
    let hours = parseInt(hoursInput.value) || 0;
    if (hours < 0) hours = 0;
    if (hours > 99) hours = 99;
    hoursInput.value = hours;
    
    // Ensure minutes is between 0-59
    let minutes = parseInt(minutesInput.value) || 0;
    if (minutes < 0) minutes = 0;
    if (minutes > 59) minutes = 59;
    minutesInput.value = minutes;
    
    // Ensure seconds is between 0-59
    let seconds = parseInt(secondsInput.value) || 0;
    if (seconds < 0) seconds = 0;
    if (seconds > 59) seconds = 59;
    secondsInput.value = seconds;
    
    // Calculate total seconds
    return (hours * 3600) + (minutes * 60) + seconds;
}

// Start the countdown
function startTimer() {
    if (isRunning) return;
    
    // Get and validate time from inputs
    totalSeconds = validateInputs();
    
    // Check if time is set
    if (totalSeconds <= 0) {
        alert('Please set a time greater than zero.');
        return;
    }
    
    // Update UI state
    isRunning = true;
    startBtn.disabled = true;
    stopBtn.disabled = false;
    
    // Disable inputs while timer is running
    hoursInput.disabled = true;
    minutesInput.disabled = true;
    secondsInput.disabled = true;
    
    // Start countdown
    updateDisplay();
    countdown = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(countdown);
            isRunning = false;
            startBtn.disabled = false;
            stopBtn.disabled = true;
            hoursInput.disabled = false;
            minutesInput.disabled = false;
            secondsInput.disabled = false;
            alert('Countdown complete!');
            return;
        }
        
        totalSeconds--;
        updateDisplay();
    }, 1000);
}

// Stop the countdown
function stopTimer() {
    if (!isRunning) return;
    
    clearInterval(countdown);
    isRunning = false;
    
    // Update UI state
    startBtn.disabled = false;
    stopBtn.disabled = true;
    
    // Re-enable inputs
    hoursInput.disabled = false;
    minutesInput.disabled = false;
    secondsInput.disabled = false;
}

// Reset the countdown
function resetTimer() {
    // Stop the timer if it's running
    if (isRunning) {
        clearInterval(countdown);
        isRunning = false;
    }
    
    // Reset inputs to zero
    hoursInput.value = 0;
    minutesInput.value = 0;
    secondsInput.value = 0;
    totalSeconds = 0;
    
    // Update UI state
    updateDisplay();
    startBtn.disabled = false;
    stopBtn.disabled = true;
    
    // Enable inputs
    hoursInput.disabled = false;
    minutesInput.disabled = false;
    secondsInput.disabled = false;
}

// Add event listeners
startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);

// Input validation on change
hoursInput.addEventListener('change', () => {
    hoursInput.value = Math.max(0, Math.min(99, parseInt(hoursInput.value) || 0));
});

minutesInput.addEventListener('change', () => {
    minutesInput.value = Math.max(0, Math.min(59, parseInt(minutesInput.value) || 0));
});

secondsInput.addEventListener('change', () => {
    secondsInput.value = Math.max(0, Math.min(59, parseInt(secondsInput.value) || 0));
});

// Initialize display
updateDisplay();

