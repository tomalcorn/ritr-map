const lockButton = document.getElementById('lock-map-btn');
const mapContainer = document.getElementById('map-container');
let isLocked = false; // Default: map is interactive

lockButton.addEventListener('click', () => {
    isLocked = !isLocked; // Toggle state

    if (isLocked) {
        mapContainer.style.pointerEvents = 'none'; // Disable interactions
        lockButton.textContent = 'Unlock Map';
    } else {
        mapContainer.style.pointerEvents = 'auto'; // Enable interactions
        lockButton.textContent = ' Lock Map ';
    }

    // Save the lock state to the backend
    saveLockState(isLocked);
});

// Function to send lock state to the backend
function saveLockState(locked) {
    fetch('/update-lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locked })
    });
}

// Function to load lock state on page load
async function loadLockState() {
    const response = await fetch('/get-lock');
    const data = await response.json();
    isLocked = data.locked;

    mapContainer.style.pointerEvents = isLocked ? 'none' : 'auto';
    lockButton.textContent = isLocked ? 'Unlock Map' : 'Lock Map';
}

// Load state when the page loads
window.addEventListener('load', loadLockState);