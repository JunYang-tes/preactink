import { VNode, Ref } from "preact"
import { Styles } from "../styles.js"
import { DOMElement } from "../dom.js"
import { useMemo } from "preact/hooks"

export type BoxStyle = Omit<Styles, 'textWrap'>
const defaultStyle: BoxStyle = {
	flexWrap: 'nowrap',
	flexDirection: 'row',
	flexGrow: 0,
	flexShrink: 1,
	overflowX: 'visible',
	overflowY: 'visible',
}

export type ViewProps = {
	ref?: Ref<DOMElement>
	style?: BoxStyle | Array<BoxStyle>
	children?: VNode
}
export function View(props: ViewProps) {
	const { style, children, ref } = props
	const s = useMemo(() => {
		if (style == null) {
			return defaultStyle
		} else if (Array.isArray(style)) {
			return style.reverse().reduce((pre, curr) => {
				return {
					...pre,
					curr
				}
			}, defaultStyle)
		} else {
			return {
				...defaultStyle,
				...style,
				overflowX: style.overflowX ?? style.overflow ?? 'visible',
				overflowY: style.overflowY ?? style.overflow ?? 'visible',
			}
		}

	}, [style])
	return <ink-box
		style={s}
		ref={ref}
	>
		{children}
	</ink-box>
}
