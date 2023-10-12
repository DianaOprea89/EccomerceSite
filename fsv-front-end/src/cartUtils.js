export function calculateTotalPrice(cartItems) {
    let total = 0;

    cartItems.forEach((item) => {
        const price = parseFloat(item.price);
        if (!isNaN(price)) {
            const count = item.count || 1;
            total += price * count;
        }
    });

    return total;
}

