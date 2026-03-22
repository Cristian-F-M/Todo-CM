import {
	IconDotsVertical,
	IconEdit,
	IconTrash
} from '@tabler/icons-react-native'
import { useCallback, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import Animated, { LinearTransition } from 'react-native-reanimated'
import { twMerge } from 'tailwind-merge'
import { Checkbox } from '@/components/Checkbox/Checkbox'
import { ContextMenu } from '@/components/context-menu/ContextMenu'
import { useConfig } from '@/state/config'
import { useModal } from '@/state/modal'
import useTask from '@/state/Task'
import type { Task } from '@/types/task'
import { removeNotification } from '@/utils/notifications'
import { useThemeStyles } from '@/utils/theme'

export function TaskItem({ task }: { task: Task }) {
	const { openModal, setItem } = useModal()
	const [isChecked, setIsChecked] = useState(task.isCompleted)
	const { delete: deleteTask, update } = useTask()
	const { configs } = useConfig()
	const themeStyles = useThemeStyles()

	const handleEditTask = useCallback(() => {
		setItem({ type: 'TASK', data: task })
		openModal('task')
	}, [openModal, setItem, task])

	const handleDeleteTask = useCallback(async () => {
		const { confirmDeleteTask } = configs

		if (!confirmDeleteTask) {
			await deleteTask(task.id)
			removeNotification(task.notificationId ?? '')
			return
		}
		setItem({ type: 'TASK', data: task })
		openModal('delete')
	}, [deleteTask, openModal, setItem, task, configs])

	const handleCompleteTask = useCallback(async () => {
		const newValue = !isChecked

		setIsChecked(newValue)
		await update({ ...task, isCompleted: newValue })
	}, [task, update, isChecked])

	return (
		<Animated.View
			className={twMerge(
				'px-4 py-4 mb-4 items-center rounded-lg inline-flex flex-row justify-between active:opacity-75 border',
				isChecked && 'opacity-95'
			)}
			style={{
				backgroundColor: themeStyles.surface(),
				borderColor: themeStyles.border()
			}}
			layout={LinearTransition.stiffness(2).duration(150)}
		>
			<View className="flex flex-row max-w-60 gap-x-3 items-center">
				<Checkbox value={isChecked} onValueChange={handleCompleteTask} />

				<ScrollView
					showsVerticalScrollIndicator={false}
					nestedScrollEnabled
					style={{ maxHeight: 80 }}
				>
					<Text
						className={twMerge(
							'text-lg h-full mr-auto',
							isChecked && 'opacity-75'
						)}
						onPress={handleCompleteTask}
						style={{
							color: isChecked
								? themeStyles.textMuted()
								: themeStyles.textSecondary()
						}}
					>
						{task.name}
					</Text>
				</ScrollView>
			</View>

			<ContextMenu
				title={task.name}
				items={[
					{
						id: 'edit-task',
						text: 'Editar',
						icon: () => <IconEdit />,
						onPress: handleEditTask
					},
					{
						id: 'delete-task',
						text: 'Eliminar',
						icon: () => <IconTrash />,
						variant: 'destructive',
						onPress: handleDeleteTask
					}
				]}
			>
				<View className="active:bg-primary-pressed p-0.5 rounded-lg">
					<IconDotsVertical size={20} color={themeStyles.textPrimary()} />
				</View>
			</ContextMenu>
		</Animated.View>
	)
}