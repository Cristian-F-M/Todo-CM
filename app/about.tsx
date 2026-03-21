import { useNetInfo } from '@react-native-community/netinfo'
import {
	IconBugFilled,
	IconCopy,
	IconMessageReportFilled
} from '@tabler/icons-react-native'
import * as Clipboard from 'expo-clipboard'
import * as Linking from 'expo-linking'
import { Stack } from 'expo-router'
import type { ExtendedStackNavigationOptions } from 'expo-router/build/layouts/StackClient'
import { useCallback, useMemo, useState } from 'react'
import {
	ActivityIndicator,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	ToastAndroid,
	View
} from 'react-native'
import { SocialNetworks } from '@/components/about/social-networks/SocialNetworks'
import { Screen } from '@/components/layout/Screen'
import { APP_INFO, BASE_SEND_MESSAGE, BASE_URL } from '@/constants/about'
import useRelease from '@/hooks/useRelease'
import CMLogo from '@/icons/CMLogo'
import { useModal } from '@/state/modal'
import { useThemeStyles } from '@/utils/theme'
import packageJson from '../package.json'

export default function AboutPage() {
	const [isSearchingUpdate, setIsSearchingUpdate] = useState(false)
	const [searchUpdateText, setSearchUpdateText] = useState(
		'Buscar actualización'
	)
	const { checkUpdate, needUpdate, data } = useRelease()
	const themeStyles = useThemeStyles()
	const { openModal } = useModal()
	const netInfo = useNetInfo()

	const styles = StyleSheet.create({
		card: {
			paddingHorizontal: 10,
			paddingVertical: 10,
			borderWidth: 1,
			borderColor: themeStyles.border(),
			alignSelf: 'center',
			borderRadius: 8,
			display: 'flex',
			flexDirection: 'row',
			width: '100%',
			gap: 10
		},
		cardText: {
			color: themeStyles.textPrimary()
		},
		cardTexts: {
			flex: 1
		}
	})

	const screenOptions = useMemo<ExtendedStackNavigationOptions>(
		() => ({
			headerShown: true,
			headerTitle: '',
			headerTitleAlign: 'center',
			headerStyle: {
				backgroundColor: themeStyles.surface()
			},
			headerTintColor: themeStyles.textPrimary()
		}),
		[themeStyles]
	)

	const handleCopySystemInfo = useCallback(async () => {
		const systemInfo = APP_INFO.map(([key, value]) => `${key}: ${value}`).join(
			'\n'
		)
		await Clipboard.setStringAsync(systemInfo)
		ToastAndroid.show('Información copiada', ToastAndroid.SHORT)
	}, [])

	const handleSendFeedback = useCallback(() => {
		const subject = `Give feedback for app ${packageJson.name}`
		const body = `${BASE_SEND_MESSAGE}\n\rComentarios:\n`
		const url = `${BASE_URL}?subject=${subject}&body=${body}`
		Linking.openURL(url)
	}, [])

	const handleSendBugReport = useCallback(() => {
		const subject = `Bug Report for app ${packageJson.name}`
		const body = `${BASE_SEND_MESSAGE}\n\rReporte:\n`

		const url = `${BASE_URL}?subject=${subject}&body=${body}`
		Linking.openURL(url)
	}, [])

	const handleSearchUpdate = useCallback(async () => {
		if (!netInfo.isConnected) {
			ToastAndroid.show('No hay conexión a internet :(', ToastAndroid.SHORT)
			return
		}

		setIsSearchingUpdate(true)
		await checkUpdate()
		setIsSearchingUpdate(false)

		if (!data) return

		if (needUpdate) {
			openModal('update')
			setSearchUpdateText(`Versión disponible: ${data.tag_name}`)
			return
		}

		setSearchUpdateText('Estás en la última versión')
	}, [checkUpdate, openModal, needUpdate, data, netInfo])

	return (
		<Screen className="w-[90%] mx-auto">
			<ScrollView showsVerticalScrollIndicator={false} className="py-4">
				<Stack.Screen options={screenOptions} />
				{/* <header /> */}
				<View className="items-center">
					<View
						className="rounded-full p-4"
						style={{
							backgroundColor: themeStyles.primary(0.4)
						}}
					>
						<CMLogo width={40} height={40} color={themeStyles.textPrimary()} />
					</View>
					{/* <version /> */}
					<View className="mt-1 items-center">
						<Text
							style={{
								color: themeStyles.textSecondary()
							}}
						>
							versión {packageJson.version}
						</Text>
						{/* <find-new-version /> */}
						{isSearchingUpdate && <ActivityIndicator size={14} />}
						{!isSearchingUpdate && (
							<Pressable onPress={handleSearchUpdate}>
								<Text
									className="text-xs underline"
									style={{
										color: themeStyles.textSecondary()
									}}
								>
									{searchUpdateText}
								</Text>
							</Pressable>
						)}
					</View>
				</View>

				{/* <social-networks /> */}
				<SocialNetworks />

				{/* <rate-app /> */}
				{/* work in progress |> App is not in play store */}

				<View className="flex-col gap-y-5 mt-10">
					{/* <feedback /> */}
					<Pressable style={styles.card} onPress={handleSendFeedback}>
						<View>
							<IconMessageReportFilled
								color={themeStyles.textPrimary()}
								size={24}
							/>
						</View>
						<View style={styles.cardTexts}>
							<Text className="font-semibold" style={styles.cardText}>
								Comentarios
							</Text>
							<Text
								style={{
									color: themeStyles.textMuted()
								}}
							>
								Comparte sugerencias o comentarios con nosotros.
							</Text>
						</View>
					</Pressable>

					{/* <bug-report /> */}
					<Pressable style={styles.card} onPress={handleSendBugReport}>
						<View>
							<IconBugFilled color={themeStyles.textPrimary()} size={24} />
						</View>
						<View style={styles.cardTexts}>
							<Text className="font-semibold" style={styles.cardText}>
								Reportar un error
							</Text>
							<Text
								style={{
									color: themeStyles.textMuted()
								}}
							>
								Ayúdanos a mejorar la aplicación.
							</Text>
						</View>
					</Pressable>
				</View>

				{/* <app-information /> */}
				<View className="mt-6">
					<View className="flex-row items-center justify-between">
						<Text
							style={{
								color: themeStyles.textSecondary()
							}}
						>
							Información de la aplicación
						</Text>
						<Pressable
							onPress={handleCopySystemInfo}
							className="active:bg-surface-soft p-1 rounded"
						>
							<IconCopy color={themeStyles.textMuted()} size={20} />
						</Pressable>
					</View>

					<View
						className="mt-2 mb-10"
						style={[styles.card, { flexDirection: 'column' }]}
					>
						{APP_INFO.map(([key, value], index) => (
							<View key={key}>
								<View className="flex-row items-center justify-between">
									<Text
										style={{
											color: themeStyles.textSecondary()
										}}
									>
										{key}
									</Text>
									<Text
										style={{
											color: themeStyles.textPrimary()
										}}
									>
										{value}
									</Text>
								</View>
								{index < APP_INFO.length - 1 && (
									<View
										className="h-[1px] my-2"
										style={{
											backgroundColor: themeStyles.border()
										}}
									/>
								)}
							</View>
						))}
					</View>
				</View>
			</ScrollView>
		</Screen>
	)
}