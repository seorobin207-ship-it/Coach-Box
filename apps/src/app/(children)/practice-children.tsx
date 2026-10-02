import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import React from 'react'
import { usePractice } from '@/hooks/usePractice'
import { ERouteTable } from '@/constants/route-table'
import { images } from '@/constants'
import IconCheckActive from '~/assets/icon-svg/IconCheckActive'
import IconCheck from '~/assets/icon-svg/IconCheck'
import IconLock from '~/assets/icon-svg/IconLock'
import IconUnLock from '~/assets/icon-svg/IconUnLock'
import AppBackHeader from '@/components/common/AppBackHeader'
import { BlurView } from 'expo-blur'

const PracticeChildren = () => {
  const { level } = useLocalSearchParams<{ level: string }>()

  const { quizQuery } = usePractice(level)

  const renderTitle = () => {
    switch (level) {
      case 'BEGINNER':
        return 'Cơ bản'
      case 'INTERMEDIATE':
        return 'Trung cấp'
      case 'ADVANCED':
        return 'Nâng cao'
    }
  }

  return (
    <ImageBackground source={images.bgPractice} className="h-full flex-1">
      <View className="px-6 flex-1 mt-20">
        <AppBackHeader title="Trò chơi" />

        <View className="bg-[#FFFFFFCC] mt-6 h-16 w-full rounded-tl-2xl rounded-tr-2xl border border-[#FFFFFF8F] overflow-hidden">
          <BlurView
            intensity={20}
            tint="light"
            className="absolute top-0 left-0 right-0 bottom-0 p-4"
          >
            <Text className="font-semibold text-xl text-[#1E293B] capitalize">
              Trắc nghiệm {renderTitle()}
            </Text>
          </BlurView>
        </View>
        <View className="flex-1">
          <BlurView intensity={20} tint="light" className="absolute top-0 left-0 right-0 bottom-0">
            {quizQuery.isLoading ? (
              <ActivityIndicator size="small" color="#36BF9F" className="mt-8" />
            ) : (
              <FlatList
                className="flex-1 bg-[#FFFFFFCC] rounded-bl-2xl rounded-br-2xl mb-40 border border-[#FFFFFF8F]"
                showsVerticalScrollIndicator={false}
                data={quizQuery.data}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    className={`mb-2 rounded-xl flex-row items-center justify-between p-4 border-b border-b-[#FFFFFF52] border-b-dashed ${item.isLocked ? 'opacity-[48%]' : ''}`}
                    onPress={() =>
                      router.push({
                        pathname: ERouteTable.QUIZ_START,
                        params: {
                          coursesId: item.id,
                          type: 1,
                          score: item?.score?.score || 0,
                          totalScore: item?.score?.totalScore || 100,
                          title: renderTitle(),
                          titleLesson: `${index + 1}. ${item.title}`,
                        },
                      })
                    }
                    disabled={item.isLocked}
                  >
                    <View className="flex-row gap-2 items-center">
                      <View className="h-12 w-12 items-center justify-center rounded-xl">
                        {item.isLocked ? <IconLock /> : <IconUnLock />}
                      </View>

                      <View>
                        <Text className="text-lg font-semibold">
                          {index + 1}. {item.title}
                        </Text>
                        <Text className="text-base text-[#36BF9F] font-semibold">
                          {item?.score?.score || 0}
                          <Text className="font-normal">
                            /{item?.score?.totalScore || 100} điểm
                          </Text>
                        </Text>
                      </View>
                    </View>
                    <View className="bg-white rounded-xl mr-2">
                      {item.isCompleted ? <IconCheckActive /> : <IconCheck />}
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
          </BlurView>
        </View>
      </View>
    </ImageBackground>
  )
}

export default PracticeChildren
