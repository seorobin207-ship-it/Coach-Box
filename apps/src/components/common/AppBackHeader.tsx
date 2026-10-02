import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { AntDesign } from '@expo/vector-icons'

type Props = {
  title?: string
}

const AppBackHeader = ({ title = '' }: Props) => {
  return (
    <View className="flex-row items-center">
      <TouchableOpacity
        onPress={() => router.back()}
        className="bg-white h-12 w-12 items-center justify-center rounded-full"
      >
        <AntDesign name="left" size={24} color="black" />
      </TouchableOpacity>
      <Text className="font-semibold text-lg flex-1 mr-10 text-center">{title}</Text>
    </View>
  )
}

export default AppBackHeader
