import { useCallback, useState } from 'react'
import { Text, View } from 'react-native'
import uuid from 'react-native-uuid'
import { Input } from '@/components/layout/Input'
import useFolder from '@/state/Folder'
import { useModal } from '@/state/modal'
import { useThemeStyles } from '@/utils/theme'
import { zodParse } from '@/utils/zod'
import { createFolderSchema } from '@/zod-schemes/folder'
import { StyledPressable } from '../layout/StyledPressable'

export function FolderModal() {
	const { item, closeModal } = useModal()
	const { update, create } = useFolder()
	const [error, setError] = useState<string | null>(null)
	const [textInput, setTextInput] = useState<string>(item?.data.name || '')
	const themeStyles = useThemeStyles()

	const thereIsItem = !!item
	const modalTitle = thereIsItem ? 'Editar carpeta' : 'Crear carpeta'
	const pressableText = thereIsItem ? 'Guardar' : 'Agregar'

	const handleSubmit = useCallback(() => {
		const folderName = textInput.trim()

		const result = zodParse(createFolderSchema, {
			title: folderName
		})

		if (!result.success) {
			setError(result.errors.title)
			return
		}

		if (thereIsItem && item.type === 'FOLDER') {
			update({ ...item.data, name: folderName })
			closeModal('folder')
			return
		}

		const newFolder = { id: uuid.v4(), name: folderName, taskCount: 0 }
		create(newFolder)

		closeModal('folder')
	}, [thereIsItem, textInput, update, create, item, closeModal])

	return (
		<View className="relative flex-1 mx-aito w-full px-4 py-6">
			{/* <header /> */}
			<View className="flex-row items-center justify-between relative">
				<Text
					className="text-start text-2xl font-semibold tracking-wider"
					style={{ color: themeStyles.textPrimary() }}
				>
					{modalTitle}
				</Text>
			</View>
			{/* <main /> */}
			<View>
				{/* <input-container /> */}
				<View className="mt-2">
					<Input
						onValueChange={(value) => {
							setError(null)
							setTextInput(value)
						}}
						value={textInput}
						placeholder="Nombre de la carpeta"
						onSubmitEditing={handleSubmit}
						error={error}
					/>
				</View>
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