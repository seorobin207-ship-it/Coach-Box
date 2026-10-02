import React from 'react'
import { Tabs } from 'expo-router'
import { Gameboy, Home3, Message, Rank } from 'iconsax-react-native'

const ACTIVE_COLOR = '#FF6315'
const INACTIVE_COLOR = '#637381'

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,

        tabBarStyle: {
          height: 80,
          paddingTop: 6,
          paddingBottom: 6,
          borderTopWidth: 0.5,
          borderTopColor: '#E5E7EB',
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
        },

        tabBarLabelStyle: {
          fontSize: 10,
          marginTop: 2,
          fontWeight: '500',
        },

        tabBarItemStyle: {
          paddingVertical: 2,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Khám phá',
          tabBarIcon: ({ color }) => <Home3 size="24" color={color === ACTIVE_COLOR ? color : '#637381'}/>,
        }}
      />

      <Tabs.Screen
        name="practice"
        options={{
          title: 'Trò chơi',
          tabBarIcon: ({ color }) => <Gameboy size="24" color={color === ACTIVE_COLOR ? color : '#637381'}/>,
        }}
      />

      <Tabs.Screen
        name="play-situation"
        options={{
          title: 'Hoạt động',
          tabBarIcon: ({ color }) => <Message size="24" color={color === ACTIVE_COLOR ? color : '#637381'}/>,
        }}
      />

      <Tabs.Screen
        name="rank"
        options={{
          title: 'Xếp hạng',
          tabBarIcon: ({ color }) => <Rank size="24" color={color === ACTIVE_COLOR ? color : '#637381'}/>,
        }}
      />
    </Tabs>
  )
}

export default TabsLayout
