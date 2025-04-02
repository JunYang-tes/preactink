import { useReducer, useEffect, useRef, useImperativeHandle } from 'preact/hooks'
import { View, ViewProps } from './View.js'
import { DOMElement } from '../dom.js';
import measureElement from '../measure-element.js';
import useInput from '../hooks/use-input.js';
import { forwardRef, Ref } from 'preact/compat';

interface ScrollAreaState {
	innerHeight: number;
	height: number;
	scrollTop: number;
}

type ScrollAreaAction =
	| { type: 'SET_INNER_HEIGHT'; innerHeight: number }
	| { type: 'SET_HEIGHT'; height: number }
	| { type: 'SCROLL_DOWN' }
	| { type: 'SCROLL_UP' };

const reducer = (state: ScrollAreaState, action: ScrollAreaAction) => {
	switch (action.type) {
		case 'SET_INNER_HEIGHT':
			return {
				...state,
				innerHeight: action.innerHeight,
			};
		case 'SET_HEIGHT':
			return {
				...state,
				height: action.height,
			};

		case 'SCROLL_DOWN':
			return {
				...state,
				scrollTop:
					Math.min(
						state.innerHeight <= state.height ? 0 : state.innerHeight - state.height,
						state.scrollTop + 1,
					),
			};

		case 'SCROLL_UP':
			return {
				...state,
				scrollTop: Math.max(0, state.scrollTop - 1),
			};

		default:
			return state;
	}
};

export type ScrollViewProps = {
	style?: ViewProps['style'];
	children: ViewProps['children'];
	height?: number;
}

export type ScrollViewInstance = {
	scrollDown: () => void,
	scrollUp: () => void
}

export const ScrollView = forwardRef(function ScrollView({ height, children, style }: ScrollViewProps, ref: Ref<ScrollViewInstance>) {
	const [state, dispatch] = useReducer(reducer, {
		height: height ?? 10,
		scrollTop: 0,
		innerHeight: 0,
	});

	const outerRef = useRef<DOMElement>(null);
	const innerRef = useRef<DOMElement>(null);

	useEffect(() => {
		if (outerRef.current) {
			const node = outerRef.current
			const dimensions = measureElement(node);
			let borderHeight = node.style.borderStyle ? 2 : 0
			// if (node.style.borderTop === false) {
			// 	borderHeight -= 1
			// }
			// if (node.style.borderBottom === false) {
			// 	borderHeight -= 1
			// }
			dispatch({ type: 'SET_HEIGHT', height: dimensions.height - borderHeight });
		} else if (height != null) {
			dispatch({ type: 'SET_HEIGHT', height });
		}
	}, [height]);

	useEffect(() => {
		if (!innerRef.current) return;

		const dimensions = measureElement(innerRef.current);

		dispatch({
			type: 'SET_INNER_HEIGHT',
			innerHeight: dimensions.height,
		});
	}, []);

	useImperativeHandle(ref, () => {
		return {
			scrollDown: () => {
				dispatch({
					type: 'SCROLL_DOWN',
				});
			},
			scrollUp: () => {
				dispatch({
					type: 'SCROLL_UP',
				});
			}
		}
	}, [dispatch])



	return (
		<View
			ref={outerRef}
			style={[
				...(Array.isArray(style) ? style : [style]),
				{
					height: height,
					flexDirection: 'column',
					flexGrow: 1,
					overflow: 'hidden'
				}]}>
			<View ref={innerRef}
				style={{ flexGrow: 1, flexShrink: 0, flexDirection: 'column', marginTop: -state.scrollTop }}
			>
				{children}
			</View>
		</View>
	);
})
