function updateStats() {
    let counts = {
        'empire presence': 0,
        'empire base': 0,
        'rebel presence': 0,
        'rebel base': 0
    };

    // Count stickers by their status
    Object.values(planets).forEach(planet => {
        if (counts.hasOwnProperty(planet.status)) {
            counts[planet.status]++;
        }
    });

    // Update the table
    document.getElementById('empire-presence-count').textContent = counts['empire presence'];
    document.getElementById('empire-base-count').textContent = counts['empire base'];
    document.getElementById('rebel-presence-count').textContent = counts['rebel presence'];
    document.getElementById('rebel-base-count').textContent = counts['rebel base'];
}