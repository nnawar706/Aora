import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import useFetch from '../../lib/useFetch';
import { getPostsBySearch } from '../../lib/appwrite';
import Card from '../../components/Card';
import Searchbar from '../../components/Searchbar';
import EmptyState from '../../components/EmptyState';

const Search = () => {
  const { query } = useLocalSearchParams()
  const { data: posts, refetch } = useFetch(() => getPostsBySearch(query))

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <Card
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.creator.username}
            avatar={item.creator.avatar}
          />
        )}
        ListHeaderComponent={() => (
          <>
            <View className="flex my-6 px-4">
              <Text className="font-pmedium text-gray-100 text-sm">
                Search Results
              </Text>
              <Text className="text-2xl font-psemibold text-white mt-1">
                {query}
              </Text>

              <View className="mt-6 mb-8">
                <Searchbar query={query} refetch={refetch}/>
              </View>
            </View>
          </>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title={'No video found'}
            subtitle={'No video found for this search'}
          />
        )}
      />
    </SafeAreaView>
  )
}

export default Search