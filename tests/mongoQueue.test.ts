import Musicca, { Media, MusiccaError } from 'musicca';
import mongoose, { Connection, Model, model } from 'mongoose';
import { randomBytes } from 'crypto';
import { MongoQueue } from '../src';
import { FooExtractor, RandomReadable } from './classes';
import { schema } from '../src/lib/MongoQueue';

// Test connections and model
let mol = null;
let conn = null;

const client = new Musicca<MongoQueue>({
  plugins: [
    new FooExtractor()
  ],
  structs: {
    queue: MongoQueue
  }
});

describe('connecting to test db', () => {
  test('connecting to mongo', async () => {
    conn = await mongoose.connect('mongodb://localhost/test');
    expect(conn).toBe(Connection);
  });
  test('creating test model', () => {
    mol = model('testqueue', schema);
    expect(mol).toBe(Model);
  });
});

describe('initiating client', () => {
  test('should set queue struct to be MongoQueue', () => {
    expect(client.queues.Struct).toBe(MongoQueue);
  });

  test('should have plugged in extractor', () => {
    expect(client.extractors.get('foo')).toBeInstanceOf(FooExtractor);
    expect(client.extractors.add.bind(client.extractors, new FooExtractor()))
      .toThrowError(MusiccaError.types.DUPLICATE_EXTRACTOR);
  });
});

describe('test queue', () => {
  const queue = client.queues.create({
    model: mol
  }, randomBytes(16).toString('hex'));

  test('should create queue', () => {
    expect(queue).toBeInstanceOf(MongoQueue);
    expect(client.queues.get(queue)).toBe(queue);
  });

  const title = 'very foo';

  test('should add test media', async () => {
    const media = await queue.add(await client.extractors.extract(title));
    expect(media).toBeInstanceOf(Media);
  });

  test('should return a random readable of foo', async () => {
    const media = await queue.get(0);
    expect(media).toBeInstanceOf(Media);
    const stream = (await media.fetch()) as RandomReadable;
    expect(stream).toBeInstanceOf(RandomReadable);
    expect(stream.name).toBe('foo');
  });
});