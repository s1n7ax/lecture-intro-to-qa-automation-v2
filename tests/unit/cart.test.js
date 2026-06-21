import { describe, it, expect } from 'vitest';
import { calculateSubtotal, applyDiscount, calculateTotal } from '../../src/cart.js';

// A test file mirrors the code it tests. Each `it(...)` is one fact we are asserting.
// Read these out loud — they describe how the cart is *supposed* to behave.

describe('calculateSubtotal', () => {
  it('sums price * quantity for every item', () => {
    const items = [
      { price: 10, quantity: 2 }, // 20
      { price: 5, quantity: 3 }, //  15
    ];
    expect(calculateSubtotal(items)).toBe(35);
  });

  it('returns 0 for an empty cart', () => {
    expect(calculateSubtotal([])).toBe(0);
  });
});

describe('applyDiscount', () => {
  it('takes the right amount off', () => {
    expect(applyDiscount(100, 20)).toBe(80);
  });

  // The negative case: we EXPECT this to throw. A function that silently accepts
  // garbage input is a bug waiting to happen.
  it('rejects a discount above 100%', () => {
    expect(() => applyDiscount(100, 150)).toThrow();
  });
});

describe('calculateTotal', () => {
  it('applies discount then tax', () => {
    const items = [{ price: 100, quantity: 1 }];
    // 100 - 10% = 90, + 8% tax = 97.2
    expect(calculateTotal(items, { discountPercent: 10, taxPercent: 8 })).toBe(97.2);
  });
});
