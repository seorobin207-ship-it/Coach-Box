import { View, Text, ScrollView, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { AntDesign } from '@expo/vector-icons'
const AboutUs = () => {
  return (
    <ScrollView className="flex-1">
      <SafeAreaView
        className="bg-white h-full relative flex-1"
        style={{ paddingTop: StatusBar.currentHeight }}
      >
        <View className={`flex-row flex items-center pb-2 relative mb-4`}>
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute ml-4 bottom-0 bg-[#64748B14] h-12 w-12 items-center justify-center rounded-full"
          >
            <AntDesign name="left" size={24} color="black" />
          </TouchableOpacity>
          <Text className="font-bold text-[#1E293B] text-xl m-auto">Giới thiệu</Text>
        </View>
        <View className="px-4 pb-8">
          {/* Section 1: Giới thiệu chung */}
          <Text className="text-xl font-semibold text-primary-main mb-3">CoachBox là gì?</Text>

          <Text className="text-base text-[#475569] leading-6 mb-4">
            CoachBox là nền tảng học tập và trải nghiệm giáo dục dành cho trẻ em, được xây dựng với
            mục tiêu giúp các em hình thành tư duy học tập chủ động, đồng thời nâng cao nhận thức về
            môi trường và phát triển kỹ năng toàn diện thông qua các hoạt động tương tác hiện đại.
          </Text>

          {/* Section 2: Triết lý giáo dục */}
          <Text className="text-xl font-semibold text-primary-main mb-3">
            Cách CoachBox tiếp cận giáo dục
          </Text>

          <Text className="text-base text-[#475569] leading-6 mb-4">
            Thay vì tiếp cận kiến thức theo cách thụ động, CoachBox thiết kế các bài học, trò chơi
            trắc nghiệm và hoạt động thực hành xoay quanh những chủ đề gần gũi như thiên nhiên, môi
            trường sống và các giá trị bền vững.
          </Text>

          <Text className="text-base text-[#475569] leading-6 mb-4">
            Qua đó, trẻ không chỉ ghi nhớ kiến thức mà còn hiểu được ý nghĩa của việc học trong đời
            sống thực tế, từ đó hình thành sự hứng thú và động lực học tập lâu dài.
          </Text>

          {/* Section 3: Trải nghiệm học tập */}
          <Text className="text-xl font-semibold text-primary-main mb-3">
            Trải nghiệm học tập thân thiện
          </Text>

          <Text className="text-base text-[#475569] leading-6 mb-4">
            CoachBox kết hợp giáo dục và công nghệ để tạo ra một môi trường học tập trực quan, sinh
            động và phù hợp với lứa tuổi. Giao diện được thiết kế nhẹ nhàng, cùng hệ thống nhân vật
            minh hoạ giúp trẻ cảm thấy gần gũi, tự tin và sẵn sàng khám phá kiến thức mới mỗi ngày.
          </Text>

          {/* Section 4: Mục tiêu */}
          <Text className="text-xl font-semibold text-primary-main mb-3">
            Mục tiêu CoachBox hướng tới
          </Text>

          <View className="mb-4 space-y-2">
            <Text className="text-base text-[#475569] leading-6">
              • Phát triển tư duy logic và khả năng giải quyết vấn đề
            </Text>
            <Text className="text-base text-[#475569] leading-6">
              • Rèn luyện thói quen học tập tích cực và chủ động
            </Text>
            <Text className="text-base text-[#475569] leading-6">
              • Hình thành ý thức bảo vệ môi trường và trách nhiệm với cộng đồng
            </Text>
            <Text className="text-base text-[#475569] leading-6">
              • Hỗ trợ trẻ tự đánh giá tiến bộ và xây dựng khả năng tự học
            </Text>
          </View>

          {/* Section 5: Thông điệp */}
          <Text className="text-xl font-semibold text-primary-main mb-3">Thông điệp từ CoachBox</Text>

          <Text className="text-base text-[#475569] leading-6">
            CoachBox tin rằng giáo dục bền vững bắt đầu từ những trải nghiệm học tập tích cực và gần
            gũi. Ứng dụng được xây dựng để đồng hành cùng trẻ em, phụ huynh và nhà trường trong hành
            trình học tập lâu dài, tạo nền tảng vững chắc cho sự phát triển toàn diện trong tương
            lai.
          </Text>
        </View>
      </SafeAreaView>
    </ScrollView>
  )
}

export default AboutUs
