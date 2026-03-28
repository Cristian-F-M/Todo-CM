import { IconArrowLeft, IconPencilPlus } from '@tabler/icons-react-native'
import * as Haptics from 'expo-haptics'
import { router, Stack } from 'expo-router'
import type { ExtendedStackNavigationOptions } from 'expo-router/build/layouts/StackClient'
import { useCallback, useMemo, useRef, useState } from 'react'
import { Pressable, Text, ToastAndroid, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import type { SvgProps } from 'react-native-svg'
import { AutomaticCreation } from '@/components/createTheme/AutomaticCreation'
import { ManualCreation } from '@/components/createTheme/ManualCreation'
import {
	ThemeCreationModeCard,
	type ThemeModeType
} from '@/components/createTheme/ThemeCreationModeCard'
import { Input } from '@/components/layout/Input'
import { Screen } from '@/components/layout/Screen'
import { StyledPressable } from '@/components/layout/StyledPressable'
import type { ThemeKeys } from '@/types/themeColorsEditor'
import { saveTheme, useThemeStyles } from '@/utils/theme'
import { zodParse } from '@/utils/zod'
import { createThemeSchema } from '@/zod-schemes/theme'

export interface ThemeInfo {
	name: string
	variant: string
}
interface Errors {
	name: string
	variant: string
}

export default function CreateTheme() {
	const themeStyles = useThemeStyles()

	const [themeInfo, setThemeInfo] = useState<ThemeInfo>({
		name: '',
		variant: ''
	})
	const [creationMode, setCreationMode] = useState<ThemeModeType>('automatic')
	const [theme, setTheme] = useState<Record<ThemeKeys, string> | undefined>()
	const [errors, setErrors] = useState<Errors>({
		name: '',
		variant: ''
	})
	const scrollViewRef = useRef<ScrollView>(null)

	const handleGoBack = useCallback(() => {
		const canGoBack = router.canGoBack()

		if (canGoBack) return router.back()

		router.replace('/')
	}, [])

	const screenOptions = useMemo<ExtendedStackNavigationOptions>(
		() => ({
			headerShown: true,
			title: 'Creador de temas',
			headerTitleAlign: 'center',
			headerStyle: {
				backgroundColor: themeStyles.surface()
			},
			headerTintColor: themeStyles.textPrimary(),
			headerLeft() {
				return (
					<Pressable onPress={handleGoBack}>
						<IconArrowLeft color={themeStyles.textPrimary()} size={24} />
					</Pressable>
				)
			}
		}),
		[themeStyles, handleGoBack]
	)

	const handleCreateTheme = useCallback(async () => {
		if (!theme) return

		const result = zodParse(createThemeSchema, themeInfo)

		if (!result.success) {
			setErrors(result.errors as unknown as Errors)

			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
			scrollViewRef.current?.scrollTo({
				y: 0,
				animated: true
			})
			return
		}
		const succes = await saveTheme({
			colors: theme,
			...themeInfo
		})

		if (!succes) {
			ToastAndroid.show('Error al crear el tema', ToastAndroid.SHORT)
			return
		}

		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
		ToastAndroid.show('Tema creado', ToastAndroid.SHORT)
		router.back()
	}, [theme, themeInfo])

	return (
		<Screen className="px-4">
			<Stack.Screen options={screenOptions} />
			<ScrollView showsVerticalScrollIndicator={false} ref={scrollViewRef}>
				<View className="mt-4">
					<Text
						className="text-base mb-1"
						style={{
							color: themeStyles.textSecondary()
						}}
					>
						Nombre del tema
					</Text>
					<Input
						value={themeInfo.name}
						onValueChange={(value) => {
							setThemeInfo({ ...themeInfo, name: value.trim() })
							setErrors({ ...errors, name: '' })
						}}
						placeholder="Arctic"
						error={errors.name}
					/>
				</View>
				<View className="mt-4">
					<Text
						className="text-base mb-1"
						style={{
							color: themeStyles.textSecondary()
						}}
					>
						Variante
					</Text>
					<Input
						value={themeInfo.variant}
						onValueChange={(value) => {
							setThemeInfo({ ...themeInfo, variant: value.trim() })
							setErrors({ ...errors, variant: '' })
						}}
						placeholder="Light"
						error={errors.variant}
					/>
				</View>

				<View className="mt-6">
					<Text
						className="text-base mb-2"
						style={{
							color: themeStyles.textSecondary()
						}}
					>
						Modo de creación
					</Text>

					<View className="flex flex-row justify-between w-full">
						<ThemeCreationModeCard
							className="w-[48%]"
							type="automatic"
							selected={creationMode}
							onPress={() => setCreationMode('automatic')}
						/>
						<ThemeCreationModeCard
							className="w-[48%]"
							type="manual"
							selected={creationMode}
							onPress={() => setCreationMode('manual')}
						/>
					</View>
				</View>

				<View className="mt-5 mb-5">
					{creationMode === 'automatic' && (
						<AutomaticCreation onChangeTheme={setTheme} />
					)}
					{creationMode === 'manual' && (
						<ManualCreation onChangeTheme={setTheme} />
					)}

					{theme && (
						<StyledPressable
							className="mt-3"
							onPress={handleCreateTheme}
							text="Crear tema"
							icon={(props: SvgProps) => <IconPencilPlus {...props} />}
						/>
					)}
				</View>
			</ScrollView>
		</Screen>
	)
}