import {ComponentChildren,Ref,Key} from 'preact'
import { type Styles } from '../styles.js';
import { type DOMElement } from '../dom.js';

export type Props = Omit<Styles, 'textWrap'> & {
	children?:ComponentChildren,
	ref?:Ref<DOMElement>
	key?:Key
};

/**
 * `<Box>` is an essential Ink component to build your layout. It's like `<div style="display: flex">` in the browser.
 */
const Box =
	({ children, ref, ...style }: Props) => {
		return (
			<ink-box
				ref={ref}
				style={{
					flexWrap: 'nowrap',
					flexDirection: 'row',
					flexGrow: 0,
					flexShrink: 1,
					...style,
					overflowX: style.overflowX ?? style.overflow ?? 'visible',
					overflowY: style.overflowY ?? style.overflow ?? 'visible',
				}}
			>
				{children}
			</ink-box>
		);
	}

Box.displayName = 'Box';

Box.defaultProps = {
	flexWrap: 'nowrap',
	flexDirection: 'row',
	flexGrow: 0,
	flexShrink: 1,
};

export default Box;
