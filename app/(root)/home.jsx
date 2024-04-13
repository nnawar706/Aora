import { View, Text, FlatList, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '../constants';
import Searchbar from '../../components/Searchbar';
import Trending from '../../components/Trending';
import EmptyState from '../../components/EmptyState';
import useFetch from '../../lib/useFetch';
import { getAllPost, getLatestPost } from '../../lib/appwrite';

const Home = () => {
  const [refreshing, setRefreshing] = useState(false)
  const { data: posts, refetch } = useFetch(getAllPost)
  const { data: latest } = useFetch(getLatestPost)

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  return (
    <SafeAreaView>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <Text>{item.id}</Text>
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="flex justify-between items-start 
            flex-row mb-6">
              <View>
              <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  JSMastery
                </Text>
              </View>

              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>

            <Searchbar />

            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-lg font-pregular text-gray-100 mb-3">
                Latest Videos
              </Text>

              <Trending data={latest}/>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title={'No videos found'}
            subtitle={'No videos have been created yet.'}
          />
        )}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </SafeAreaView>
  )
}

export default Home