import { Text, TextInput, type TextInputProps, View } from 'react-native'
import { useThemeStyles } from '@/utils/theme'

interface InputProps extends TextInputProps {
	value: string
	onValueChange: (value: string) => void
	error?: string | undefined | null
}

export function Input({ value, onValueChange, error, ...props }: InputProps) {
	const themeStyles = useThemeStyles()

	return (
		<View>
			<TextInput
				value={value}
				onChangeText={onValueChange}
				className="border rounded-lg px-3 min-h-12"
				placeholderTextColor={themeStyles.textSecondary()}
				style={{
					color: themeStyles.textPrimary(),
					borderColor: themeStyles.border(),
					backgroundColor: themeStyles.surfaceSoft()
				}}
				{...props}
			/>
			{error && (
				<Text
					className={'text-sm mt-1'}
					style={{
						color: themeStyles.danger()
					}}
				>
					{error}
				</Text>
			)}
		</View>
	)
}