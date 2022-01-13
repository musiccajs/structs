<div align="center">
  <img src="https://user-images.githubusercontent.com/34704796/147868696-bf61c114-7b94-41fe-8421-fc9b39c094ba.png" alt="Logo">

  <div>
    <img alt="GitHub" src="https://img.shields.io/github/license/musiccajs/musicca">
    <img alt="npm" src="https://img.shields.io/npm/dt/musicca">
    <img alt="GitHub issues" src="https://img.shields.io/github/issues/musiccajs/musicca">
  </div>
</div>

# About 📛

This package is a collection of structures for [Musicca](https://www.npmjs.com/package/musicca).

# Installation 💾

```sh-session
npm install @musicca/structs
yarn add @musicca/structs
pnpm add @musicca/structs
```

# Guide 🖋

## Creating custom queue

First, you need to create a new queue class with your custom implementation

```ts
import { Queue, Media } from 'musicca';

export default class CustomQueue extends Queue {
  public list: Media[] = [];

  // Always put options at the 3rd parameter
  constructor(manager, id, options) { ... }

  // All custom methods are awaitable by default
  public all() { ... }
  public add<T extends Media | Media[] = Media>(media: T, position?: number) { ... }
  public get(position: number) { ... }
  public remove(position: number) { ... }
  public clear() { ... }
  public indexOf(media: Media) { ... }
}
```

Now, you can just plug it in to musicca

```ts
const client = new Musicca<CustomQueue>({
  plugins: { ... },
  structs: {
    queue: CustomQueue
  }
});
```

# Links 🔗

- [Website](https://musicca.edqe.me) ([source](https://github.com/musiccajs/website))
- [Documentation](https://musicca.edqe.me/docs)
- [Github](https://github.com/musiccajs/structs)
- [npm](https://www.npmjs.com/package/@musicca/structs)
