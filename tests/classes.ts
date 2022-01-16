/* eslint-disable max-classes-per-file */
import { Readable } from 'stream';
import { randomBytes } from 'crypto';
import { Extractor, Media } from 'musicca';

export class RandomReadable extends Readable {
  public readonly name: string;

  constructor(name: string) {
    super();

    this.name = name;
  }

  // eslint-disable-next-line no-underscore-dangle
  public _read(size: number): void {
    this.push(randomBytes(size));
  }
}

export class FooExtractor extends Extractor {
  constructor() {
    super('foo-extractor', undefined, 'foo');
  }

  validate(input: string) {
    return /foo$/.test(input);
  }

  extract(input: string): Media {
    return new Media(this, `https://foo.example.com/${input}`, {
      title: input
    }, 'foo');
  }

  fetch() {
    return new RandomReadable('foo');
  }
}