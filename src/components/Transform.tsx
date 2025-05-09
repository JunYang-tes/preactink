import React, { VNode, type ComponentChildren } from 'preact';

export type Props = {
	/**
	 * Function which transforms children output. It accepts children and must return transformed children too.
	 */
	readonly transform: (children: string, index: number) => string;

	readonly children?: ComponentChildren;
};

/**
 * Transform a string representation of React components before they are written to output.
 * For example, you might want to apply a gradient to text, add a clickable link or create some text effects.
 * These use cases can't accept React nodes as input, they are expecting a string.
 * That's what <Transform> component does, it gives you an output string of its child components and lets you transform it in any way.
 */
export default function Transform({ children, transform }: Props): VNode|null {
	if (children === undefined || children === null) {
		return null;
	}

	return (
		<ink-text
			style={{ flexGrow: 0, flexShrink: 1, flexDirection: 'row' }}
			internal_transform={transform}
		>
			{children}
		</ink-text>
	);
}
