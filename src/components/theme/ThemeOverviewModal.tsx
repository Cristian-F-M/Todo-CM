import { IconX } from '@tabler/icons-react-native'
import { useEffect, useState } from 'react'
import {
	Dimensions,
	Modal,
	Pressable,
	ScrollView,
	Text,
	View
} from 'react-native'
import { Portal } from 'react-native-portalize'
import { ColorSquare } from '@/components/createTheme/ColorSquare'
import { useThemeOverview } from '@/state/themeOverview'
import { RGBA, RGBThemeColors, useThemeStyles } from '@/utils/theme'
import { ThemePreview } from '../createTheme/ThemePreview'

export function ThemeOverviewModal({ onDismiss }: { onDismiss?: () => void }) {
	const [isVisible, setIsVisible] = useState(false)
	const { themeToSee, setThemeToSee } = useThemeOverview()
	const { height: screenHeight } = Dimensions.get('window')
	const themeStyles = useThemeStyles()

	useEffect(() => {
		setIsVisible(!!themeToSee)
	}, [themeToSee])

	const handleClose = () => {
		setIsVisible(false)
		onDismiss?.()

		setTimeout(() => {
			setThemeToSee(null)
		}, 200)
	}

	if (!themeToSee) return null

	return (
		<Portal>
			<Modal
				visible={isVisible}
				onDismiss={onDismiss}
				// transparent
				backdropColor={themeStyles.overlay(0.6)}
				animationType="fade"
				onMagicTap={onDismiss}
			>
				<Pressable
					onPress={handleClose}
					className="absolute inset-0 w-full h-full"
				></Pressable>
				<View className="w-full h-full items-center justify-center">
					<View
						className="mx-auto rounded-2xl overflow-hidden"
						style={{
							width: '90%',
							maxHeight: screenHeight * 0.6,

							// fondo tipo glass
							backgroundColor: themeStyles.surface(),

							// borde suave tipo web
							borderWidth: 1,
							borderColor: themeStyles.border(),

							// sombras suaves
							shadowColor: '#000',
							shadowOpacity: 0.15,
							shadowRadius: 20,
							shadowOffset: { width: 0, height: 10 },

							// android elevation
							elevation: 8
						}}
					>
						<View className="py-5 px-5">
							<ScrollView showsVerticalScrollIndicator={false}>
								<View className="flex-row items-center justify-between mb-4 w-full">
									<View>
										<Text
											className="text-2xl font-bold"
											style={{
												color: themeStyles.textPrimary()
											}}
										>
											{themeToSee.name}
										</Text>
										<Text
											className="text-sm"
											style={{
												color: themeStyles.textMuted()
											}}
										>
											{themeToSee.variant}
										</Text>
									</View>
									<Pressable
										className="rounded-full p-1 self-start mb-auto"
										style={{
											alignSelf: 'flex-start'
										}}
										onPress={handleClose}
									>
										<IconX size={20} color={themeStyles.textPrimary()} />
									</Pressable>
								</View>

								<View className="flex-row gap-1 flex-wrap mb-6">
									{Object.entries(themeToSee.colors).map(([key, color]) => (
										<ColorSquare
											key={key}
											value={RGBA(color)}
											className="rounded-md"
										/>
									))}
								</View>

								<ThemePreview
									name={themeToSee.name}
									theme={RGBThemeColors(themeToSee.colors)}
								/>
							</ScrollView>
						</View>
					</View>
				</View>
			</Modal>
		</Portal>
	)
}