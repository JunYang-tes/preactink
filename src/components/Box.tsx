import { ComponentChildren, Ref, Key } from 'preact'
import { type Styles } from '../styles.js';
import { type DOMElement } from '../dom.js';
import { forwardRef } from 'preact/compat';
import { mapRef } from '../utils.js';

export type Props = Omit<Styles, 'textWrap'> & {
	children?: ComponentChildren,
	ref?: Ref<DOMElement>
	key?: Key
};

/**
 * `<Box>` is an essential Ink component to build your layout. It's like `<div style="display: flex">` in the browser.
 */
const Box = forwardRef(
	({ children, ...style }: Props, ref: Ref<DOMElement>) => {
		return (
			<ink-box
				ref={mapRef(r => r?.node ?? null, ref)}
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
	})

Box.displayName = 'Box';

Box.defaultProps = {
	flexWrap: 'nowrap',
	flexDirection: 'row',
	flexGrow: 0,
	flexShrink: 1,
};

export default Box;
