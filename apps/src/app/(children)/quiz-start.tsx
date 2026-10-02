import { images } from '@/constants'
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native'

import React from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { AntDesign } from '@expo/vector-icons'
import { ERouteTable } from '@/constants/route-table'

const QuizStart = () => {
  const { coursesId, type, score, title, titleLesson, totalScore } = useLocalSearchParams<{
    coursesId: string
    type: string
    score: string
    title: string
    titleLesson: string
    totalScore: string
  }>()

  return (
    <ImageBackground source={images.quizStart} className="h-full flex-1">
      <View className="mx-4 flex-1">
        <View className="flex-row items-center mt-14 px-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="h-11 w-11 rounded-full bg-white/80 items-center justify-center"
          >
            <AntDesign name="left" size={22} color="#2E7D32" />
          </TouchableOpacity>

          <Text className="flex-1 text-center mr-11 text-[17px] font-semibold text-[#2E7D32]">
            {title}
          </Text>
        </View>
        <View className="items-center mt-[45vh] px-6">
          <View className="w-full rounded-3xl bg-white/70 px-6 py-5 items-center shadow-md">
            <Text className="text-base font-semibold text-primarytext-center">
              {titleLesson}
            </Text>

            <Text className="text-2xl mt-2 font-bold text-primary-main text-center">
              {Number(score) > 0 ? 'Điểm cao nhất' : 'Bắt đầu thử sức nhé!'}
            </Text>

            {Number(score) > 0 && (
              <View className="flex-row items-end mt-2 bg-primary-main px-6 py-2 rounded-full">
                <Text className="text-white text-3xl font-bold">
                  {score}/{totalScore}
                </Text>
                <Text className="text-white text-xs ml-1 mb-1">điểm</Text>
              </View>
            )}
          </View>
        </View>
      </View>
      <View className="mb-12 px-6">
        <TouchableOpacity
          className="h-14 rounded-full items-center justify-center bg-primary-main border border-primary-dark shadow-lg"
          onPress={() =>
            router.push({
              pathname: ERouteTable.QUESTION_SCREEN,
              params: {
                coursesId,
                type,
              },
            })
          }
        >
          <Text className="text-white font-bold text-lg tracking-wide">Bắt đầu</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  )
}
export default QuizStart
