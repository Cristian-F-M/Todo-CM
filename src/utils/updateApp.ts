import * as FileSystem from 'expo-file-system'
import { createDownloadResumable } from 'expo-file-system/legacy'
import * as IntentLauncher from 'expo-intent-launcher'
import * as Notifications from 'expo-notifications'
import { ToastAndroid } from 'react-native'
import { useModal } from '@/state/modal'
import { useRelease } from '@/state/release'
import { LOGGER } from '@/utils/logger'
import { getNotificationsPermissions } from './notifications'

export async function downloadApp() {
	const { data } = useRelease.getState()
	const assets = data?.assets ?? []
	const asset = assets.find((asset) => asset.name.includes('apk'))
	const { setProgress } = useRelease.getState()
	let lastPercent = 0

	if (!data || !asset)
		return ToastAndroid.show('Error al descargar la app', ToastAndroid.SHORT)

	let path: string | FileSystem.File = FileSystem.Paths.join(
		FileSystem.Paths.cache.uri,
		`${data.tag_name}.apk`
	)
	path = new FileSystem.File(path)

	if (!getIsValidAPK() && path.exists) {
		path.delete()
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

export async function installAPK(uri: string) {
	const url = new FileSystem.File(uri).contentUri
	const { closeModal } = useModal.getState()

	ToastAndroid.show('Abriendo instalador...', ToastAndroid.SHORT)

	try {
		const { resultCode } = await IntentLauncher.startActivityAsync(
			'android.intent.action.VIEW',
			{
				data: url,
				flags: 1,
				type: 'application/vnd.android.package-archive'
			}
		)

		// TODO: If it is canceled, show a modal asking for install permissions

		if (resultCode === IntentLauncher.ResultCode.Success) {
			closeModal('update')
		}

		if (resultCode !== IntentLauncher.ResultCode.Canceled) return
	} catch (error) {
		LOGGER.error(error)
	}
}

export function getIsValidAPK() {
	const { data } = useRelease.getState()

	if (!data) return false

	const path: string | FileSystem.File = FileSystem.Paths.join(
		FileSystem.Paths.cache.uri,
		`${data.tag_name}.apk`
	)

	const file = new FileSystem.File(path)
	return file.exists && file.size === data.assets[0].size
}