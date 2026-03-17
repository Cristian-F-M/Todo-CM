import { IconPlus } from '@tabler/icons-react-native'
import { Link } from 'expo-router'
import { Pressable, Text, View } from 'react-native'
import { useTheme } from '@/state/theme'
import { useThemeStyles } from '@/utils/theme'
import { ThemeOverview } from './ThemeOverview'
import { ThemeOverviewModal } from './ThemeOverviewModal'

export function ChangeThemeModalContent({
	closeModal
}: {
	closeModal: () => void
}) {
	const themeStyles = useThemeStyles()
	const { themes, theme } = useTheme()

	return (
		<>
			<View className="flex flex-col w-full" style={{ maxHeight: 400 }}>
				<Text
					className="text-2xl font-bold mb-5"
					style={{ color: themeStyles.textPrimary() }}
				>
					Selecciona un tema
				</Text>

				<View className="mb-6">
					<Link
						href={'/create-theme'}
						className="flex flex-row items-center justify-center gap-x-4 border-2 rounded-2xl py-3"
						asChild
						style={{
							backgroundColor: themeStyles.surface(0.3),
							borderColor: themeStyles.primary(),
							borderStyle: 'dashed'
						}}
					>
						<Pressable
							className="active:scale-95 transition-all"
							onPress={closeModal}
						>
							<View
								className="p-1 rounded-full"
								style={{
									backgroundColor: themeStyles.surfaceSoft()
								}}
							>
								<IconPlus color={themeStyles.primary()} size={20} />
							</View>
							<Text
								className="text-lg font-semibold"
								style={{
									color: themeStyles.primary()
								}}
							>
								Crear nuevo tema
							</Text>
						</Pressable>
					</Link>
				</View>

				<View>
					<Text
						className="text-xl font-bold"
						style={{ color: themeStyles.textSecondary() }}
					>
						Tema seleccionado
					</Text>
					<View>
						<ThemeOverview theme={themes[theme]} themeKey={theme} />
					</View>
				</View>

				<Text
					className="text-xl font-bold mt-10 mb-2"
					style={{ color: themeStyles.textSecondary() }}
				>
					Temas disponibles
				</Text>
			</View>
			<ThemeOverviewModal />
		</>
	)
}