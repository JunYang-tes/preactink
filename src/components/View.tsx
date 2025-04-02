import { VNode, Ref, ComponentChildren } from "preact"
import { Styles } from "../styles.js"
import { DOMElement } from "../dom.js"
import { useCallback, useMemo } from "preact/hooks"
import { forwardRef } from 'preact/compat'
import { mapRef } from "../utils.js"

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
	style?: BoxStyle | Array<BoxStyle | undefined | null>
	children?: ComponentChildren
}
export const View = forwardRef((props: ViewProps, ref: Ref<DOMElement>) => {
	const { style, children } = props
	const s = useMemo(() => {
		if (style == null) {
			return defaultStyle
		} else if (Array.isArray(style)) {
			return style.reverse().reduce((pre: BoxStyle, curr) => {
				return {
					...pre,
					...(curr ?? {})
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
		ref={mapRef(r => {
			return r?.node ?? null
		}, ref)}
	>
		{children}
	</ink-box>
})

