import React from 'react'
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { CloseCircle, Edit, Trash } from 'iconsax-react-native'

type BaseProps = {
  visible: boolean
  onClose: () => void
}

type OptionsModalProps = BaseProps & {
  onPressRename: () => void
  onPressDelete: () => void
}

type RenameModalProps = BaseProps & {
  title?: string
  value: string
  onChangeText: (text: string) => void
  onConfirm: () => void
}

type DeleteModalProps = BaseProps & {
  title?: string
  message: string
  onConfirm: () => void
}

export const ChatOptionsModal: React.FC<OptionsModalProps> = ({
  visible,
  onClose,
  onPressRename,
  onPressDelete,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/30 items-center justify-center px-10">
        <View className="w-full bg-white rounded-3xl px-6 py-5">
          <TouchableOpacity
            onPress={onClose}
            className="absolute right-4 top-4 h-6 w-6 items-center justify-center"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <CloseCircle size="24" color="#212B36"/>
          </TouchableOpacity>

          <View className="mt-2">
            <TouchableOpacity
              className="flex-row items-center py-3"
              onPress={onPressRename}
              activeOpacity={0.8}
            >
              <Edit size="20" color="#212B36"/>
              <Text className="ml-3 text-sm text-primary">Đổi tên</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center py-3"
              onPress={onPressDelete}
              activeOpacity={0.8}
            >
              <Trash size="20" color="#212B36"/>
              <Text className="ml-3 text-sm text-primary">Xóa</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export const RenameChatModal: React.FC<RenameModalProps> = ({
  visible,
  onClose,
  title = 'Đổi tên đoạn chat',
  value,
  onChangeText,
  onConfirm,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/30 items-center justify-center px-8">
        <View className="w-full bg-white rounded-3xl px-5 py-5">
          <View className="flex-row justify-end items-center mb-3">
            <TouchableOpacity onPress={onClose}>
              <CloseCircle size="24" color="#212B36"/>
            </TouchableOpacity>
          </View>
          <Text className="text-base text-center text-xl mb-4 font-semibold text-gray-900">{title}</Text>

          <TextInput
            value={value}
            onChangeText={onChangeText}
            className="border border-gray-200 h-12 rounded-2xl px-3 py-2 text-sm text-gray-900 mb-4"
            placeholder="Tên đoạn chat"
            placeholderTextColor="#9CA3AF"
          />
          <View className="flex-row justify-between mt-1">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 mr-2 h-12 border justify-center border-primary-main rounded-full py-2.5 items-center"
            >
              <Text className="text-primary-main font-semibold text-sm">Hủy bỏ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              className="flex-1 ml-2 h-12 justify-center bg-primary-main border border-primary-dark rounded-full py-2.5 items-center"
            >
              <Text className="text-white font-semibold text-sm">Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export const DeleteChatModal: React.FC<DeleteModalProps> = ({
  visible,
  onClose,
  title = 'Xóa đoạn chat',
  message,
  onConfirm,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/30 items-center justify-center px-8">
        <View className="w-full bg-white rounded-3xl px-5 py-5">
          <View className="flex-row justify-end items-center mb-3">
            <TouchableOpacity onPress={onClose}>
              <CloseCircle size="24" color="#212B36"/>
            </TouchableOpacity>
          </View>
          <Text className="text-xl text-center mb-2 font-semibold text-gray-900">{title}</Text>

          <Text className="text-sm text-center text-secondary mb-5">{message}</Text>
          <View className="flex-row justify-between mt-1">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 mr-2 border h-12 justify-center border-primary-main rounded-full py-2.5 items-center"
            >
              <Text className="text-primary-main font-semibold text-sm">Hủy bỏ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              className="flex-1 ml-2 bg-primary-main h-12 justify-center border border-primary-dark rounded-full py-2.5 items-center"
            >
              <Text className="text-white font-semibold text-sm">Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

