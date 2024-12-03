


function increment(button) {
    let quantityDisplay = button.previousElementSibling;
    let currentValue = parseInt(quantityDisplay.textContent);
    quantityDisplay.textContent = currentValue + 1;
}

function decrement(button) {
    let quantityDisplay = button.nextElementSibling;
    let currentValue = parseInt(quantityDisplay.textContent);
    if (currentValue > 1) {
        quantityDisplay.textContent = currentValue - 1;
    }
}