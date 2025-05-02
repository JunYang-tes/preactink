import cliBoxes from 'cli-boxes';
import chalk from 'chalk';
import colorize from './colorize.js';
import {type DOMNode} from './dom.js';
import type Output from './output.js';


const renderBorder = (
	x: number,
	y: number,
	node: DOMNode,
	output: Output,
): void => {
	if (node.style.borderStyle) {
		const width = node.yogaNode!.getComputedWidth();
		const height = node.yogaNode!.getComputedHeight();
		const box =
			typeof node.style.borderStyle === 'string'
				? cliBoxes[node.style.borderStyle]
				: node.style.borderStyle;

		const topBorderColor = node.style.borderTopColor ?? node.style.borderColor;
		const bottomBorderColor =
			node.style.borderBottomColor ?? node.style.borderColor;
		const leftBorderColor =
			node.style.borderLeftColor ?? node.style.borderColor;
		const rightBorderColor =
			node.style.borderRightColor ?? node.style.borderColor;

		const dimTopBorderColor =
			node.style.borderTopDimColor ?? node.style.borderDimColor;

		const dimBottomBorderColor =
			node.style.borderBottomDimColor ?? node.style.borderDimColor;

		const dimLeftBorderColor =
			node.style.borderLeftDimColor ?? node.style.borderDimColor;

		const dimRightBorderColor =
			node.style.borderRightDimColor ?? node.style.borderDimColor;

		const showTopBorder = node.style.borderTop !== false;
		const showBottomBorder = node.style.borderBottom !== false;
		const showLeftBorder = node.style.borderLeft !== false;
		const showRightBorder = node.style.borderRight !== false;

		let colorizeBorder = node.style.background
			? node.style.background === 'opaque'
				? colorize
				: (
					str: string,
					color: string | undefined,
					type: 'foreground' | 'background',
				)=>colorize(colorize(str,color,'foreground'),node.style.background,'background')
			: colorize

		const contentWidth =
			width - (showLeftBorder ? 1 : 0) - (showRightBorder ? 1 : 0);

		let topBorder = showTopBorder
			? colorizeBorder(
					(showLeftBorder ? box.topLeft : '') +
						box.top.repeat(contentWidth) +
						(showRightBorder ? box.topRight : ''),
					topBorderColor,
					'foreground',
				)
			: undefined;

		if (showTopBorder && dimTopBorderColor) {
			topBorder = chalk.dim(topBorder);
		}

		let verticalBorderHeight = height;

		if (showTopBorder) {
			verticalBorderHeight -= 1;
		}

		if (showBottomBorder) {
			verticalBorderHeight -= 1;
		}
		verticalBorderHeight = Math.max(verticalBorderHeight, 0);

		let leftBorder = (
			colorizeBorder(box.left, leftBorderColor, 'foreground') + '\n'
		).repeat(verticalBorderHeight);

		if (dimLeftBorderColor) {
			leftBorder = chalk.dim(leftBorder);
		}

		let rightBorder = (
			colorizeBorder(box.right, rightBorderColor, 'foreground') + '\n'
		).repeat(verticalBorderHeight);

		if (dimRightBorderColor) {
			rightBorder = chalk.dim(rightBorder);
		}

		let bottomBorder = showBottomBorder
			? colorizeBorder(
					(showLeftBorder ? box.bottomLeft : '') +
						box.bottom.repeat(contentWidth) +
						(showRightBorder ? box.bottomRight : ''),
					bottomBorderColor,
					'foreground',
				)
			: undefined;

		if (showBottomBorder && dimBottomBorderColor) {
			bottomBorder = chalk.dim(bottomBorder);
		}

		const offsetY = showTopBorder ? 1 : 0;

		if (topBorder) {
			output.write(x, y, topBorder, {transformers: []});
		}

		if (showLeftBorder) {
			output.write(x, y + offsetY, leftBorder, {transformers: []});
		}

		if (showRightBorder) {
			output.write(x + width - 1, y + offsetY, rightBorder, {
				transformers: [],
			});
		}

		if (bottomBorder) {
			output.write(x, y + height - 1, bottomBorder, {transformers: []});
		}
	}
};

export default renderBorder;
