import { useModal } from '@/state/modal'
import { useRealese } from '@/state/realese'
import type { RealeseData } from '@/types/realese'
import { LOGGER } from '@/utils/logger'
import pkg from '../../package.json' with { type: 'json' }

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
