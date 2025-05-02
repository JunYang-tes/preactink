import { VNode, Key, Ref, ComponentChildren } from 'preact'
import { type Except } from 'type-fest';
import { type DOMElement } from './dom.js';
import { type Styles } from './styles.js';

declare global {
	namespace preact.JSX {
		// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
		interface IntrinsicElements {
			'ink-box': Ink.Box;
			'ink-text': Ink.Text;
		}
	}
}

declare namespace Ink {
	type Box = {
		internal_static?: boolean;
		onResize?: (e: { width: number, height: number, node: DOMElement }) => void;
		children?: ComponentChildren;
		key?: Key;
		ref?: Ref<{ node: DOMElement }>;
		style?: Except<Styles, 'textWrap'> & {
			background?: string | 'opaque'
		};
	};

	type Text = {
		children?: ComponentChildren;
		key?: Key;
		style?: Styles;

		// eslint-disable-next-line @typescript-eslint/naming-convention
		internal_transform?: (children: string, index: number) => string;
	};
}
export { }
