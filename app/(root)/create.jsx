import { View, Text, Image, Alert, ScrollView, TouchableOpacity } from 'react-native'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { ResizeMode, Video } from 'expo-av'
import * as DocumentPicker from 'expo-document-picker'

import { useGlobalContext } from '../../context/GlobalProvider'
import InputField from '../../components/InputField'
import Button from '../../components/Button'
import { icons } from '../../constants'

const Create = () => {
  const { user } = useGlobalContext()
  const [isUploading, setIsUploading] = useState(false)
  const [form, setForm] = useState({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  })

  const openFilePicker = async (type) => {
    const result = await DocumentPicker.getDocumentAsync({
      type: type === 'image' 
        ? ['image/png', 'image/jpg']
        : ['video/mp4', 'video/gif']
    })

    if (!result.canceled)
    {
      if (type === 'image')
      {
        setForm({ ...form, thumbnail: result.assets[0] })
      } 
      else if (type === 'video')
      {
        setForm({ ...form, video: result.assets[0] })
      }
    }
    else 
    {
      setTimeout(() => {
        Alert.alert('Document picked.', JSON.stringify(result, null, 2))
      }, 100)
    }
  }

  const handleSubmit = async () => {
    if (
      (form.prompt === "") ||
      (form.title === "") ||
      !form.thumbnail ||
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

          <TouchableOpacity onPress={() => openFilePicker('video')}>
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

          <TouchableOpacity onPress={() => openFilePicker('image')}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                resizeMode='cover'
                className="w-full h-64 rounded-2xl"
              />
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl 
              border-2 border-black-200 flex justify-center items-center 
              flex-row space-x-2">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  alt="upload"
                  className="w-5 h-5"
                />
                <Text className="text-sm text-gray-100 font-pmedium">
                  Choose a File
                </Text>
              </View>
            )}
          </TouchableOpacity>
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