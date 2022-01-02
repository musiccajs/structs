import Musicca from 'musicca';
import { MemoryQueue } from '../src';

const client = new Musicca<MemoryQueue>({
  structs: {
    queue: MemoryQueue
  }
});

describe('initiating client', () => {
  test('should set queue struct to be MemoryQueue', () => {
    expect(client.queues.Struct).toBe(MemoryQueue);
  });
});