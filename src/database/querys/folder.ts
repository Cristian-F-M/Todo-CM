import { ToastAndroid } from 'react-native'
import { executeQuery, select, selectAll } from '@/database/querys'
import type { Folder } from '@/types/folder'

export async function getAll(): Promise<Folder[]> {
	const { succes, result, message } = await selectAll<Folder>(
		'SELECT * FROM folders'
	)

	if (!succes || !result) {
		const msg = message || 'No se pudieron obtener las carpetas'
		ToastAndroid.show(msg, ToastAndroid.LONG)
		return []
	}

	return result
}

export async function getById(id: string) {
	const { succes, result, message } = await select<Folder>(
		'SELECT * FROM folders WHERE id = ?',
		id
	)

	if (!succes || !result) {
		const msg = message || 'No se pudo obtener la carpeta'
		ToastAndroid.show(msg, ToastAndroid.LONG)
		return null
	}

	return result
}

export async function create(folder: Folder) {
	const { succes, message, result } = await executeQuery(
		'INSERT INTO folders (id, name, taskCount) VALUES (?, ?, ?)',
		folder.id,
		folder.name,
		folder.taskCount
	)
	if (!succes || !result) {
		const msg = message || 'No se pudo crear la carpeta'
		ToastAndroid.show(msg, ToastAndroid.LONG)
	}
	return succes
}

export async function update(folder: Folder) {
	const { succes, message, result } = await executeQuery(
		'UPDATE folders SET name = ?, taskCount = ? WHERE id = ?',
		folder.name,
		folder.taskCount,
		folder.id
	)
	if (!succes || !result) {
		const msg = message || 'No se pudo actualizar la carpeta'
		ToastAndroid.show(msg, ToastAndroid.LONG)
	}
	return succes
}

export async function deleteById(id: string) {
	const { succes, message, result } = await executeQuery(
		'DELETE FROM folders WHERE id = ?',
		id
	)
	if (!succes || !result) {
		const msg = message || 'No se pudo eliminar la carpeta'
		ToastAndroid.show(msg, ToastAndroid.LONG)
	}
	return succes
}