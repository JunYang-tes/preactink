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

type NestedableStyle = Styles | Array<NestedableStyle|null|undefined>

export function mergeStyle(style: NestedableStyle): Styles {
	if (Array.isArray(style)) {
		return style.reverse().reduce((pre: Styles, curr) => {
			if (Array.isArray(curr)) {
				return {
					...pre,
					...mergeStyle(curr)
				}
			}
			return {
				...pre,
				...(curr ?? {})
			}
		}, {})
	}
	return style ?? {}
}
