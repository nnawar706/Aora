import { View, Text, Image, Alert, ScrollView, TouchableOpacity } from 'react-native'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { ResizeMode, Video } from 'expo-av'

import { useGlobalContext } from '../../context/GlobalProvider'
import InputField from '../../components/InputField'
import Button from '../../components/Button'

const Create = () => {
  const { user } = useGlobalContext()
  const [isUploading, setIsUploading] = useState(false)
  const [form, setForm] = useState({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  })

  const handleSubmit = async () => {
    if (
      (form.prompt === "") |
      (form.title === "") |
      !form.thumbnail |
      !form.video
    ) {
      return Alert.alert('Error', 'Some required fields are missing.')
    }

    setIsUploading(true)
    
    try {
      Alert.alert('Success', 'New video uploaded successfully.')
      router.push('/home')
    } catch (error) {
      Alert.alert('Error', error.message)
    } finally {
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
      })

      setIsUploading(false)
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
      <Text className="text-2xl text-white font-psemibold">Upload Video</Text>

      <InputField
        title="Title"
        value={form.title}
        placeholder="Give your video a catchy title..."
        handleChangeText={(e) => setForm({ ...form, title: e })}
        otherStyles="mt-10"
      />

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video
          </Text>

          <TouchableOpacity>
            {form.video ? (
              <Video
                source={{ uri: form.video.uri }}
                className="w-full h-64 rounded-2xl"
                useNativeControls
                resizeMode={ResizeMode.COVER}
                isLooping
              />
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl border border-black-200 flex justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary-100 flex justify-center items-center">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    alt="upload"
                    className="w-1/2 h-1/2"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Thumbnail Image
          </Text>
        </View>

        <InputField
          title="AI Prompt"
          value={form.prompt}
          placeholder="The AI prompt of your video...."
          handleChangeText={(e) => setForm({ ...form, prompt: e })}
          otherStyles="mt-7"
        />

        <Button
          title={'Publish'}
          handlePress={handleSubmit}
          containerStyles={'mt-7'}
          isLoading={isUploading}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Create