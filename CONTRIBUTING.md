# Contribute Guide

## Choose an extension

```bash
$ cd ava
```

## Install Dependencies

```bash
$ npm install
```

## Start Development Server

```bash
$ npm run dev
```

## Add a test

Create a file in `./__tests__/plots` named as `[data]-[mark]-[description]`, such as `alphabet-auto-basic.ts`.

```txt
- __tests__
  - alphabet-auto-basic.ts
  - index.ts
```

Then expose a function named as the camel case of the filename, which returns a G2 options, such as:

```ts
import { Auto } from "../../src";

export function AlphabetAutoBasic() {
  return {
    type: Auto,
    data: { type: "fetch", value: "data/alphabet.csv" },
  };
}
```

Then register this case in `./__tests__/index.ts`:

```ts
export { AlphabetAutoBasic } from "./alphabet-auto-basic";
```

Open the browser, navigate to `http://127.0.0.1:8080/` and choose `AlphabetAutoBasic` to preview.
