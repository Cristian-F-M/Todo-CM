import * as SQLite from 'expo-sqlite'
import type { Params } from '@/types/database'
import { LOGGER } from '@/utils/logger'

export function connectDB() {
	try {
		const db = SQLite.openDatabaseSync('todo-cm.db', {
			useNewConnection: true
		})
		return db
	} catch (err: unknown) {
		LOGGER.error(err)
	}
}

export function runScript(query: string) {
	const db = connectDB()

	if (!db) return { succes: false, message: 'Database connection failed' }

	try {
		db.execSync(query)
		return { succes: true }
	} catch (err: unknown) {
		LOGGER.error(err)
		return { succes: false, message: 'Query execution failed' }
	} finally {
		db.closeSync()
	}
}

export function executeQuery(query: string, ...params: Params) {
	const db = connectDB()

	if (!db) return { succes: false, message: 'Database connection failed' }

	try {
		const result = db.runSync(query, ...params)
		return { succes: true, result }
	} catch (err: unknown) {
		LOGGER.error(err)
		return { succes: false, message: 'Query execution failed' }
	} finally {
		db.closeSync()
	}
}

export function select<T>(query: string, ...params: Params) {
	const db = connectDB()

	if (!db) return { succes: false, message: 'Database connection failed' }

	try {
		const result = db.getFirstSync<T>(query, params)
		return { succes: true, result }
	} catch (err: unknown) {
		LOGGER.error(err)
		return { succes: false, message: 'Query execution failed' }
	} finally {
		db.closeSync()
	}
}

export function selectAll<T>(query: string, ...params: Params) {
	const db = connectDB()

	if (!db) return { succes: false, message: 'Database connection failed' }

	try {
		const result = db.getAllSync<T>(query, params)
		return { succes: true, result }
	} catch (err: unknown) {
		LOGGER.error(err)
		return { succes: false, message: 'Query execution failed' }
	} finally {
		db.closeSync()
	}
}