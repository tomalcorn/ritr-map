let sectors = {};

// Load sector data when the page loads
fetch('static/sector_data.json')
    .then(response => response.json())
    .then(data => {
        sectors = data;
        console.log('Sectors data loaded:', sectors); // Debugging statement
    })
    .catch(error => {
        console.error('Failed to load sector data:', error);
    });
    
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
            displayDiplomat(diplomatType, i);
            document.body.removeChild(popup);
            document.body.removeChild(overlay);
        });
        popup.appendChild(button);
    }

    // Append the overlay and popup to the body
    document.body.appendChild(overlay);
    document.body.appendChild(popup);
}

// Function to display a single diplomat on the map
function displayDiplomat(diplomatType, sector) {
    const faction = diplomatType.toLowerCase();
    const sectorData = sectors[faction][sector];
    
    const scaledX = sectorData.x * scaleX + offsetX;
    const scaledY = sectorData.y * scaleY + offsetY;
    const dipSticker = document.createElement('img');
    dipSticker.src = `static/stickers/${diplomatType}_dip.png`;
    dipSticker.classList.add('diplomat-token');
    dipSticker.style.position = 'absolute';
    dipSticker.style.width = '35px';
    dipSticker.style.height = '35px';
    dipSticker.style.left = `${scaledX}px`;
    dipSticker.style.top = `${scaledY}px`;
    document.getElementById('map-container').appendChild(dipSticker);
}

// Function to update sector_data.json on the backend
async function updateDiplomats(diplomatType, sector, status = "True") {
    const faction = diplomatType.toLowerCase();
    if (!sectors[faction] || !sectors[faction][sector]) {
        console.error(`Sector data not found for ${faction} sector ${sector}`); // Debugging statement
        return;
    }
    sectors[faction][sector].status = status;
    const response = await fetch('/update_sector_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            faction: faction,
            sector: sector.toString(),
            status: status
        })
    });
    if (!response.ok) {
        console.error('Failed to update sector data');
    }
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
document.getElementById('clear-diplomats').addEventListener('click', async () => {
    for (const faction in sectors) {
        for (const sector in sectors[faction]) {
            await updateDiplomats(faction, sector, "False");
        }
    }
    // Remove all diplomat tokens from the map
    document.querySelectorAll('.diplomat-token').forEach(token => token.remove());
});