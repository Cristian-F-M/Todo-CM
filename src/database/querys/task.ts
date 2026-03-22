import { ToastAndroid } from 'react-native'
import { executeQuery, select, selectAll } from '@/database/querys'
import type { Task } from '@/types/task'

export async function getAll() {
	const { succes, result, message } = await selectAll<Task>(
		'SELECT * FROM tasks'
	)

	if (!succes || !result) {
		const msg = message || 'No se pudieron obtener las tareas'
		ToastAndroid.show(msg, ToastAndroid.LONG)
		return []
	}

	return result
}

export async function getById(id: string) {
	const { succes, result, message } = await select<Task>(
		'SELECT * FROM tasks WHERE id = ?',
		id
	)

	if (!succes || !result) {
		const msg = message || 'No se pudo obtener la tarea'
		ToastAndroid.show(msg, ToastAndroid.LONG)
		return null
	}

	return result
}

export async function create(task: Task) {
	const { succes, message, result } = await executeQuery(
		'INSERT INTO tasks (id, name, folderId) VALUES (?, ?, ?)',
		task.id,
		task.name,
		task.folderId
	)

	if (!succes || !result) {
		const msg = message || 'No se pudo crear la tarea'
		ToastAndroid.show(msg, ToastAndroid.LONG)
	}
	return succes
}

export async function update(task: Task) {
	const { succes, message, result } = await executeQuery(
		'UPDATE tasks SET name = ?, folderId = ?, isCompleted = ? WHERE id = ?',
		task.name,
		task.folderId,
		task.isCompleted,
		task.id
	)

	if (!succes || !result) {
		const msg = message || 'No se pudo actualizar la tarea'
		ToastAndroid.show(msg, ToastAndroid.LONG)
	}
	return succes
}

export async function deleteById(id: string) {
	const { succes, message, result } = await executeQuery(
		'DELETE FROM tasks WHERE id = ?',
		id
	)

	if (!succes || !result) {
		const msg = message || 'No se pudo eliminar la tarea'
		ToastAndroid.show(msg, ToastAndroid.LONG)
	}
	return succes
}

export async function deleteByFolderId(folderId: string) {
	const { succes, message, result } = await executeQuery(
		'DELETE FROM tasks WHERE folderId = ?',
		folderId
	)

	if (!succes || !result) {
		const msg = message || 'No se pudieron eliminar las tareas'
		ToastAndroid.show(msg, ToastAndroid.LONG)
	}
	return succes
}