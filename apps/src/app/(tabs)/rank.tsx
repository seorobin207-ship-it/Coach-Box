import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native'
import { images } from '@/constants'
import React, { useEffect, useState } from 'react'
import { useHome, UserRanking } from '@/hooks/useHome'
import { listDefaultRank, RANK_TIERS } from '@/data/rank'
import ModalViewRank from '@/modal/ModalViewRank'
import ImageWithFallback from '@/components/OptimizedImage/ImageWithFallback'
import AppHeader from '@/components/common/AppHeader'
import { BlurView } from 'expo-blur'
import AppBackground from '@/components/common/AppBackground'
import { useSettings } from '@/hooks/useSettings'

export default function ProfileScreen() {
  const { rankQuery } = useHome()
  const [actionTab, setActiveTab] = useState('Học tập')
  const [dataTab, setDataTab] = useState<UserRanking[]>([])
  const [dataModal, setDataModal] = useState<UserRanking[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const { userQuery } = useSettings()

  const [currentRank, setCurrentRank] = useState({
    score: 0,
    rank: images.rank1,
    nextRank: images.rank2,
    nextScore: 1000,
    name: 'Khởi đầu thuận lợi',
    nameNext: 'Vượt Qua Thử Thách',
    minScore: 0,
  })

  useEffect(() => {
    if (!rankQuery.data?.totalScore) return

    const score = rankQuery.data.totalScore

    // Tìm rank tier phù hợp với score
    let rankTier = RANK_TIERS.find((tier) => score >= tier.minScore && score <= tier.maxScore)

    // Nếu không tìm thấy rank phù hợp, kiểm tra xem có phải score quá cao không
    if (!rankTier) {
      const highestTier = RANK_TIERS[RANK_TIERS.length - 2] // Lấy tier trước tier cao nhất
      const maxTier = RANK_TIERS[RANK_TIERS.length - 1] // Tier cao nhất

      if (score > highestTier.maxScore) {
        // Nếu đã đạt rank cao nhất
        rankTier = {
          ...maxTier,
          nextScore: Math.max(score, maxTier.nextScore), // Dùng score hiện tại nếu cao hơn
        }
      }
    }

    if (rankTier) {
      setCurrentRank({
        score: score,
        rank: rankTier.rank,
        nextRank: rankTier.nextRank,
        nextScore: rankTier.nextScore,
        name: rankTier.name,
        nameNext: rankTier.nameNext,
        minScore: rankTier.minScore, // Thêm minScore để tính progress chính xác
      })
    }
  }, [rankQuery.data])

  useEffect(() => {
    if (!rankQuery.data?.rankingsByType) return

    type RankTab = 'Học tập' | 'Trò chơi'
    type RankType = 'learning' | 'quiz'

    const rankTypeMap: Record<RankTab, RankType> = {
      'Học tập': 'learning',
      'Trò chơi': 'quiz',
    }

    const rankType = rankTypeMap[actionTab as RankTab]
    if (rankType) {
      const rankings = rankQuery.data.rankingsByType[rankType]
      if (rankings) {
        setDataModal(rankings)
        setDataTab(rankings.length > 3 ? rankings.slice(0, 3) : rankings)
      }
    }
  }, [rankQuery.data, actionTab])

  const renderColor = (index: number) => {
    switch (index) {
      case 0:
        return '#36BF9F'
      case 1:
        return '#F39043'
      default:
        return '#00BCD4'
    }
  }

  const tabRank = [
    {
      title: 'Học tập',
      key: 'Học tập',
    },
    {
      title: 'Trò chơi',
      key: 'Trò chơi',
    },
  ]

  return (
    <AppBackground>
      <View className="flex-1 bg-primary-lighter">
        <SafeAreaView className="flex-1" style={{ paddingTop: StatusBar.currentHeight || 0 }}>
          <View className="px-6 flex-1">
            <AppHeader title="Xếp hạng" />
            <View className="mt-24 flex-1">
              <View className="bg-white p-3 rounded-xl relative">
                <View className="absolute -top-28 right-0 left-0 items-center">
                  <Image
                    source={currentRank.rank}
                    className="h-[200px] w-[200px]"
                    resizeMode="cover"
                  />
                </View>
                <View className="flex-row justify-between items-center">
                  <Image source={images.characterLeft} className="h-36 w-36" />
                  <Text className="text-lg text-[#36BF9F] font-semibold mt-20 flex-1 text-center">
                    {currentRank.name}
                  </Text>
                  <Image source={images.characterRight} className="h-36 w-36" />
                </View>
                <View className="flex-row justify-between mt-2">
                  <View className="flex-row items-center bg-[#F390431F] rounded-full px-2">
                    <Image source={currentRank.rank} className="h-8 w-8" />
                  </View>
                  <View className="flex-row items-center bg-[#F390431F] rounded-full px-2">
                    <Image source={currentRank.nextRank} className="h-8 w-8" />
                  </View>
                </View>
                <View className="h-[6px] bg-[#64748B29] rounded-full mt-4">
                  <View
                    style={{
                      width: `${Math.min(
                        (() => {
                          const range = currentRank.nextScore - currentRank.minScore
                          const progress = currentRank.score - currentRank.minScore

                          // Nếu đã đạt rank cao nhất (score >= nextScore)
                          if (currentRank.score >= currentRank.nextScore) {
                            return 100
                          }

                          // Tính progress bình thường
                          return range > 0 ? (progress / range) * 100 : 100
                        })(),
                        100,
                      )}%`,
                    }}
                    className="h-[6px] bg-[#36BF9F] rounded-full"
                  />
                </View>
                <View className="flex-row mt-2 justify-between">
                  <Text className="text-[#94A3B8] font-semibold">{currentRank.score}</Text>
                  <Text className="text-[#94A3B8] font-semibold">{currentRank.nextScore}</Text>
                </View>
              </View>
              <ScrollView showsVerticalScrollIndicator={false} className="flex-1 mt-4 mb-2">
                <View>
                  {listDefaultRank.map((it) => (
                    <View
                      key={it.name}
                      className="p-2 bg-[#FFFFFF3D] border border-[#FFFFFF7A] rounded-xl flex-row items-center justify-between mb-2"
                    >
                      <View className="flex-row gap-3 items-center">
                        <View className="h-12 w-12 bg-[#FFFFFF3D] items-center justify-center rounded-xl">
                          <Image source={it.image} className="h-10 w-10" />
                        </View>
                        <View>
                          <Text className="font-semibold">{it.name}</Text>
                          <Text
                            numberOfLines={2}
                            className="mt-1 text-[#64748B] max-w-[200px] text-sm"
                          >
                            {it.description}
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row bg-[#FFFFFF3D] py-1 w-[72px] items-center justify-center rounded-2xl gap-1">
                        <Image source={images.star} className="h-[17px] w-[17px]" />
                        <Text className="font-semibold">{it.star}</Text>
                      </View>
                    </View>
                  ))}
                </View>
                <View className="flex-row justify-center gap-2 mt-8">
                  {tabRank.map((it) => (
                    <TouchableOpacity
                      key={it.title}
                      className={
                        actionTab === it.key
                          ? 'p-3.5 rounded-xl bg-primary-main'
                          : 'p-3.5 rounded-xl bg-[#64748B14]'
                      }
                      onPress={() => setActiveTab(it.key)}
                    >
                      <Text
                        className={
                          actionTab === it.key
                            ? 'text-white font-semibold'
                            : 'text-[#64748B] font-semibold'
                        }
                      >
                        {it.title}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View className="border border-[#FFFFFF52] rounded-2xl mt-4">
                  <View className="bg-[#FFFFFF52] p-3 flex-row justify-between items-center">
                    <Text className="text-xl font-semibold">{actionTab}</Text>
                    <TouchableOpacity>
                      <Text
                        className="text-[#64748B] font-semibold"
                        onPress={() => setModalVisible(true)}
                      >
                        Xem tất cả
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View className="p-3 rounded-bl-2xl rounded-br-2xl bg-primary-lighter">
                    {dataTab &&
                      dataTab.length > 0 &&
                      dataTab.map((it, index) => {
                        return (
                          <View
                            key={it.id}
                            className="flex-row items-center justify-between border-b border-b-[#FFFFFF52] p-2"
                          >
                            <View className="flex-row items-center gap-4">
                              <View
                                style={{ backgroundColor: renderColor(index) }}
                                className="w-6 h-6 rounded bg-[#36BF9F] items-center justify-center"
                              >
                                <Text className="text-xs font-semibold text-white">
                                  #{index + 1}
                                </Text>
                              </View>
                              <ImageWithFallback
                                source={
                                  it?.avatar
                                    ? {
                                        uri: it.avatar,
                                      }
                                    : undefined
                                }
                                className="h-8 w-8 rounded"
                                showInitials={true}
                                initials={it.fullName?.charAt(0)}
                              />
                              <Text className={`font-semibold ${userQuery?.data?.email === it.email && 'text-primary-main'}`}>{it.fullName}</Text>
                            </View>
                            <Text className="font-semibold">{it.totalScore}</Text>
                          </View>
                        )
                      })}
                    {dataTab.length === 0 && (
                      <Text className="text-center text-[#64748B] font-semibold py-4">
                        Chưa có dữ liệu xếp hạng
                      </Text>
                    )}
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>

          <ModalViewRank
            onClose={() => setModalVisible(false)}
            visible={modalVisible}
            data={dataModal}
          />
        </SafeAreaView>
      </View>
    </AppBackground>
  )
}
