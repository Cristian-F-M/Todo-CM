import { ToastAndroid } from 'react-native'
import { executeQuery, runScript, select } from '@/database/querys'
import { LOGGER } from './logger'

export async function initDatabase() {
	executeQuery(
		'CREATE TABLE IF NOT EXISTS folders (id TEXT PRIMARY KEY, name TEXT, taskCount INTEGER)'
	)
	executeQuery(
		'CREATE TABLE IF NOT EXISTS tasks (id TEXT PRIMARY KEY, name TEXT, folderId TEXT, notificationId TEXT, FOREIGN KEY(folderId) REFERENCES folders(id))'
	)
}

export async function createTables() {
	const { succes, message } = await runScript(
		`
		CREATE TABLE IF NOT EXISTS folders (id TEXT PRIMARY KEY, name TEXT, taskCount INTEGER);
		CREATE TABLE IF NOT EXISTS tasks (id TEXT PRIMARY KEY, name TEXT, folderId TEXT, notificationId TEXT, FOREIGN KEY(folderId) REFERENCES folders(id));
		`
	)

	await executeQuery('PRAGMA user_version = 1;')

	return { succes, message }
}

export async function removeNotificationId(notificationId: string) {
	if (!notificationId) return

	const { succes, message } = await executeQuery(
		'UPDATE tasks SET notificationId = null WHERE notificationId = ?',
		notificationId
	)
	return { ok: succes, message }
}

export async function migrateDB() {
	const { succes, result, message } = await select<{ user_version: number }>(
		'PRAGMA user_version;'
	)
	if (!succes || !result) {
		LOGGER.error(message)
		ToastAndroid.show('No se pudo migrar la base de datos', ToastAndroid.LONG)
		return
	}

	const { user_version = 0 } = result

	if (user_version < 1) {
		const { succes, message } = await createTables()
		if (!succes) {
			LOGGER.error(message)
			ToastAndroid.show('No se pudo crear la base de datos', ToastAndroid.LONG)
			return
		}
	}

	if (user_version < 2) {
		const { succes, message } = await executeQuery(
			'ALTER TABLE tasks ADD COLUMN isCompleted BOOLEAN DEFAULT false;'
		)

		if (!succes) {
			LOGGER.error(message)
			ToastAndroid.show('No se pudo migrar la base de datos', ToastAndroid.LONG)
			return
		}
		await executeQuery('PRAGMA user_version = 2;')
	}
}