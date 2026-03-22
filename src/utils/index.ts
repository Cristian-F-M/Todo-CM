export function mergeObjects<T extends Record<string, unknown>>(
	defaults: Record<string, unknown>,
	toMerge: Record<string, unknown>
) {
	const fullDataEntries = [Object.entries(defaults), Object.entries(toMerge)]
		.flat()
		.filter(([, v]) => v != null)

	return Object.fromEntries(fullDataEntries) as T
}

export function removeKeysFromObject<T extends Record<string, unknown>>(
	obj: T,
	keys: (keyof T)[]
) {
	const filteredEntries = Object.entries(obj).filter(
		([key]) => !keys.includes(key as keyof T)
	)

	return Object.fromEntries(filteredEntries) as T
}