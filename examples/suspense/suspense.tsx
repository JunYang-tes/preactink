import { render, Text, Box } from '../../src/index.js';
import { Suspense } from 'preact/compat'

let promise: Promise<void> | undefined;
let state: string | undefined;
let value: string | undefined;

const read = () => {
	if (!promise) {
		promise = new Promise(resolve => {
			setTimeout(resolve, 500);
		});

		state = 'pending';

		(async () => {
			await promise;
			state = 'done';
			value = 'Hello World';
		})();
	}

	if (state === 'pending') {
		// eslint-disable-next-line @typescript-eslint/only-throw-error
		throw promise;
	}

	if (state === 'done') {
		return value;
	}
};

function Example() {
	const message = read();
	return <Text>{message}</Text>;
}

function Fallback() {
	return <Text>Loading...</Text>;
}

render(
	<Box>
		<Text>Suspense</Text>
		<Suspense fallback={<Fallback />}>
			<Example />
		</Suspense>,
	</Box>
);
