import { Ref } from "preact"

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

