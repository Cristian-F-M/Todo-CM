import {
	IconDotsVertical,
	IconEdit,
	IconFolder,
	IconTrash
} from '@tabler/icons-react-native'
import { Link } from 'expo-router'
import { useCallback } from 'react'
import { Pressable, Text, View } from 'react-native'
import Animated, { LinearTransition } from 'react-native-reanimated'
import { ContextMenu } from '@/components/context-menu/ContextMenu'
import { useConfig } from '@/state/config'
import useFolder from '@/state/Folder'
import { useModal } from '@/state/modal'
import type { Folder as FolderType } from '@/types/folder'
import { useThemeStyles } from '@/utils/theme'

export function FolderItem({ folder }: { folder: FolderType }) {
	const { openModal, setItem } = useModal()
	const { delete: deleteFolder } = useFolder()
	const { configs } = useConfig()
	const themeStyles = useThemeStyles()

	const openEditModal = useCallback(() => {
		setItem({ type: 'FOLDER', data: folder })
		openModal('folder')
	}, [folder, openModal, setItem])

	const handleClickDeleteFolder = useCallback(async () => {
		const { confirmDeleteFolder } = configs

		if (!confirmDeleteFolder) {
			return deleteFolder(folder.id)
		}

		setItem({ type: 'FOLDER', data: folder })
		openModal('delete')
	}, [deleteFolder, folder, openModal, setItem, configs])

	return (
		<Link
			href={`/folder/${folder.id}`}
			asChild
			className="flex flex-row px-2 py-2 mb-3 min-h-16 rounded-lg justify-between border"
			style={{
				backgroundColor: themeStyles.surface(),
				borderColor: themeStyles.border(),
				maxHeight: 180
			}}
		>
			<Pressable className="w-full flex flex-row items-center justify-center ">
				<Animated.View
					className="flex flex-row flex-1 items-center justify-between"
					layout={LinearTransition.stiffness(2)}
				>
					<View className="flex-1 flex flex-row gap-x-2 items-center justify-center max-h-[60%]">
						<View className="self-start">
							<IconFolder color={themeStyles.textMuted()} />
						</View>
						<View className="flex-1 flex flex-col gap-y-2">
							<Text
								className="text-lg tracking-wider leading-none items-center justify-center overflow-hidden"
								style={{ color: themeStyles.textPrimary() }}
							>
								{folder.name}
							</Text>
							<Text
								className="text-xs leading-none"
								style={{ color: themeStyles.textMuted() }}
							>
								{folder.taskCount} tareas
							</Text>
						</View>
					</View>

					<ContextMenu
						title={folder.name}
						items={[
							{
								id: 'edit-folder',
								text: 'Editar',
								icon: () => <IconEdit />,
								onPress: openEditModal
							},
							{
								id: 'delete-folder',
								text: 'Eliminar',
								icon: () => <IconTrash />,
								variant: 'destructive',
								onPress: handleClickDeleteFolder
							}
						]}
					>
						<View className="active:bg-primary-pressed p-0.5 rounded-lg self-start">
							<IconDotsVertical size={20} color={themeStyles.textPrimary()} />
						</View>
					</ContextMenu>
				</Animated.View>
			</Pressable>
		</Link>
	)
}