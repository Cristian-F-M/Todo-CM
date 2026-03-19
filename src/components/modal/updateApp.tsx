import { IconDownload, IconExternalLink } from '@tabler/icons-react-native'
import { Link } from 'expo-router'
import { useMemo, useState } from 'react'
import { Image, Linking, Pressable, Text, View } from 'react-native'
import Markdown from 'react-native-markdown-renderer'
import type { SvgProps } from 'react-native-svg'
import { useRealese } from '@/state/realese'
import { useThemeStyles } from '@/utils/theme'
import { downloadApp, getIsValidAPK } from '@/utils/updateApp'
import { StyledPressable } from '../layout/StyledPressable'

export function UpdateAppModal() {
	const themeStyles = useThemeStyles()
	const { data, progress } = useRealese()
	const [height, setHeight] = useState<number | 'auto'>(140)
	// biome-ignore lint/correctness/useExhaustiveDependencies: It is neccesary
	const isValidAPK = useMemo(() => getIsValidAPK(), [data])

	if (!data) return null

	const { tag_name, published_at, body } = data
	let downloadTextButton = `Descargar (${Math.floor(data.assets[0].size / 1e6)} MB)`
	if (progress) downloadTextButton = `${progress}%`
	if (progress === 100 || isValidAPK) downloadTextButton = 'Instalar'

	return (
		<View className="px-2 py-4">
			<View className="flex-col justify-center">
				<Text
					className="text-lg font-bold leading-tight"
					style={{
						color: themeStyles.textPrimary()
					}}
				>
					Nueva versión disponible
				</Text>
				<Text
					className="text-xs"
					style={{
						color: themeStyles.textMuted()
					}}
				>
					v{tag_name}
				</Text>
			</View>
			<View
				className="mt-5 p-3 rounded-lg"
				style={{
					backgroundColor: themeStyles.surface()
				}}
			>
				<View>
					<Text
						className="text-sm font-bold leading-tight"
						style={{
							color: themeStyles.textPrimary()
						}}
					>
						Versión {tag_name}
					</Text>
					<Text
						className="text-xs"
						style={{
							color: themeStyles.textMuted()
						}}
					>
						Publicado el{' '}
						{new Date(published_at).toLocaleDateString('es-CO', {
							dateStyle: 'long'
						})}
					</Text>
				</View>

				<View
					style={{
						height,
						overflow: 'hidden'
					}}
				>
					<Markdown
						style={{
							text: {
								color: themeStyles.textPrimary(),
								fontSize: 14
							},
							link: {
								fontSize: 14,
								textDecorationLine: 'underline',
								color: themeStyles.textPrimary()
							},
							hr: {
								backgroundColor: themeStyles.textMuted(),
								height: 2
							}
						}}
					>
						{body}
					</Markdown>
				</View>
				<Pressable
					className="ml-auto mt-4 text-sm active:bg-surface-soft px-1 py-1 rounded "
					onPress={() => setHeight((prev) => (prev === 'auto' ? 140 : 'auto'))}
				>
					<Text
						style={{
							color: themeStyles.textSecondary()
						}}
					>
						{height === 'auto' ? 'ver menos' : 'ver más...'}
					</Text>
				</Pressable>
			</View>

			<Link
				href={data.author.html_url}
				asChild
				className="mt-4 active:bg-surface-soft p-3 rounded-lg"
				style={{
					backgroundColor: themeStyles.surface()
				}}
			>
				<Pressable className="flex-row items-center gap-x-2">
					<View className="rounded-full overflow-hidden">
						<Image
							className="rounded-full"
							width={30}
							height={30}
							source={{ uri: data.author.avatar_url }}
						/>
					</View>

					<View>
						<Text
							style={{
								color: themeStyles.textPrimary()
							}}
						>
							{data.author.login}
						</Text>
						<Text
							className="text-xs"
							style={{
								color: themeStyles.textSecondary()
							}}
						>
							Desarrollador
						</Text>
					</View>
				</Pressable>
			</Link>

			<View className="flex-row justify-between">
				<StyledPressable
					onPress={() => {
						if (progress !== null) return
						downloadApp()
					}}
					text={downloadTextButton}
					className="mt-4 active:bg-surface-soft p-3 rounded-lg w-[60%]"
					style={{
						backgroundColor: themeStyles.surface()
					}}
					icon={(props: SvgProps) => <IconDownload {...props} size={20} />}
					disabled={!!progress && progress > 0 && progress < 100}
				/>
				<StyledPressable
					onPress={() => Linking.openURL(data.html_url)}
					text="GitHub"
					className="mt-4 active:bg-surface-soft p-3 rounded-lg w-[38%]"
					style={{
						borderWidth: 1,
						borderColor: themeStyles.border(),
						backgroundColor: 'transparent'
					}}
					icon={(props: SvgProps) => <IconExternalLink {...props} size={20} />}
				/>
			</View>
		</View>
	)
}