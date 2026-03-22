import * as SQLite from 'expo-sqlite'
import type { Params } from '@/types/database'
import { LOGGER } from '@/utils/logger'

export async function connectDB() {
	try {
		const db = await SQLite.openDatabaseAsync('todo-cm.db', {
			useNewConnection: true
		})
		return db
	} catch (err: unknown) {
		LOGGER.error(err)
	}
}

export async function runScript(query: string) {
	const db = await connectDB()

	if (!db) return { succes: false, message: 'Database connection failed' }

	try {
		await db.execAsync(query)
		return { succes: true }
	} catch (err: unknown) {
		LOGGER.error(err)
		return { succes: false, message: 'Query execution failed' }
	} finally {
		db.closeSync()
	}
}

export async function executeQuery(query: string, ...params: Params) {
	const db = await connectDB()

	if (!db) return { succes: false, message: 'Database connection failed' }

	try {
		const result = await db.runAsync(query, ...params)
		return { succes: true, result }
	} catch (err: unknown) {
		LOGGER.error(err)
		return { succes: false, message: 'Query execution failed' }
	} finally {
		db.closeSync()
	}
}

export async function select<T>(query: string, ...params: Params) {
	const db = await connectDB()

	if (!db) return { succes: false, message: 'Database connection failed' }

	try {
		const result = await db.getFirstAsync<T>(query, params)
		return { succes: true, result }
	} catch (err: unknown) {
		LOGGER.error(err)
		return { succes: false, message: 'Query execution failed' }
	} finally {
		db.closeSync()
	}
}

export async function selectAll<T>(query: string, ...params: Params) {
	const db = await connectDB()

	if (!db) return { succes: false, message: 'Database connection failed' }

	try {
		const result = await db.getAllAsync<T>(query, params)
		return { succes: true, result }
	} catch (err: unknown) {
		LOGGER.error(err)
		return { succes: false, message: 'Query execution failed' }
	} finally {
		db.closeSync()
	}
}