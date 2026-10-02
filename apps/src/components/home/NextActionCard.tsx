import { Text, TouchableOpacity } from 'react-native'

export function NextActionCard({ lesson }: any) {
  return (
    <TouchableOpacity className="mx-4 mt-4 p-4 rounded-2xl bg-green-600">
      <Text className="text-white text-sm">Tiếp tục học</Text>
      <Text className="text-white text-lg font-bold mt-1">{lesson.title}</Text>
    </TouchableOpacity>
  )
}
