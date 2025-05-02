import cliBoxes from 'cli-boxes';
import chalk from 'chalk';
import colorize from './colorize.js';
import { type DOMNode } from './dom.js';
import type Output from './output.js';

const renderBg = (
	x: number,
	y: number,
	node: DOMNode,
	output: Output,
): void => {
	if (node.style.background) {

		const width = node.yogaNode!.getComputedWidth();
		const height = node.yogaNode!.getComputedHeight();
		if (node.style.background === 'opaque') {
			for (let i = 0; i < height; i++) {
				output.write(x, y + i,
					' '
						.repeat(width)
					, { transformers: [] }
				)
			}
		} else {
			for (let i = 0; i < height; i++) {
				output.write(x, y + i,
					colorize(' ', node.style.background, 'background')
						.repeat(width)
					, { transformers: [] }
				)
			}
		}
	}
};

export default renderBg;
