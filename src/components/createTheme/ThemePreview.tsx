import { Pressable, Text, View, type ViewProps } from 'react-native'
import { twMerge } from 'tailwind-merge'
import type { ThemeObject } from '@/types/theme'

export interface ThemePreviewProps extends ViewProps {
	name: string
	theme: ThemeObject['colors']
}

export function ThemePreview({
	name,
	theme,
	className,
	style,
	...props
}: ThemePreviewProps) {
	return (
		<View
			className={twMerge('px-3 py-3 rounded', className)}
			style={[
				{
					backgroundColor: theme.background
				},
				style
			]}
			{...props}
		>
			{/* <header /> => <title /> & <badge /> */}
			<View className="flex-row items-center justify-between">
				<Text
					style={{
						color: theme['text-primary']
					}}
				>
					{name}
				</Text>
				<View
					className="py-1 px-4 rounded-xl"
					style={{
						backgroundColor: theme.primary
					}}
				>
					<Text
						style={{
							color: theme['text-primary']
						}}
					>
						Activo
					</Text>
				</View>
			</View>

			{/* <loader /> */}
			<View
				className="mt-3 px-3 py-3 rounded"
				style={{
					backgroundColor: theme['surface-soft']
				}}
			>
				<View
					className="h-3 rounded-md animate-pulse"
					style={{
						width: '80%',
						backgroundColor: theme.surface
					}}
				/>
				<View
					className="w-full h-2 mt-2 rounded-md animate-pulse"
					style={{
						width: '45%',
						backgroundColor: theme.surface
					}}
				/>
			</View>

			<View className="mt-3 flex-row justify-between">
				<Pressable
					className="h-8 w-[48%] rounded-2xl"
					style={{
						backgroundColor: theme.primary,
						borderWidth: 1,
						borderColor: theme.border
					}}
				/>
				<View
					className="h-8 w-[48%] rounded-2xl"
					style={{
						backgroundColor: theme['surface-soft'],
						borderWidth: 1,
						borderColor: theme.border
					}}
				/>
			</View>

			<View className="flex-row gap-x-2 mt-2">
				<Point
					textColor={theme['text-secondary']}
					color={theme.success}
					text="Correcto"
				/>
				<Point
					textColor={theme['text-secondary']}
					color={theme.warning}
					text="Advertencia"
				/>
				<Point
					textColor={theme['text-secondary']}
					color={theme.danger}
					text="Error"
				/>
			</View>
		</View>
	)
}

function Point({
	color,
	text,
	textColor
}: {
	color: string
	text: string
	textColor: string
}) {
	return (
		<View className="flex-row items-center gap-x-2">
			<View
				className="rounded-full"
				style={{
					width: 10,
					height: 10,
					backgroundColor: color
				}}
			/>
			<Text
				className="text-sm"
				style={{
					color: textColor
				}}
			>
				{text}
			</Text>
		</View>
	)
}