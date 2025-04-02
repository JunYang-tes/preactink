import {useState,useEffect} from 'preact/hooks'
import {Box, Text, render, Static} from '../../src/index.js';

function Example() {
	const [tests, setTests] = useState<
		Array<{
			id: number;
			title: string;
		}>
	>([]);

	useEffect(() => {
		let completedTests = 0;
		let timer: NodeJS.Timeout | undefined;

		const run = () => {
			if (completedTests++ < 10) {
				setTests(previousTests => [
					...previousTests,
					{
						id: previousTests.length,
						title: `Test #${previousTests.length + 1}`,
					},
				]);

				timer = setTimeout(run, 100);
			}
		};

		run();

		return () => {
			clearTimeout(timer);
		};
	}, []);

	return (
		<>
			<Static items={tests}>
				{test => (
					<Text color="green">✔ {test.title}</Text>
				)}
			</Static>

			<Box marginTop={1}>
				<Text dimColor>Completed tests: {tests.length}</Text>
			</Box>
		</>
	);
}

render(<Example />);
