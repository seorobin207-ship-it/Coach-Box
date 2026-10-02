import React, { useState, useRef } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native'
import { WebView } from 'react-native-webview'

import { useRouter } from 'expo-router'
import AppBackHeader from '@/components/common/AppBackHeader'
import { StatusBar } from 'react-native'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

const editorHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.9/codemirror.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.9/theme/dracula.min.css">
  <style>
    body { margin: 0; height: 100vh; background: #282A36; }
    .CodeMirror { height: 100%; font-size: 16px; }
  </style>
</head>
<body>
  <textarea id="editor"></textarea>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.9/codemirror.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.9/mode/python/python.min.js"></script>
  <script>
    const editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
      lineNumbers: true,
      mode: 'python',
      theme: 'dracula',
      indentUnit: 4,
      autofocus: true
    });
    editor.setValue("print('Hello, World!')");
    editor.on('change', () => {
      window.ReactNativeWebView.postMessage(editor.getValue());
    });
    setTimeout(() => window.ReactNativeWebView.postMessage(editor.getValue()), 100);
  </script>
</body>
</html>
`

export default function CodeScreen({ navigation }: { navigation: any }) {
  const router = useRouter()
  const [code, setCode] = useState<string>("print('Hello, World!')")
  const [output, setOutput] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const webviewRef = useRef<WebView>(null)

  const runCode = async () => {
    setLoading(true)
    setOutput('')
    try {
      const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: 'python3',
          version: '3.10.0',
          files: [{ name: 'main.py', content: code }],
        }),
      })
      const result = await response.json()
      setOutput((result.run.stdout || '') + (result.run.stderr || ''))
    } catch (err: any) {
      setOutput(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView
      className="flex-1 bg-bg-secondary"
      style={{ paddingTop: StatusBar.currentHeight }}
    >
      {/* Header */}
      <View className="px-6 flex-1">
        <AppBackHeader title="CODING TIME" />

        <Text className="text-base font-semibold mt-4">Nhập code Python:</Text>

        <View
          className="rounded-lg overflow-hidden mt-2 bg-white"
          style={{
            height: SCREEN_HEIGHT * 0.3,
            ...(Platform.OS === 'ios'
              ? {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                }
              : { elevation: 3 }),
          }}
        >
          <WebView
            ref={webviewRef}
            originWhitelist={['*']}
            source={{ html: editorHtml }}
            onMessage={(event) => setCode(event.nativeEvent.data)}
            javaScriptEnabled
            style={{ backgroundColor: 'transparent' }}
            automaticallyAdjustContentInsets={false}
            scrollEnabled={false}
          />
        </View>

        <TouchableOpacity
          className="bg-primary-main mt-4 py-3 rounded-lg items-center"
          onPress={runCode}
          disabled={loading}
        >
          <Text className="text-white text-base font-semibold">Chạy code</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator className="my-4" />}

        <Text className="text-base font-semibold ml-4 mt-4">Kết quả:</Text>

        <ScrollView className="flex-1 my-4 border border-gray-300 rounded-lg bg-white p-3">
          <Text
            style={{
              fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
            }}
            className="text-sm text-gray-800"
          >
            {output}
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
