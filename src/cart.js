// A tiny shopping-cart pricing module.
// These are *pure functions*: same input -> same output, no network, no UI.
// That is exactly what makes them the easiest thing in the world to unit test.

/**
 * Sum the price * quantity of every item in the cart.
 * @param {{price: number, quantity: number}[]} items
 * @returns {number} subtotal before discount/tax
 */
export function calculateSubtotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

/**
 * Apply a percentage discount to an amount.
 * @param {number} amount
 * @param {number} percent 0-100
 * @returns {number}
 */
export function applyDiscount(amount, percent) {
  // The "error case" — discounts outside 0-100 make no sense, so we reject them.
  // Testing that bad input is rejected is just as important as testing the happy path.
  if (percent < 0 || percent > 100) {
    throw new Error(`Discount percent must be between 0 and 100, got ${percent}`);
  }
  return amount - amount * (percent / 100);
}

/**
 * Full price calculation: subtotal -> discount -> tax, rounded to 2 decimals.
 * @param {{price: number, quantity: number}[]} items
 * @param {{discountPercent?: number, taxPercent?: number}} [options]
 * @returns {number} grand total
 */
export function calculateTotal(items, options = {}) {
  const { discountPercent = 0, taxPercent = 0 } = options;
  const subtotal = calculateSubtotal(items);
  const discounted = applyDiscount(subtotal, discountPercent);
  const withTax = discounted + discounted * (taxPercent / 100);
  return Math.round(withTax * 100) / 100;
}
