import { describe, it, expect } from 'vitest';

// We test a real, public REST API: the Swagger Petstore.
// Its behaviour is described by an OpenAPI/Swagger spec (the machine-readable contract)
// which also powers the "Try it out" Swagger UI at https://petstore.swagger.io/
// API testing = sending HTTP requests and asserting on the status code + JSON body.
const BASE = 'https://petstore.swagger.io/v2';

describe('Swagger Petstore API', () => {
  it('GET /pet/findByStatus returns a list of available pets (200)', async () => {
    const res = await fetch(`${BASE}/pet/findByStatus?status=available`);

    expect(res.status).toBe(200); // the contract says this should succeed
    const pets = await res.json();
    expect(Array.isArray(pets)).toBe(true);
  });

  it('GET /store/inventory returns an object of status counts (200)', async () => {
    const res = await fetch(`${BASE}/store/inventory`);

    expect(res.status).toBe(200);
    const inventory = await res.json();
    expect(typeof inventory).toBe('object');
  });

  it('POST /pet creates a pet, then GET reads it back (write + read)', async () => {
    // Random id so repeated test runs / many students don't collide.
    const id = Math.floor(Math.random() * 900000) + 100000;
    const newPet = { id, name: 'Rex', photoUrls: [], status: 'available' };

    const created = await fetch(`${BASE}/pet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPet),
    });
    expect(created.status).toBe(200);

    const fetched = await fetch(`${BASE}/pet/${id}`);
    expect(fetched.status).toBe(200);
    const pet = await fetched.json();
    expect(pet.name).toBe('Rex');
  });

  it('GET a deleted pet returns 404 (negative test)', async () => {
    // The Petstore is a SHARED public database, so we can't assume any fixed id
    // is missing. Instead we create a pet, delete it, then prove it's gone.
    const id = Math.floor(Math.random() * 900000) + 100000;
    await fetch(`${BASE}/pet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name: 'Temp', photoUrls: [], status: 'available' }),
    });
    await fetch(`${BASE}/pet/${id}`, { method: 'DELETE' });

    const res = await fetch(`${BASE}/pet/${id}`);
    expect(res.status).toBe(404);
  });
});
