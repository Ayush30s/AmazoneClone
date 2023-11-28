export function formatCurrency(priceCents) {
    return (Math.round(priceCents) / 100).toFixed(2);
}

// every file can have only one default export and using default export 
// you need not to use {} in the file where we import this files content
export default formatCurrency;