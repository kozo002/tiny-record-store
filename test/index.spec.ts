import { createRecordStore } from '../src/index';

it('always true', () => {
  expect(typeof createRecordStore).toBe('function');
});