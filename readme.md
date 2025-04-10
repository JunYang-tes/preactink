<div align="center">
	<br>
	<br>
	<img width="240" alt="Ink" src="media/logo.png">
	<br>
	<br>
	<br>
</div>

>**This is a fork of ink which works with preact.**

## Run the example

```sh
git clone git@github.com:JunYang-tes/preactink.git
cd preactink
bun install
bun run examples/counter/counter.tsx
```

## Usage

```jsx
import {useState, useEffect} from 'preact/hooks';
import {render, Text} from 'preactink';

const Counter = () => {
	const [counter, setCounter] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setCounter(previousCounter => previousCounter + 1);
		}, 100);

		return () => {
			clearInterval(timer);
		};
	}, []);

	return <Text color="green">{counter} tests passed</Text>;
};

render(<Counter />);
```

<img src="media/demo.svg" width="600">

## Getting Started

### Use bun

```sh
mkdir demo
cd demo
bun init # select template Blank
bun add preactink
mv index.ts index.tsx # rename to index.tsx
```

Open index.tsx in your editor and add change it to the following code.

```tsx
import { render, Text } from 'preactink'

render(<Text>Hello world</Text>)
```

Then run `bun run index.tsx` to see the output.

Update tsconfig.json to include `jsxImportSource: 'preact'` to get error out.

### Use node

1. Create a node project

```
mkdir demo
npm init
npm add -D typescript
npm add preactink
```

1. Update package.json, set type to module

```json
{
  "type": "module"
}
```


1. Save the following to tsconfig.json

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "jsx": "react-jsx",
    "jsxImportSource": "preact",
    "target": "ESNext",
    "module": "node16",
    "moduleResolution": "nodenext",
    "moduleDetection": "force",
  }
}
```

1. Save to following to index.tsx

```tsx
import { render, Text } from 'preactink'
render(<Text>Hello, World</Text>)
```

1. run `npx tsc` to build it

1. run `node ./dist/index.js`



Preactink uses [Yoga](https://github.com/facebook/yoga) - a Flexbox layout engine to build great user interfaces for your CLIs using familiar CSS-like props you've used when building apps for the browser.
It's important to remember that each element is a Flexbox container.
Think of it as if each `<div>` in the browser had `display: flex`.
See [`<Box>`](#box) built-in component below for documentation on how to use Flexbox layouts in Ink.
Note that all text must be wrapped in a [`<Text>`](#text) component.

## API Reference

You can find [it](./api.md) here.
