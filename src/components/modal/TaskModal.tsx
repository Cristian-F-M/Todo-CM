import { IconBell } from '@tabler/icons-react-native'
import { useCallback, useMemo, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { Switch } from 'react-native-gesture-handler'
import Animated, { LinearTransition } from 'react-native-reanimated'
import uuid from 'react-native-uuid'
import { twMerge } from 'tailwind-merge'
import { Input } from '@/components/layout/Input'
import { TimePicker } from '@/components/TimePicker/TimePicker'
import { useModal } from '@/state/modal'
import useTask from '@/state/Task'
import type { NotificationType } from '@/types/modal'
import type { TimeValueType } from '@/types/timePicker'
import { formatDateString, sumDate } from '@/utils/dateTime'
import { removeNotification, sendNotification } from '@/utils/notifications'
import { useThemeStyles } from '@/utils/theme'
import { zodParse } from '@/utils/zod'
import { createTaskSchema } from '@/zod-schemes/task'
import { DateTimePicker } from '../DateTimePicker/DateTimePicker'
import { StyledPressable } from '../layout/StyledPressable'
import { CheckboxNotificationGroup } from '../notification/CheckboxNotificationGroup'

export function TaskModal() {
	const { item, closeModal, folderId } = useModal()
	const { update, create } = useTask()
	const [error, setError] = useState<string | null>(null)
	const [textInput, setTextInput] = useState<string>(item?.data.name || '')
	const [notificate, setNotificate] = useState(false)
	const [notificationType, setNotificationType] =
		useState<NotificationType>('TIME')
	const [timeValue, setTimeValue] = useState<TimeValueType>({
		hours: 0,
		minutes: 0
	})
	const [dateTimeValue, setDateTimeValue] = useState(new Date())
	const themeStyles = useThemeStyles()

	const thereIsItem = !!item
	const modalTitle = thereIsItem ? 'Editar tarea' : 'Crear tarea'
	const pressableText = thereIsItem ? 'Guardar' : 'Agregar'

	const handleSubmit = useCallback(async () => {
		const taskName = textInput.trim()
		const date =
			notificationType === 'DATE_TIME'
				? dateTimeValue
				: sumDate(dateTimeValue, timeValue)

		let notificationId: string | null = null
		if (notificate) {
			notificationId = await sendNotification({
				title: taskName,
				trigger: { date }
			})

			if (!notificationId) return
		}

		const result = zodParse(createTaskSchema, {
			title: taskName
		})

		if (!result.success) {
			setError(result.errors.title)
			return
		}

		if (thereIsItem && item.type === 'TASK') {
			if (notificate) removeNotification(item.data.notificationId ?? '')

			await update({ ...item.data, name: taskName, notificationId })
			closeModal('task')

			return
		}

		if (!folderId) return

		const newTask = {
			id: uuid.v4(),
			name: taskName,
			folderId,
			isCompleted: false,
			notificationId
		}

		await create(newTask)

		closeModal('task')
	}, [
		thereIsItem,
		textInput,
		update,
		create,
		item,
		closeModal,
		folderId,
		notificate,
		dateTimeValue,
		notificationType,
		timeValue
	])

	const handleChangeNotificationType = useCallback((type: NotificationType) => {
		setTimeValue({ hours: 0, minutes: 0 })
		setDateTimeValue(new Date())
		setNotificationType(type)
	}, [])

	const handleSetNotificate = useCallback((active: boolean) => {
		setNotificate(active)
		if (!active) {
			setTimeValue({ hours: 0, minutes: 0 })
			setDateTimeValue(new Date())
			setNotificationType('TIME')
		}
	}, [])

	const notificationText = useMemo(() => {
		if (notificationType === 'TIME') {
			if (!timeValue.hours && !timeValue.minutes) return 'No te notificatemos.'
			const hoursText = timeValue.hours
				? `${timeValue.hours} hora(s)${timeValue.minutes ? ' y ' : ''}`
				: ''
			const minutesText = timeValue.minutes
				? `${timeValue.minutes} minuto(s).`
				: ''
			return `Te notificatemos en: ${hoursText}${minutesText}`
		}

		return `Te notificatemos el: ${formatDateString(dateTimeValue)}`
	}, [notificationType, timeValue, dateTimeValue])

	return (
		<View className="relative flex-1 mx-aito w-full px-4 py-6">
			{/* <header /> */}
			<View className="flex-row items-center justify-between relative">
				<Text
					className="text-start text-2xl font-semibold tracking-wider"
					style={{
						color: themeStyles.textPrimary()
					}}
				>
					{modalTitle}
				</Text>
			</View>
			{/* <main /> */}
			<View>
				{/* <input-container /> */}
				<View className="mt-6">
					<Input
						multiline={true}
						numberOfLines={6}
						textAlignVertical="top"
						value={textInput}
						placeholder="Nombre de la tarea"
						onValueChange={(value) => {
							setError(null)
							setTextInput(value)
						}}
						error={error}
					/>
				</View>

				{/* <notification-container> */}
				<Animated.View
					layout={LinearTransition.duration(200)}
					className={twMerge(
						'rounded-lg mt-4 overflow-hidden',
						notificate && 'pb-4'
					)}
					style={{
						backgroundColor: themeStyles.surface(),
						borderColor: themeStyles.border()
					}}
				>
					{/* <header /> */}
					<Pressable
						onPress={() => handleSetNotificate(!notificate)}
						className={twMerge(
							'flex flex-row gap-2 items-center justify-between px-2 py-2 w-full'
						)}
						style={{
							backgroundColor: notificate
								? themeStyles.surfaceSoft()
								: 'transparent'
						}}
					>
						<View className="flex flex-row gap-2 items-center">
							<IconBell
								color={themeStyles.textMuted()}
								width={18}
								height={18}
							/>
							<Text
								style={{
									color: themeStyles.textPrimary()
								}}
							>
								Notificar
							</Text>
						</View>
						<Switch
							trackColor={{
								false: themeStyles.textSecondary(),
								true: themeStyles.primary()
							}}
							thumbColor={themeStyles.textPrimary()}
							value={notificate}
							onValueChange={handleSetNotificate}
						/>
					</Pressable>

					{/* <main /> */}
					{notificate && (
						<View className="flex flex-row gap-x-4 mt-2 items-center justify-between rounded-lg px-3 py-1">
							<View
								className="h-full w-1 rounded"
								style={{
									backgroundColor: themeStyles.primary()
								}}
							></View>
							<View className="w-full flex-col pl-4 py-3 flex-1">
								<CheckboxNotificationGroup
									notificationType={notificationType}
									onChange={handleChangeNotificationType}
								/>
								<View className="mt-4">
									{notificationType === 'TIME' && (
										<TimePicker value={timeValue} onChange={setTimeValue} />
									)}
									{notificationType === 'DATE_TIME' && (
										<DateTimePicker
											value={dateTimeValue}
											onValueChange={setDateTimeValue}
										/>
									)}
								</View>
								{/* <notificate-at-container> */}
								<View
									className="mt-6 w-full flex flex-row gap-x-2 items-center px-3 py-2 rounded"
									style={{
										backgroundColor: themeStyles.surfaceSoft()
									}}
								>
									<IconBell
										color={themeStyles.textMuted()}
										width={18}
										height={18}
									/>

									<Text
										className="text-sm mt-px flex-1"
										style={{
											color: themeStyles.textPrimary()
										}}
									>
										{notificationText}
									</Text>
								</View>
							</View>
						</View>
					)}
				</Animated.View>
				<View className="mt-2">
					<StyledPressable
						text={pressableText}
						className="mt-3"
						onPress={handleSubmit}
					/>
				</View>
			</View>
		</View>
	)
}