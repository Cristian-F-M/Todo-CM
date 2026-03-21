import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import { ToastAndroid } from 'react-native'
import { zip } from 'react-native-zip-archive'
import { LOGGER } from './logger'

const logsDir = new FileSystem.Directory(FileSystem.Paths.document, 'logs')

export async function downloadLog({
	startDate,
	endDate
}: {
	startDate: Date
	endDate: Date
}) {
	const MS_PER_DAY = 24 * 60 * 60 * 1000
	const daysOfDifference =
		Math.floor((endDate.getTime() - startDate.getTime()) / MS_PER_DAY) + 1

	const filesNames = Array.from({ length: daysOfDifference }).map((_, i) => {
		const date = new Date(startDate)
		date.setDate(startDate.getDate() + i)
		return `${getLogFileName(date)}.log`
	})

	const files = filesNames
		.map((fileName) => {
			const file = new FileSystem.File(logsDir, fileName)
			if (!file.exists) return null
			return file.uri
		})
		.filter((f) => !!f) as string[]

	if (!files.length) {
		ToastAndroid.show(
			'No hay logs disponibles para ese rango',
			ToastAndroid.SHORT
		)
		LOGGER.error(`There are not logs between ${startDate} and ${endDate}`)
		return
	}

	const zipLogsName = `${getLogFileName(startDate)}--${getLogFileName(endDate)}.zip`
	const zipFile = new FileSystem.File(logsDir, zipLogsName)

	try {
		await zip(files, zipFile.uri)

		if (!zipFile.exists) {
			ToastAndroid.show(
				'Ocurrio un error creando el archivo .zip :(',
				ToastAndroid.SHORT
			)
			LOGGER.error(
				`Zip file with logs with name ${zipLogsName} doesn't exists `
			)
			return
		}

		const isSharingAvailable = await Sharing.isAvailableAsync()

		if (!isSharingAvailable) {
			ToastAndroid.show('Compartir no está disponible :(', ToastAndroid.SHORT)
			LOGGER.warn('Sharing is not available in this device')
			return
		}

		await Sharing.shareAsync(zipFile.uri)
	} catch (err) {
		LOGGER.error(err)
		ToastAndroid.show(
			'Ocurrio un error creando el archivo .zip :(',
			ToastAndroid.SHORT
		)
		return
	} finally {
		if (zipFile.exists) zipFile.delete()
	}
}

export function getLogFileName(date: Date) {
	const day = date.getDate()
	const month = date.getMonth() + 1
	const year = date.getFullYear()

	const filename = [day, month, year]
		.map((v) => String(v).padStart(2, '0'))
		.join('-')
	return filename
}