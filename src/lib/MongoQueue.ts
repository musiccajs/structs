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

  constructor(manager: QueueManager<Queue>, id: string, { model }: { model: Model<IQueue> }) {
    super(manager, id);
    this.id = id;
    this.db = model;
    this.connect(model);
  }

  private async connect(model: Model<IQueue>) {
    const doc = await this.db.findById(this.id);
    // eslint-disable-next-line new-cap
    const mod = new model({
      _id: this.id
    });
    mod.isNew = !doc;
    mod.markModified('list');
    await mod.save();
  }

  public async all() {
    const a = (await this.db.findById(this.id))?.list;
    return this.reconstructMedia(a);
  }

  public async add<T extends Media | Media[] = Media>(media: T, position?: number) {
    const wrap = Array.isArray(media) ? media : [media];

    const coll = await this.db.findById(this.id);
    if (!(position === null || position === undefined)) coll?.list.splice(position as number, 0, ...wrap);
    else coll?.list.push(...wrap);

    coll?.markModified('list');
    await coll?.save();

    return media;
  }

  public async get(position: number) {
    return this.reconstructMedia((await this.db.findById(this.id))?.list[position])[0];
  }

  public async remove(position: number) {
    const a = await this.db.findById(this.id);
    const x = a?.list.splice(position, 1)[0];
    a?.markModified('list');
    await a?.save();
    return this.reconstructMedia(x)[0];
  }

  public async clear() {
    const a = await this.db.findById(this.id);
    const x = a as IQueue;
    x.list = [];
    a?.markModified('list');
    await a?.save();
  }

  public async indexOf(media: Media) {
    const a = await this.db.findById(this.id);
    return a?.list.indexOf(media) ?? -1;
  }

  private reconstructMedia(media: Media | Media[] | undefined) {
    const wrap = Array.isArray(media) ? media : [media];
    const reconstructed: Media[] = [];
    wrap.forEach((m) => {
      if (!m) return;
      const extractor = this.manager.client.extractors.get(m.extractor.id);
      if (!extractor) return;
      reconstructed.push(new Media(extractor, m.url, m.data, m.id));
    });
    return reconstructed;
  }
}