import { Stack, useGlobalSearchParams } from 'expo-router'
import { useCallback, useEffect, useLayoutEffect, useMemo } from 'react'
import { FlatList, type ListRenderItemInfo, Text, View } from 'react-native'
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated'
import { Folder404 } from '@/components/folder/Folder404'
import { BackgroundIcon } from '@/components/layout/BackgroundIcon'
import { Screen } from '@/components/layout/Screen'
import { StyledPressable } from '@/components/layout/StyledPressable'
import { NoTasks } from '@/components/task/NoTasks'
import { TaskItem } from '@/components/task/TaskItem'
import useFolder from '@/state/Folder'
import { useModal } from '@/state/modal'
import useTask from '@/state/Task'
import type { Task } from '@/types/task'
import { useThemeStyles } from '@/utils/theme'

type TaskRenderItem =
	| Task
	| {
			id: string
			type: string
			title: string
	  }

export default function Folder() {
	const { id } = useGlobalSearchParams()
	const { getTasksByFolderId, getById } = useFolder()
	const { tasks: tasksFromContext } = useTask()
	const { openModal, setFolderId } = useModal()
	const folderId = id as string
	const folder = getById(folderId)
	const themeStyles = useThemeStyles()
	const opacity = useSharedValue(1)

	// biome-ignore lint/correctness/useExhaustiveDependencies: Is necessary add tasksFromContext to the dependency array to update the tasks when a new task is created
	const tasks = useMemo(() => {
		return getTasksByFolderId(folderId).toReversed()
	}, [folderId, getTasksByFolderId, tasksFromContext])

	const sortedTasks = useMemo(
		() =>
			[...tasks].sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted)),
		[tasks]
	)

	const completedTasks = useMemo(() => {
		return sortedTasks.filter((task) => task.isCompleted)
	}, [sortedTasks])

	const pendingTasks = useMemo(() => {
		return sortedTasks.filter((task) => !task.isCompleted)
	}, [sortedTasks])

	const parseFlatListData = useMemo(() => {
		const getHeader = (id: string, title: string) => {
			return {
				id: `${id.toLowerCase()}-header`,
				type: 'header',
				title
			}
		}

		const getNoTasks = (id: string, title: string) => {
			return {
				id,
				type: 'no-tasks',
				title
			}
		}

		const pendingTaskToRender = !pendingTasks.length
			? getNoTasks('no-pending-tasks', 'No hay tareas pendientes')
			: pendingTasks

		const completedTaskToRender = !completedTasks.length
			? getNoTasks('no-completed-tasks', 'No hay tareas completadas')
			: completedTasks

		return [
			getHeader('pending', 'Pendientes'),
			pendingTaskToRender,
			getHeader('completed', 'Completadas'),
			completedTaskToRender
		].flat()
	}, [pendingTasks, completedTasks])

	const thereAreTasks = tasks.length > 0

	const openCreateTaskModal = useCallback(() => {
		openModal('task')
	}, [openModal])

	const pageTitle = folder ? folder.name : 'Carpeta no encontrada'

	const screenOptions = useMemo(
		() => ({
			headerShown: true,
			title: pageTitle,
			headerStyle: {
				backgroundColor: themeStyles.surface()
			},
			headerTintColor: themeStyles.textPrimary()
		}),
		[pageTitle, themeStyles]
	)

	useLayoutEffect(() => {
		setFolderId(folderId)

		return () => {
			setFolderId(null)
		}
	}, [setFolderId, folderId])

	useEffect(() => {
		const opts = { duration: 800 }

		if (thereAreTasks) opacity.value = withSpring(1, opts)
		else opacity.value = withSpring(0, opts)
	}, [thereAreTasks, opacity])

	const renderItem = useCallback(
		({ item }: ListRenderItemInfo<TaskRenderItem>) => {
			if (!('type' in item)) return <TaskItem task={item as Task} />

			if (item.type === 'no-tasks')
				return (
					<Text
						className="text-sm mb-4"
						style={{ color: themeStyles.textMuted() }}
					>
						{item.title}
					</Text>
				)

			if (item.type === 'header')
				return (
					<Text
						className="text-base my-1"
						style={{ color: themeStyles.textSecondary() }}
					>
						{item.title}
					</Text>
				)

			return null
		},
		[themeStyles]
	)

	if (!folder) return <Folder404 />
	return (
		<Screen safeArea={false}>
			<Stack.Screen options={screenOptions} />
			{thereAreTasks && <BackgroundIcon />}

			<Animated.View
				className="px-2"
				style={{
					opacity
				}}
			>
				<View className="flex flex-row items-center justify-between mt-3 px-2">
					<Text
						className="text-base"
						style={{ color: themeStyles.textSecondary() }}
					>
						{folder.taskCount} tareas
					</Text>
					{thereAreTasks && (
						<View>
							<StyledPressable
								text="Agregar"
								className="max-w-40 px-4"
								onPress={openCreateTaskModal}
							/>
						</View>
					)}
				</View>

				{thereAreTasks && (
					<FlatList
						className="mt-7"
						data={parseFlatListData}
						renderItem={renderItem}
						keyExtractor={(item) => item.id}
					/>
				)}
			</Animated.View>

			{!thereAreTasks && <NoTasks thereAreTasks={thereAreTasks} />}
		</Screen>
	)
}