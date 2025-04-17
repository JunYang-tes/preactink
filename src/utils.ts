import { Ref } from "preact"
import { Styles } from "./styles.js"

export function mapRef<R, T>(f: (r: T | null) => R | null, ref?: Ref<R>): Ref<T> | undefined {
	if (ref == null) {
		return undefined
	}
	return (t: T | null) => {
		if (typeof ref === 'function') {
			return ref(f(t))
		} else {
			ref.current = f(t)
		}
	}
}

export type NestedableStyle<T = Styles> = T | Array<NestedableStyle | null | undefined>

export function mergeStyle<T = Styles>(style: NestedableStyle): Styles {
	const s = Array.isArray(style) ? style : [style]
	return ((s as any).flat(Infinity) as Array<Styles | null | undefined>)
		.filter(Boolean)
		.reduce((ret: Styles, curr) => {
			Object.assign(ret, curr)
			return ret
		}, {})
}
