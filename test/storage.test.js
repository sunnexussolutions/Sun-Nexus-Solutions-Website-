import test from 'node:test';
import assert from 'node:assert/strict';

// Mock browser environment for unit testing
const mockStorage = new Map();
const dispatchedEvents = [];

globalThis.window = {
  dispatchEvent: (event) => dispatchedEvents.push(event)
};
globalThis.CustomEvent = class CustomEvent {
  constructor(type, options = {}) {
    this.type = type;
    this.detail = options.detail;
  }
};
globalThis.Event = class Event {
  constructor(type) {
    this.type = type;
  }
};
globalThis.localStorage = {
  getItem: (key) => mockStorage.get(key) ?? null,
  setItem: (key, val) => mockStorage.set(key, String(val)),
  removeItem: (key) => mockStorage.delete(key),
  clear: () => mockStorage.clear()
};

import { storage } from '../Present Dashboard/src/store/storage/storageAdapter.js';
import { STORAGE_KEYS } from '../Present Dashboard/src/store/storage/storageKeys.js';

test('Storage Adapter - set & get roundtrip', () => {
  mockStorage.clear();
  const testData = { id: 1, name: 'Nexus Hub', active: true };
  const ok = storage.set('USERS', testData);
  assert.equal(ok, true);

  const retrieved = storage.get('USERS', null);
  assert.deepEqual(retrieved, testData);
});

test('Storage Adapter - fallback on missing key', () => {
  mockStorage.clear();
  const fallback = [{ id: 999 }];
  const result = storage.get('NON_EXISTENT_KEY', fallback);
  assert.deepEqual(result, fallback);
});

test('Storage Adapter - corrupt JSON recovery without crash', () => {
  mockStorage.clear();
  mockStorage.set(STORAGE_KEYS.USERS, '{ invalid_json_syntax: 123');
  
  const fallback = [];
  const result = storage.get('USERS', fallback);
  assert.deepEqual(result, fallback);
});

test('Storage Adapter - remove key and dispatch events', () => {
  mockStorage.clear();
  dispatchedEvents.length = 0;

  storage.set('THEME', 'dark');
  assert.equal(dispatchedEvents.length, 1);
  assert.equal(dispatchedEvents[0].type, 'nexus-data-updated');

  storage.remove('THEME');
  assert.equal(storage.get('THEME', null), null);
  assert.equal(dispatchedEvents.length, 2);
});

test('Storage Adapter - clearAll clears registered keys', () => {
  mockStorage.clear();
  storage.set('USERS', [{ id: 1 }]);
  storage.set('THEME', 'light');

  storage.clearAll();
  assert.equal(storage.get('USERS', null), null);
  assert.equal(storage.get('THEME', null), null);
});
