import { useEffect, useState } from 'preact/hooks'
import { Static, useInput, View,Box,Text,render } from './build'
import { VNode } from 'preact'

function TestRender(props: { children: (a: string) => VNode }) {
	return <Box flexDirection='column'>
		<Text>Test render props</Text>
		{props.children("hello")}
		{props.children("word")}
	</Box>
}

// console.log(<ink-text>hello</ink-text>)
//
function Test() {
	const [c, setC] = useState(9)
	useInput((data) => {
		if (data === '+') {
			setC(c => c + 1)
		} else if (data === '-') {
			setC(c => c - 1)
		}
	})
	return <Box flexDirection='column'>
		{new Array(100).fill(0).map((_, i) => <Text>{i}:{c}</Text>)}
	</Box>

}


render(<Test />)

