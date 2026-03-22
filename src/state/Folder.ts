import { create } from 'zustand'
import * as FolderDB from '@/database/querys/folder'
import type { Folder } from '@/types/folder'
import type { Task } from '@/types/task'
import useTask from './Task'

interface FolderState {
	folders: Folder[]
	delete: (id: string) => Promise<void>
	update: (folder: Folder) => Promise<void>
	create: (folder: Folder) => Promise<void>
	load: () => Promise<void>
	getById: (id: string) => Folder | undefined
	getTasksByFolderId: (folderId: string) => Task[]
}

const useFolder = create<FolderState>()((set, get) => ({
	folders: [],
	delete: async (id: string) => {
		const { folders } = get()
		await FolderDB.deleteById(id)
		set({ folders: folders.filter((folder) => folder.id !== id) })
	},
	update: async (folder: Folder) => {
		const { folders } = get()
		await FolderDB.update(folder)

		const index = folders.findIndex((f) => f.id === folder.id)
		if (index === -1) return

		const newFolders = [...folders]
		newFolders[index] = folder

		set({ folders: newFolders })
	},
	create: async (folder: Folder) => {
		const { folders } = get()
		await FolderDB.create(folder)
		set({ folders: folders.concat(folder) })
	},
	load: async () => {
		const folders = await FolderDB.getAll()
		set({ folders })
	},
	getById: (id: string) => {
		const { folders } = get()
		return folders.find((folder) => folder.id === id)
	},
	getTasksByFolderId: (folderId: string) => {
		const { tasks } = useTask.getState()
		return tasks.filter((task) => task.folderId === folderId)
	}
}))

export default useFolder