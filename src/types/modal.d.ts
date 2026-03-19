import type { Folder } from './folder'
import type { Task } from './task'

export type ModalItem =
	| { type: 'FOLDER'; data: Folder }
	| { type: 'TASK'; data: Task }
	| null

export interface Modal {
	open: (() => void) | null
	close: (() => void) | null
	isOpen: boolean
}

export interface Modals {
	folder: Modal
	task: Modal
	delete: Modal
	[key: string]: Modal
}

export type ModalKey = keyof Modals
export type ModalFn = (key: ModalKey) => void
export type SetModalFn = (
	key: ModalKey,
	{
		open,
		close
	}: {
		open: () => void
		close: () => void
	}
) => void

export type NotificationType = 'TIME' | 'DATE_TIME'