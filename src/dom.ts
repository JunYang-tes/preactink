import Yoga, { type Node as YogaNode } from 'yoga-layout';
import measureText from './measure-text.js';
import { type Styles } from './styles.js';
import wrapText from './wrap-text.js';
import squashTextNodes from './squash-text-nodes.js';
import { type OutputTransformer } from './render-node-to-output.js';


type InkNode = {
	bbox?: BBox
	parentNode: DOMElement | undefined;
	yogaNode?: YogaNode;
	internal_static?: boolean;
	internal_transform?: OutputTransformer;
	style: Styles;
};


export type TextName = '#text';
export type ElementNames =
	| 'ink-root'
	| 'ink-box'
	| 'ink-text'

export type NodeNames = ElementNames | TextName;

export type BBox = {
	left: number,
	top: number,
	width: number,
	height: number
}

export type DOMElement = DOMRootElement | DOMBoxElement | DOMTextElement | DOMBoxBorderDecoration

export type DOMRootElement = {
	nodeName: 'ink-root',
	staticNode?: DOMElement;
	onComputeLayout?: () => void;
	onRender?: () => void;
	onImmediateRender?: () => void;
	attributes: Record<string, DOMNodeAttribute>;
	childNodes: DOMNode[];
} & InkNode

export type DOMTextElement = {
	nodeName: 'ink-text',
	attributes: Record<string, DOMNodeAttribute>;
	childNodes: DOMNode[];
} & InkNode

export type DOMBoxElement = {
	nodeName: 'ink-box'
	attributes: Record<string, DOMNodeAttribute>;
	childNodes: DOMNode[];
	borderLeftDecorator?: DOMTextElement;
	borderRightDecorator?: DOMTextElement;
	borderTopDecorator?: DOMTextElement;
	borderBottomDecorator?: DOMTextElement;
} & InkNode


export type TextNode = {
	nodeName: TextName;
	nodeValue: string;
	attributes: Record<string, DOMNodeAttribute>;
} & InkNode;

// eslint-disable-next-line @typescript-eslint/naming-convention
export type DOMNode<T = { nodeName: NodeNames }> = T extends {
	nodeName: infer U;
}
	? U extends '#text'
	? TextNode
	: DOMElement
	: never;

// eslint-disable-next-line @typescript-eslint/naming-convention
export type DOMNodeAttribute = boolean | string | number;

export const createNode = (nodeName: ElementNames): DOMElement => {
	const node: DOMElement = {
		nodeName,
		style: {},
		attributes: {},
		childNodes: [],
		parentNode: undefined,
		yogaNode: Yoga.Node.create(),
	};

	if (nodeName === 'ink-text') {
		node.yogaNode?.setMeasureFunc(measureTextNode.bind(null, node));
	}

	return node;
};

export const appendChildNode = (
	node: DOMElement,
	childNode: DOMElement,
): void => {
	if (childNode.parentNode) {
		removeChildNode(childNode.parentNode, childNode);
	}

	childNode.parentNode = node;
	node.childNodes.push(childNode);

	if (childNode.yogaNode) {
		node.yogaNode?.insertChild(
			childNode.yogaNode,
			node.yogaNode.getChildCount(),
		);
	}

	if (node.nodeName === 'ink-text') {
		markNodeAsDirty(node);
	}
};

export const insertBeforeNode = (
	node: DOMElement,
	newChildNode: DOMNode,
	beforeChildNode: DOMNode | null,
): void => {
	if (newChildNode.parentNode) {
		removeChildNode(newChildNode.parentNode, newChildNode);
	}

	newChildNode.parentNode = node;

	const index = node.childNodes.indexOf(beforeChildNode as DOMNode);
	if (index >= 0) {
		node.childNodes.splice(index, 0, newChildNode);
		if (newChildNode.yogaNode) {
			node.yogaNode?.insertChild(newChildNode.yogaNode, index);
		}

		return;
	}

	node.childNodes.push(newChildNode);

	if (newChildNode.yogaNode &&
		// in case Text inside Text, outer Text already have a measureFunction,
		// the yogaNode with measureFunction shouldn't have child
		(node.nodeName !== 'ink-text')
	) {
		node.yogaNode?.insertChild(
			newChildNode.yogaNode,
			node.yogaNode.getChildCount(),
		);
	}

	if (node.nodeName === 'ink-text') {
		markNodeAsDirty(node);
	}
};

export const removeChildNode = (
	node: DOMElement,
	removeNode: DOMNode,
): void => {
	if (removeNode.yogaNode) {
		removeNode.parentNode?.yogaNode?.removeChild(removeNode.yogaNode);
	}

	removeNode.parentNode = undefined;

	const index = node.childNodes.indexOf(removeNode);
	if (index >= 0) {
		node.childNodes.splice(index, 1);
	}

	if (node.nodeName === 'ink-text') {
		markNodeAsDirty(node);
	}
};

export const setAttribute = (
	node: DOMElement,
	key: string,
	value: DOMNodeAttribute,
): void => {
	node.attributes[key] = value;
};

export const setStyle = (node: DOMNode, style: Styles): void => {
	node.style = style;
};

export const createTextNode = (text: string): TextNode => {
	const node: TextNode = {
		nodeName: '#text',
		nodeValue: text,
		yogaNode: undefined,
		parentNode: undefined,
		style: {},
	};

	setTextNodeValue(node, text);

	return node;
};

const measureTextNode = function (
	node: DOMNode,
	width: number,
): { width: number; height: number } {
	const text =
		node.nodeName === '#text' ? node.nodeValue : squashTextNodes(node);

	const dimensions = measureText(text);

	// Text fits into container, no need to wrap
	if (dimensions.width <= width) {
		return dimensions;
	}

	// This is happening when <Box> is shrinking child nodes and Yoga asks
	// if we can fit this text node in a <1px space, so we just tell Yoga "no"
	if (dimensions.width >= 1 && width > 0 && width < 1) {
		return dimensions;
	}

	const textWrap = node.style?.textWrap ?? 'wrap';
	const wrappedText = wrapText(text, width, textWrap);

	return measureText(wrappedText);
};

const findClosestYogaNode = (node?: DOMNode): YogaNode | undefined => {
	if (!node?.parentNode) {
		return undefined;
	}

	return node.yogaNode ?? findClosestYogaNode(node.parentNode);
};

const markNodeAsDirty = (node?: DOMNode): void => {
	// Mark closest Yoga node as dirty to measure text dimensions again
	const yogaNode = findClosestYogaNode(node);
	yogaNode?.markDirty();
};

// ink-text can be places inside ink-text,let's find the outmost ink-text
const findOutmostInkText = (node: DOMNode | undefined | null): DOMNode | undefined => {
	if (node == null) {
		return
	}
	if (node.nodeName === 'ink-text') {
		let inkText = node;
		let parent: DOMNode | undefined = node.parentNode;
		while (parent != null && parent.nodeName == 'ink-text') {
			inkText = parent;
			parent = parent.parentNode;
		}
		return inkText
	} else if (node.nodeName === '#text') {
		return findOutmostInkText(node.parentNode)
	}
}

export const setTextNodeValue = (node: TextNode, text: string): void => {
	if (typeof text !== 'string') {
		text = String(text);
	}
	node.nodeValue = text;
	markNodeAsDirty(findOutmostInkText(node));
};
