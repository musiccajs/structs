import Musicca, { Media, MusiccaError } from 'musicca';
import mongoose, { Model, model, Mongoose } from 'mongoose';
import { randomBytes } from 'crypto';
import { IMongoQueue, MongoQueue } from '../src';
import { FooExtractor, RandomReadable } from './classes';

// Test connections and model
let mol: Model<IMongoQueue> = null;
let conn: Mongoose = null;

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
    expect(conn).toBe(Mongoose);
  });
  test('creating test model', () => {
    mol = model('testqueue', MongoQueue.schema);
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
    const extracted = await client.extractors.extract(title);
    if (!extracted) return;
    const media = await queue.add(extracted);
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