import * as FileSystem from 'expo-file-system'
import {
	consoleTransport,
	logger,
	type transportFunctionType
} from 'react-native-logs'

const currentDate = new Date()
	.toLocaleString('es-CO', {
		timeZone: 'America/Bogota',
		day: 'numeric',
		month: '2-digit',
		year: 'numeric'
	})
	.replace(/\//g, '-')

const logsDir = new FileSystem.Directory(FileSystem.Paths.document, 'logs')
if (!logsDir.exists) logsDir.create()
export const LOG_FILE = new FileSystem.File(logsDir, `${currentDate}.log`)
if (!LOG_FILE.exists) LOG_FILE.create()

// biome-ignore lint/suspicious/noExplicitAny: -
const fileTransport: transportFunctionType<any> = async ({ msg, level }) => {
	try {
		const existing = LOG_FILE.textSync()

		const line = `[${new Date().toISOString()}] [${level.text}] ${msg}\n`

		LOG_FILE.write(existing + line)
	} catch (error) {
		console.error('Error escribiendo log:', error)
	}
}

export const LOGGER = logger.createLogger({
	transport: __DEV__ ? consoleTransport : fileTransport,
	severity: __DEV__ ? 'debug' : 'error'
})