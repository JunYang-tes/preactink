import { VNode, Ref, ComponentChildren } from "preact"
import { Styles } from "../styles.js"
import { DOMElement } from "../dom.js"
import { useCallback, useMemo } from "preact/hooks"
import { forwardRef } from 'preact/compat'
import { mapRef, mergeStyle, NestedableStyle } from "../utils.js"

export type BoxStyle = Omit<Styles, 'textWrap'> & {
	background?: string | 'opaque'
}
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
	style?: NestedableStyle<BoxStyle>
	onResize?: (e: { width: number, height: number, node: DOMElement }) => void
	children?: ComponentChildren
}
export const View = forwardRef((props: ViewProps, ref: Ref<DOMElement>) => {
	const { style, children, ...rest } = props
	const s = useMemo(() => {
		if (style == null) {
			return defaultStyle
		} else if (Array.isArray(style)) {
			return {
				...defaultStyle,
				...mergeStyle(style)
			}
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
		{...rest}
		style={s}
		ref={mapRef(r => {
			return r?.node ?? null
		}, ref)}
	>
		{children}
	</ink-box>
})

