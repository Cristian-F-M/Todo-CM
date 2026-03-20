import { useCallback, useEffect, useState } from 'react'
import pkg from '@/package.json' with { type: 'json' }
import { useRelease as useReleaseStore } from '@/state/release'
import type { GetLatestAppDataReturn, ReleaseData } from '@/types/release'
import { LOGGER } from '@/utils/logger'

export default function useRelease() {
	const { data, setData } = useReleaseStore()
	const [needUpdate, setNeedUpdate] = useState(false)

	const getLatestAppData =
		useCallback(async (): Promise<GetLatestAppDataReturn> => {
			try {
				const response = await fetch(
					'https://api.github.com/repos/Cristian-F-M/Todo-CM/releases/latest'
				)

				if (!response.ok) {
					LOGGER.error('Response is not ok')
					return { succes: false, error: 'Error al obtener los datos' }
				}

				const data = (await response.json()) as ReleaseData

				setData(data)
				return { succes: true, data }
			} catch (error) {
				LOGGER.error(error)
				return { succes: false, error: 'Error al obtener los datos' }
			}
		}, [setData])

	const checkUpdate = useCallback(async () => {
		const response = await getLatestAppData()

		if (!response.succes) return

		const { version } = pkg
		const { tag_name } = response.data

		const v = Number(version.split('.').join(''))
		const t = Number(tag_name.split('.').join(''))

		setNeedUpdate(t > v)
	}, [getLatestAppData])

	useEffect(() => {
		checkUpdate()
	}, [checkUpdate])

	return { data, getLatestAppData, checkUpdate, needUpdate }
}