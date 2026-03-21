import { IconCalendar, IconFileCode } from '@tabler/icons-react-native'
import { useCallback, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import type { Modalize } from 'react-native-modalize'
import {
	DatePickerModal,
	es,
	registerTranslation
} from 'react-native-paper-dates'
import { StyledPressable } from '@/components/layout/StyledPressable'
import { Modal } from '@/components/modal/Modal'
import { DateItem } from '@/components/notification/DateItem'
import { downloadLog } from '@/utils/logs'
import { useThemeStyles } from '@/utils/theme'

registerTranslation('es', es)

interface DownloadLogsModalProps {
	modalRef: React.RefObject<Modalize | null>
}

interface DateRange {
	startDate: Date
	endDate: Date
}

export function DownloadLogsModal({ modalRef }: DownloadLogsModalProps) {
	const themeStyles = useThemeStyles()
	const [dateRange, setDateRange] = useState<DateRange>({
		startDate: new Date(),
		endDate: new Date()
	})
	const [isDateRangeOpen, setIsDateRangeOpen] = useState(false)

	const handleOpenDatePicker = useCallback(() => {
		setIsDateRangeOpen(true)
	}, [])

	return (
		<Modal modalRef={modalRef}>
			<View className="p-4">
				<View>
					<Text
						className="text-xl font-bold"
						style={{
							color: themeStyles.textPrimary()
						}}
					>
						Descargar logs
					</Text>
				</View>

				<View className="mt-3">
					<Pressable
						className="border py-2 px-4 rounded-md flex-row items-center justify-between gap-x-3"
						style={{
							backgroundColor: themeStyles.surfaceSoft(),
							borderColor: themeStyles.border()
						}}
						onPress={handleOpenDatePicker}
					>
						<View className="flex-row items-center gap-x-3">
							<View className="flex-row items-center gap-x-1">
								<DateItem value={dateRange.startDate.getDate()} />
								<Text
									className="text-lg"
									style={{ color: themeStyles.textPrimary() }}
								>
									/
								</Text>
								<DateItem value={dateRange.startDate.getMonth()} />
								<Text
									className="text-lg"
									style={{ color: themeStyles.textPrimary() }}
								>
									/
								</Text>
								<DateItem value={dateRange.startDate.getFullYear()} />
							</View>
							<Text
								className="text-lg"
								style={{ color: themeStyles.textPrimary() }}
							>
								-
							</Text>
							<View className="flex-row items-center gap-x-1">
								<DateItem value={dateRange.endDate.getDate()} />
								<Text
									className="text-lg"
									style={{ color: themeStyles.textPrimary() }}
								>
									/
								</Text>
								<DateItem value={dateRange.endDate.getMonth()} />
								<Text
									className="text-lg"
									style={{ color: themeStyles.textPrimary() }}
								>
									/
								</Text>
								<DateItem value={dateRange.endDate.getFullYear()} />
							</View>
						</View>
						<IconCalendar
							color={themeStyles.textPrimary()}
							width={20}
							height={20}
						/>
					</Pressable>

					<DatePickerModal
						locale="es"
						mode="range"
						visible={isDateRangeOpen}
						onDismiss={() => {
							setIsDateRangeOpen(false)
						}}
						startDate={dateRange.startDate}
						endDate={dateRange.endDate}
						onConfirm={({ startDate, endDate }) => {
							if (!startDate || !endDate) return
							setDateRange({ startDate, endDate })
							setIsDateRangeOpen(false)
						}}
						allowEditing={false}
						validRange={{
							startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
							endDate: new Date()
						}}
						animationType="fade"
						startYear={new Date().getFullYear()}
						endYear={new Date().getFullYear()}
						disableStatusBar
						inputEnabled={false}
					/>

					<StyledPressable
						onPress={() => {
							downloadLog(dateRange)
						}}
						className="mt-4"
						text="Descargar logs"
						icon={(props) => <IconFileCode {...props} size={20} />}
					/>
				</View>
			</View>
		</Modal>
	)
}