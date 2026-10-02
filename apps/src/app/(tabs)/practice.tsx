import React, { useState } from 'react'
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native'
import { images } from '@/constants'
import IconArrowLeft from '~/assets/icon-svg/IconArrowLeft'
import IconArrowRight from '~/assets/icon-svg/IconArrowRight'
import { router } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import AppHeader from '@/components/common/AppHeader'

export default function PracticeScreen() {
  const [activeState, setActiveState] = useState('Cơ bản')

  const levels = ['Cơ bản', 'Trung cấp', 'Nâng cao']

  const handlePreviousLevel = () => {
    const currentIndex = levels.indexOf(activeState)
    const newIndex = currentIndex === 0 ? levels.length - 1 : currentIndex - 1
    setActiveState(levels[newIndex])
  }

  const handleNextLevel = () => {
    const currentIndex = levels.indexOf(activeState)
    const newIndex = currentIndex === levels.length - 1 ? 0 : currentIndex + 1
    setActiveState(levels[newIndex])
  }

  const renderState = (): string => {
    switch (activeState) {
      case 'Cơ bản':
        return 'BEGINNER'
      case 'Trung cấp':
        return 'INTERMEDIATE'
      default:
        return 'ADVANCED'
    }
  }

  return (
    <ImageBackground source={images.bgPractice} resizeMode="cover" className="flex-1">
      {/* Header */}
      <View className="mt-16 mx-4">
        <AppHeader title="Trò chơi" />
      </View>

      {/* Bottom overlay */}
      <View className="absolute bottom-6 w-full px-6">
        <View className="bg-white/65 rounded-3xl px-5 py-4 shadow-lg">
          {/* Difficulty selector */}
          <View className="flex-row items-center justify-center mb-4">
            <TouchableOpacity
              onPress={handlePreviousLevel}
              className="h-9 w-9 rounded-full bg-white items-center justify-center shadow"
            >
              <IconArrowLeft />
            </TouchableOpacity>

            <View className="mx-4 px-6 py-2 bg-primary-dark rounded-full">
              <Text className="text-white text-sm font-bold tracking-wide">{activeState}</Text>
            </View>

            <TouchableOpacity
              onPress={handleNextLevel}
              className="h-9 w-9 rounded-full bg-white items-center justify-center shadow"
            >
              <IconArrowRight />
            </TouchableOpacity>
          </View>

          {/* CTA */}
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: ERouteTable.PRACTICE_CHILDREN,
                params: { level: renderState() },
              })
            }
            className="w-full bg-primary-main border border-primary-dark py-3.5 rounded-full items-center shadow-md"
          >
            <Text className="text-white font-bold text-base">Bắt đầu chơi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  )
}
