import { useRealese } from '@/state/realese'
import type { RealeseData } from '@/types/realese'
import { LOGGER } from '@/utils/logger'

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
