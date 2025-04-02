import {useEffect} from 'preact/hooks'
import {render, Text, useStderr} from '../../src/index.js';

function Example() {
	const {write} = useStderr();

	useEffect(() => {
		const timer = setInterval(() => {
			write('Hello from Ink to stderr\n');
		}, 1000);

		return () => {
			clearInterval(timer);
		};
	}, []);

	return <Text>Hello World</Text>;
}

render(<Example />);
