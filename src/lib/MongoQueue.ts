import { Model, Schema } from 'mongoose';
import { Queue, Media, QueueManager } from 'musicca';

export interface IQueue {
  _id: string;
  list: Media[];
}

export const schema = new Schema<IQueue>({
  _id: String,
  list: {
    type: [Object],
    default: []
  }
});

export default class MongoQueue extends Queue {
  public db: Model<IQueue>;

  public id: string;

  constructor(model: Model<IQueue>, manager: QueueManager<Queue>, id: string) {
    super(manager, id);
    this.id = id;
    // eslint-disable-next-line new-cap
    new model({
      _id: this.id,
      list: []
    }).save();
    this.db = model;
  }

  public async all() {
    const a = await this.db.findById(this.id);
    return a?.list ?? [];
  }

  public async add<T extends Media | Media[] = Media>(media: T, position?: number) {
    const wrap = Array.isArray(media) ? media : [media];

    const coll = await this.db.findById(this.id);
    if (!(position === null || position === undefined)) coll?.list.splice(position as number, 0, ...wrap);
    else coll?.list.push(...wrap);

    coll?.markModified('list');
    coll?.save();

    return media;
  }

  public async get(position: number) {
    const a = await this.db.findById(this.id);
    return a?.list[position];
  }

  public async remove(position: number) {
    const a = await this.db.findById(this.id);
    const x = a?.list.splice(position, 1)[0];
    a?.markModified('list');
    a?.save();
    return x;
  }

  public async clear() {
    const a = await this.db.findById(this.id);
    const x = a as IQueue;
    x.list = [];
    a?.markModified('list');
    a?.save();
  }

  public async indexOf(media: Media) {
    const a = await this.db.findById(this.id);
    return a?.list.indexOf(media) ?? -1;
  }
}