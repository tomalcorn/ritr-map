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
            document.body.removeChild(popup);
            document.body.removeChild(overlay);
        });
        popup.appendChild(button);
    }

    // Append the overlay and popup to the body
    document.body.appendChild(overlay);
    document.body.appendChild(popup);
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