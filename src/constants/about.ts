import * as Constants from 'expo-constants'
import * as Device from 'expo-device'
import packageJson from '@/package.json'

export const APP_INFO = [
	['Version', packageJson.version],
	['Developer', packageJson.author.name],
	['License', packageJson.license],
	['Environment', process.env.NODE_ENV || 'development'],
	['Platform', Device.osName || 'Unknown'],
	['OS Version', String(Device.platformApiLevel)],
	['System version', String(Constants.default.systemVersion)],
	['Device', Device.modelName || 'Unknown']
] satisfies [string, string][]

export const BASE_SEND_MESSAGE = `
  \r Hola ${packageJson.author.name}

	\r Device's Detail:
	\r${APP_INFO.map(([key, value]) => `${key}: ${value}`).join('\n')}
	`

export const BASE_URL = `mailto:${packageJson.author.email}`