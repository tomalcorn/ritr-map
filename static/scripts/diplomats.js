let sectors = {};

// Function to display the popup
function showPopup(diplomatType) {
    // Create the overlay
    let overlay = document.createElement('div');
    overlay.classList.add('overlay');

    // Create the popup container
    let popup = document.createElement('div');
    popup.id = 'popup';
    popup.classList.add('popup');

    // Create the message
    let message = document.createElement('p');
    message.textContent = `In which sector would you like a ${diplomatType} diplomat token?`;
    popup.appendChild(message);

    // Create the buttons
    for (let i = 1; i <= 5; i++) {
        let button = document.createElement('button');
        button.textContent = i;
        button.classList.add('popup-button');
        button.addEventListener('click', () => {
            // Handle the button click
            console.log(`Placing ${diplomatType} token in sector ${i}`);
            updateDiplomats(diplomatType, i);
            displayDiplomats();
            document.body.removeChild(popup);
            document.body.removeChild(overlay);
        });
        popup.appendChild(button);
    }

    // Append the overlay and popup to the body
    document.body.appendChild(overlay);
    document.body.appendChild(popup);
}

// Function to display diplomats on the map
function displayDiplomats() {
    Object.entries(sectors).forEach(([sector, data]) => {
        if (data.empire) {
            displayDiplomat('empire', sector);
        }
        if (data.rebel) {
            displayDiplomat('rebel', sector);
        }
    });
}

// Function to display a single diplomat on the map
function displayDiplomat(diplomatType, sector) {
    const sectorData = sectors[sector];
    const img = document.createElement('img');
    img.src = `static/stickers/${diplomatType}_dip.png`;
    img.classList.add('diplomat-token');
    img.style.left = `${sectorData.x}px`;
    img.style.top = `${sectorData.y}px`;
    document.getElementById('map').appendChild(img);
}

// Function to update sector_data.json on the backend
function updateDiplomats(diplomatType, sector) {
    sectors[sector][diplomatType] = true;
    fetch('/update_sector_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sectors)
    }).then(response => {
        if (!response.ok) {
            console.error('Failed to update sector data');
        }
    });
}

// When rebel diplomat button clicked
document.getElementById('rebel-diplomats').addEventListener('click', () => {
    showPopup('Rebel');
})

// When empire diplomat button clicked
document.getElementById('empire-diplomats').addEventListener('click', () => {
    showPopup('Empire');
})

// When clear diplomats button clicked
document.getElementById('clear-diplomats').addEventListener('click', () => {
    // Clear the diplomats logic here
})

// Load initial diplomat tokens when page loads
fetch('static/sector_data.json')
    .then(response => response.json())
    .then(sectorData => {
        sectors = sectorData;
        displayDiplomats();
    });