const scaleX = 0.3386;
const scaleY = 0.3396;
const offsetX = 20.15;
const offsetY = 16.875;
let planets = {};

function displaySticker(planetName, planet) {
    const scaledX = planet.x * scaleX + 3.2;
    const scaledY = planet.y * scaleY;

    const stickerPath = getStickerPath(planet.status);
    const sticker = document.createElement('img');
    sticker.src = stickerPath;
    sticker.className = 'planet-sticker';
    sticker.dataset.planet = planetName;
    sticker.style.position = 'absolute';
    sticker.style.width = '35px';
    sticker.style.height = '35px';
    sticker.style.left = `${scaledX}px`;
    sticker.style.top = `${scaledY}px`;
    mapContainer.appendChild(sticker);
}

function getStickerPath(status) {
    const paths = {
        'rebel presence': '/static/stickers/rebel_pres.png',
        'empire presence': '/static/stickers/empire_pres.png',
        'rebel base': '/static/stickers/rebel_base.png',
        'empire base': '/static/stickers/empire_base.png'
    };
    return paths[status];
}

function findClosestPlanet(clickX, clickY, maxDistance = 50) {
    for (const [name, planet] of Object.entries(planets)) {
        const scaledX = planet.x * scaleX + offsetX;
        const scaledY = planet.y * scaleY + offsetY;

        const distance = Math.sqrt(
            Math.pow(clickX - scaledX, 2) + 
            Math.pow(clickY - scaledY, 2)
        );

        if (distance <= maxDistance) {
            return { name, ...planet };
        }
    }
    return null;
}

function createStickerSelectionBox(planet) {
    const box = document.createElement('div');
    box.className = 'sticker-selection-box';
    box.style.position = 'absolute';
    box.style.border = '1px solid black';
    box.style.backgroundColor = 'white';
    box.style.padding = '10px';
    box.style.display = 'flex';
    box.style.gap = '10px';

    const scaledX = planet.x * scaleX + offsetX;
    const scaledY = planet.y * scaleY + offsetY;

    // Position box based on right/bottom flags
    const boxWidth = 160; // Approximate width of selection box
    const boxHeight = 50; // Approximate height of selection box
    const spacing = 20; // Space between box and planet

    box.style.left = planet.right ? 
    `${scaledX - boxWidth - spacing}px` : 
    `${scaledX + spacing}px`;
    box.style.top = planet.bottom ? 
    `${scaledY - boxHeight - spacing - 30}px` : 
    `${scaledY + spacing}px`;

    // Create a glowing circle around the planet
    const glowCircle = document.createElement('div');
    glowCircle.className = 'glow-circle';
    glowCircle.style.position = 'absolute';
    glowCircle.style.width = '33.5px';   // Adjust size as needed
    glowCircle.style.height = '33.5px';
    glowCircle.style.borderRadius = '50%';
    glowCircle.style.border = '2px solid yellow';
    glowCircle.style.boxShadow = '0px 0px 15px 5px yellow';
    glowCircle.style.left = `${scaledX - 20}px`;  // Centered around planet
    glowCircle.style.top = `${scaledY - 18}px`;

    mapContainer.appendChild(glowCircle);

    const stickers = [
        { name: 'Neutral', path: '/static/stickers/neutral.png' },
        { name: 'Empire Base', path: '/static/stickers/empire_base.png' },
        { name: 'Empire Presence', path: '/static/stickers/empire_pres.png' },
        { name: 'Rebel Base', path: '/static/stickers/rebel_base.png' },
        { name: 'Rebel Presence', path: '/static/stickers/rebel_pres.png' }
    ];

    stickers.forEach(stickerType => {
        const stickerWrapper = document.createElement('div');
        stickerWrapper.style.display = 'flex';
        stickerWrapper.style.flexDirection = 'column';
        stickerWrapper.style.alignItems = 'center';
        stickerWrapper.style.width = '35px';  // Fixed width to maintain uniform layout

        const stickerOption = document.createElement('img');
        stickerOption.src = stickerType.path;
        stickerOption.style.width = '35px';
        stickerOption.style.height = '35px';
        stickerOption.style.cursor = 'pointer';

        stickerOption.onclick = () => {
            updatePlanetSticker(planet.name, stickerType.name.toLowerCase());

            planets[planet.name].status = stickerType.name.toLowerCase(); 


            const existingSticker = document.querySelector(`[data-planet="${planet.name}"]`);
            if (existingSticker) {
                existingSticker.remove();
            }

            if (stickerType.name.toLowerCase() !== 'neutral') {
                const newSticker = document.createElement('img');
                newSticker.src = stickerType.path;
                newSticker.className = 'planet-sticker';
                newSticker.dataset.planet = planet.name;
                newSticker.style.position = 'absolute';
                newSticker.style.width = '35px';
                newSticker.style.height = '35px';
                newSticker.style.left = `${scaledX - 15}px`;
                newSticker.style.top = `${scaledY - 15}px`;
                mapContainer.appendChild(newSticker);
            }

            box.remove();
            glowCircle.remove(); // Remove glow when selection box closes

            updateStats();
        };

        const stickerLabel = document.createElement('div');
        stickerLabel.textContent = stickerType.name;
        stickerLabel.style.fontSize = '10px';
        stickerLabel.style.textAlign = 'center';
        stickerLabel.style.fontFamily = '"Gill Sans", sans-serif'; // change font here

        stickerWrapper.appendChild(stickerOption);
        stickerWrapper.appendChild(stickerLabel);
        box.appendChild(stickerWrapper);
    });

    mapContainer.appendChild(box);
}

// Function to wait between requests
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Update a single planet with retry logic
async function updatePlanetSticker(planetName, status) {
    try {
        const response = await fetch('/update_planet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ planet: planetName, status })
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        console.log(`Updated ${planetName} successfully`);

        return await response.json();
    } catch (error) {
        console.error(`Failed to update ${planetName}:`, error);
    }
}

// Clear all stickers and update backend
document.getElementById('clear-stickers-btn').addEventListener('click', async () => {
    try {
        // Remove all sticker elements from the DOM
        document.querySelectorAll('.planet-sticker').forEach(sticker => sticker.remove());

        const planetNames = Object.keys(planets);
        console.log(`Starting to clear ${planetNames.length} planets...`);

        // First, update all local state immediately
        for (const planetName of planetNames) {
            planets[planetName].status = 'neutral';
        }
        
        // Update stats display immediately after local updates
        updateStats();
        
        // Then, send updates to backend with delays
        for (const planetName of planetNames) {
            try {
                // Send update to backend and wait for completion
                await updatePlanetSticker(planetName, 'neutral');
                
                // Add a small delay between planets to prevent overwhelming the server
                await delay(100); // 100ms delay between planets
            } catch (error) {
                console.error(`Failed to clear ${planetName}:`, error);
                // Continue with other planets even if one fails
            }
        }

        console.log('Finished clearing all stickers');
    } catch (error) {
        console.error('Error in clear stickers operation:', error);
    }
});