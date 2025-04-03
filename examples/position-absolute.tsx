import { render, View, Text, Box } from '../src/index.js';

render(
	<View style={{
		borderStyle: 'double',
		padding: 2
	}}>
		<View
			style={{
				flexGrow: 1,
				flexDirection: 'column',
				borderStyle: 'single',
				overflow: 'visible'
			}}>
			<Text>Hello</Text>
			<Text>Hello</Text>
			<Text>Hello</Text>
			<Text>Hello</Text>
			<Text>Hello</Text>
			<Text>Hello</Text>
			<Box
				position='absolute'
				right={-1}
				top={-1}
				borderStyle={'classic'}
				flexDirection='row'
			>
				<Text color={'red'}>A</Text>
				<Text color='green'>B</Text>
			</Box>

			<Box position='absolute' right={-1} bottom={-1}
				borderStyle={"classic"}
			>
				<Text color={'yellow'}>Bottom Right</Text>
			</Box>

		</View>
	</View>
)
