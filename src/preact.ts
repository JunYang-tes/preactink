import { render as prender, ContainerNode, VNode, createElement, options as preactOptions } from 'preact'
import { DOMElement, NodeNames } from './dom';
import type { RenderOptions } from './render';
import Ink, { type Options as InkOptions } from './ink.js';
import instances from './instances.js';
import { Stream } from 'node:stream'
import * as dom from './dom'
import { throttle } from 'es-toolkit/compat';

const TEXT_NODE = 1
const VIRTUAL_TEXT_NODE = 2
const BOX_NODE = 3
const ROOT_NODE = 4;
const nodeTypes: Record<NodeNames, number> = {
	'ink-text': TEXT_NODE,
	'ink-box': BOX_NODE,
	'ink-root': ROOT_NODE,
	'ink-virtual-text': VIRTUAL_TEXT_NODE,
	'#text': TEXT_NODE
};

const domNode2PreactElement = new WeakMap<dom.DOMNode, PreactElement>();

(globalThis as any).document = {
	createTextNode(text: string) {
		const textNode = dom.createTextNode(text);
		const ele = new PreactElement(textNode)
		domNode2PreactElement.set(textNode, ele)
		return ele
	},
	createElementNS(namespaceURI: string, qualifiedName: string) {
		if (qualifiedName.startsWith('ink-')) {
			const node = dom.createNode(qualifiedName as any)
			const ele = new PreactElement(node)
			domNode2PreactElement.set(node, ele)
			return ele
		}
		throw new Error('Method not implemented.');
	}
}

function isContainer(node: dom.DOMNode): node is dom.DOMElement {
	return node.nodeName === 'ink-root' || node.nodeName === 'ink-box' || node.nodeName === 'ink-text' || node.nodeName === 'ink-virtual-text'
}



class PreactElement implements ContainerNode {
	get attributes() {
		return this.node.attributes ?? {}
	}
	get style() {
		return this.node.style
	}
	set data(data: any) {
		if (this.node.nodeName === '#text') {
			this.node.nodeValue = String(data)
			PreactElement.scheduleOutput()
		}
	}
	set internal_transform(value: any) {
		this.node.internal_transform = value
	}
	setAttribute(key: string, value: any) {
		console.log("setAttribute")
		if (key === 'style') {
			dom.setStyle(this.node as DOMElement, value)
		}
		if (key === 'internal_transform') {
			this.node.internal_transform = value
		}
		dom.setAttribute(this.node as DOMElement, key, value)
		PreactElement.scheduleOutput()
	}
	constructor(public readonly node: dom.DOMNode) {
		this.nodeType = nodeTypes[node.nodeName]
	}
	removeChild(child: ContainerNode): ContainerNode {
		const thisNode = this.node;
		if (isContainer(thisNode)) {
			const childNode = (child as PreactElement).node;
			dom.removeChildNode(thisNode, childNode as DOMElement);
			return child;
		}
		throw new Error('This is not a container');
	}
	appendChild(node: ContainerNode): ContainerNode {
		const thisNode = this.node
		if (isContainer(thisNode)) {
			const n = (node as PreactElement).node
			dom.appendChildNode(
				thisNode,
				n as DOMElement
			)
			return node
		}
		throw new Error('This is not a container');
	}
	insertBefore(node: ContainerNode, child: ContainerNode | null): ContainerNode {
		const thisNode = this.node;

		if (isContainer(thisNode)) {
			const newNode = (node as PreactElement).node;
			const refNode = child ? (child as PreactElement).node : null;
			dom.insertBeforeNode(
				thisNode,
				newNode as DOMElement,
				refNode as DOMElement
			);
			return node;
		}
		throw new Error('This is not a container');
	}
	contains(other: ContainerNode | null): boolean {
		const thisNode = this.node;
		if (isContainer(thisNode)) {
			const otherNode = (other as PreactElement).node;
			const search = (node: DOMElement): boolean => {
				if (node === otherNode) {
					return true
				}
				for (const child of node.childNodes) {
					if (search(child as DOMElement)) {
						return true
					}
				}
				return false
			}
			return search(thisNode as DOMElement)
		}
		throw new Error('This is not a container');
	}
	get childNodes(): PreactElement[] {
		const thisNode = this.node;
		if (isContainer(thisNode)) {
			return thisNode.childNodes.map(domNode2PreactElement.get).filter(Boolean) as PreactElement[]
		}
		return []
	};
	get firstChild(): PreactElement | null {
		const thisNode = this.node;
		if (isContainer(thisNode)) {
			return domNode2PreactElement.get(thisNode.childNodes[0]) || null
		}
		throw new Error('This is not a container');
	};
	get nextSibling(): PreactElement | null {
		const p = this.node.parentNode
		if (p) {
			const index = p.childNodes.indexOf(this.node)
			if (index >= 0) {
				return domNode2PreactElement.get(p.childNodes[index + 1]) || null
			}
		}
		return null
	}
	get parentNode(): PreactElement {
		return domNode2PreactElement.get(this.node.parentNode!)!
	}
	nodeType: number;

	static scheduleOutput = () => {
	}
}

export function render(node: VNode,

	options?: NodeJS.WriteStream | RenderOptions,
) {

	const inkOptions: InkOptions = {
		stdout: process.stdout,
		stdin: process.stdin,
		stderr: process.stderr,
		debug: false,
		exitOnCtrlC: true,
		patchConsole: true,
		...getOptions(options),
	};

	const instance: Ink = getInstance(
		inkOptions.stdout,
		() => new Ink(inkOptions),
	);

	const rootEle = PreactElement.scheduleOutput = throttle(() => {
		instance.calculateLayout()
		instance.onRender()
	}, 35, { trailing: true, leading: true })

	prender(
		instance.render(node), new PreactElement(instance.rootNode)
	)
	instance.calculateLayout()
	instance.onRender()

	return {
		rerender: instance.render,
		unmount() {
			instance.unmount();
		},
		waitUntilExit: instance.waitUntilExit,
		cleanup: () => instances.delete(inkOptions.stdout),
		clear: instance.clear,
	};

}

const getOptions = (
	stdout: NodeJS.WriteStream | RenderOptions | undefined = {},
): RenderOptions => {
	if (stdout instanceof Stream) {
		return {
			stdout,
			stdin: process.stdin,
		};
	}

	return stdout;
};
const getInstance = (
	stdout: NodeJS.WriteStream,
	createInstance: () => Ink,
): Ink => {
	let instance = instances.get(stdout);

	if (!instance) {
		instance = createInstance();
		instances.set(stdout, instance);
	}

	return instance;
};
