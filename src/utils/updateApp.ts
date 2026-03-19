import * as FileSystem from 'expo-file-system'
import { createDownloadResumable } from 'expo-file-system/legacy'
import * as Notifications from 'expo-notifications'
import { ToastAndroid } from 'react-native'
import { useModal } from '@/state/modal'
import { useRealese } from '@/state/realese'
import type { RealeseData } from '@/types/realese'
import { LOGGER } from '@/utils/logger'
import pkg from '../../package.json' with { type: 'json' }
import { getNotificationsPermissions } from './notifications'

type GetLatestAppDataReturn =
	| {
			succes: true
			data: RealeseData
	  }
	| {
			succes: false
			error: string
	  }

export async function getLatestAppData(): Promise<GetLatestAppDataReturn> {
	try {
		const response = await fetch(
			'https://api.github.com/repos/Cristian-F-M/Todo-CM/releases/latest'
		)

		if (!response.ok)
			return { succes: false, error: 'Error al obtener los datos' }

		const data = (await response.json()) as RealeseData

		useRealese.getState().setData(data)
		return { succes: true, data }
	} catch (error) {
		LOGGER.error(error)
		return { succes: false, error: 'Error al obtener los datos' }
	}
}

export async function checkUpdate() {
	const response = await getLatestAppData()
	const { openModal } = useModal.getState()

	if (!response.succes) return null

	const { version } = pkg
	const { tag_name } = response.data

	const v = Number(version.split('.').join(''))
	const t = Number(tag_name.split('.').join(''))

	if (t > v) return openModal('update')
}

export async function downloadApp() {
	const { data } = useRealese.getState()
	const assets = data?.assets ?? []
	const asset = assets.find((asset) => asset.name.includes('apk'))
	const { setProgress } = useRealese.getState()
	let lastPercent = 0

	if (!data || !asset)
		return ToastAndroid.show('Error al descargar la app', ToastAndroid.SHORT)

	let path: string | FileSystem.File = FileSystem.Paths.join(
		FileSystem.Paths.cache.uri,
		`${data.tag_name}.apk`
	)
	path = new FileSystem.File(path)

	if (!getIsValidAPK()) {
		path.delete()
		path = new FileSystem.File(path)
	}

	if (path.exists) return installAPK(path.uri)

	setProgress(0)
	await getNotificationsPermissions()

	const downloadResumable = createDownloadResumable(
		asset.browser_download_url,
		path.uri,
		{},
		(progres) => {
			const percent = Math.floor(
				(progres.totalBytesWritten / progres.totalBytesExpectedToWrite) * 100
			)

			if (percent !== lastPercent) {
				lastPercent = percent
				setProgress(percent)
			}
		}
	)

	try {
		await downloadResumable.downloadAsync()

		installAPK(path.uri)

		// send notification
		const id = await Notifications.scheduleNotificationAsync({
			content: {
				title: 'Aplicación descargada',
				body: 'Aplicación descargada'
			},
			trigger: null
		})

		setTimeout(() => {
			Notifications.dismissNotificationAsync(id)
		}, 5000)
	} catch (error) {
		LOGGER.error(error)
		ToastAndroid.show('Error al descargar la app', ToastAndroid.SHORT)
		setProgress(null)
	}
}