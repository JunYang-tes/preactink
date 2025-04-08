import { useState } from 'preact/hooks'
import { render, useInput, View, Text } from '../src/index.js'

export function App() {
	const [size, setSize] = useState([0, 0])
	useInput(() => { })
	return <View
		onResize={({ width, height }) => {
			setSize([width, height])
		}}
		style={{
			borderStyle: 'single',
			flexDirection: 'column',
			height: 10
		}}>
		<Text>Resize your terminal</Text>
		<Text>
			The terminal size:{JSON.stringify(size)}
		</Text>
	</View>
}
render(<App />, { alternativeScreen: true })
