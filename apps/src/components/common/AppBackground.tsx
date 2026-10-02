// components/common/AppBackground.tsx
import { View } from 'react-native'

export default function AppBackground({ children }: { children: React.ReactNode }) {
  return <View style={{ flex: 1 }}>{children}</View>
}
