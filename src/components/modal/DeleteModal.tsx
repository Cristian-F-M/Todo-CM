import { IconAlertTriangle, IconX } from '@tabler/icons-react-native'
import { useCallback } from 'react'
import { Pressable, Text, View } from 'react-native'
import useFolder from '@/state/Folder'
import { useModal } from '@/state/modal'
import useTask from '@/state/Task'
import { removeNotification } from '@/utils/notifications'
import { useThemeStyles } from '@/utils/theme'
import { StyledPressable } from '../layout/StyledPressable'

export function DeleteModal() {
	const { item, closeModal, setItem } = useModal()
	const { delete: deleteTask } = useTask()
	const { delete: deleteFolder } = useFolder()
	const themeStyles = useThemeStyles()

	const handleDeleteItem = useCallback(async () => {
		if (!item) return

		if (item.type === 'TASK') {
			await deleteTask(item.data.id)
			removeNotification(item.data.notificationId ?? '')
			closeModal('delete')
			return
		}

		await deleteFolder(item.data.id)
		closeModal('delete')
	}, [deleteFolder, deleteTask, closeModal, item])

	const handleCancel = useCallback(() => {
		setItem(null)
		closeModal('delete')
	}, [closeModal, setItem])

	const modalTitle =
		item?.type === 'FOLDER' ? 'Eliminar carpeta' : 'Eliminar tarea'
	const modalType = item?.type === 'FOLDER' ? 'carpeta' : 'tarea'

	return (
		<View className="w-full px-6 py-5 flex-col items-center justify-center">
			<View className="relative w-full flex-row items-center gap-x-3">
				<IconAlertTriangle
					stroke={themeStyles.warning()}
					width={25}
					height={25}
				/>
				<Text
					className="text-2xl font-semibold"
					style={{
						color: themeStyles.textPrimary()
					}}
				>
					{modalTitle}
				</Text>
				<View className="absolute right-0">
					<Pressable
						className="p-1 rounded-lg"
						style={{
							backgroundColor: themeStyles.surfaceSoft()
						}}
						onPress={() => closeModal('delete')}
					>
						<IconX stroke={themeStyles.textPrimary()} width={24} height={24} />
					</Pressable>
				</View>
			</View>
			<View className="mt-4 w-full">
				<Text
					className="text-base"
					style={{
						color: themeStyles.textPrimary()
					}}
				>
					¿Estás seguro de que deseas eliminar la {modalType}{' '}
					<Text
						className="font-semibold"
						style={{
							color: themeStyles.textSecondary()
						}}
					>
						"{item?.data.name}"
					</Text>
					? Esta acción no se puede deshacer.
				</Text>
			</View>
			<View className="flex flex-row justify-between mt-5 w-full">
				<StyledPressable
					text="Cancelar"
					className="w-[48%]"
					style={{
						backgroundColor: 'transparent',
						borderWidth: 1,
						borderColor: themeStyles.border()
					}}
					onPress={handleCancel}
				/>
				<StyledPressable
					text="Eliminar"
					className="w-[48%]"
					onPress={handleDeleteItem}
				/>
			</View>
		</View>
	)
}