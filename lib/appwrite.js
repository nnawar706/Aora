import { Client, Account, ID, Avatars, Databases, Query } from 'react-native-appwrite';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.codearc.aora',
    projectId: '661aa0f353b6cbd278d7',
    databaseId: '661aa24d17a6d7269f4b',
    userCollectionId: '661aa28c465a1074d8b6',
    videoCollectionId: '661aa2bae4f2621df497',
    storageId: '661aa570b0e7dd8bad58'
}

const client = new Client();

client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform)
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (username, email, password) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )

        if (!newAccount) throw Error

        const avatarUrl = avatars.getInitials(username)

        await signIn(email, password)

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                userId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        )

        return newUser
    } catch (error) {
        console.log(error)
    }
}

export const signIn = async (email, password) => {
    try {
        const session = await account.createEmailSession(email, password)
        
        return session
    } catch (error) {
        throw new Error(error)
    }
}

export const getAuthUser = async () => {
    try {
        const currentAccount = await account.get()

        if (!currentAccount) throw Error

        const authUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('userId', currentAccount.$id)]
        )

        if (!authUser) throw Error

        return authUser.documents[0]
    } catch (error) {
        throw new Error(error)
    }
}

export const getAllPost = async () => {
    try {
        const data = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId
        )

        return data.documents
    } catch (error) {
        throw new Error(error)
    }
}

export const getLatestPost = async () => {
    try {
        const data = databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.orderDesc('$createdAt'), Query.limit(7)]
        )

        return data.documents
    } catch (error) {
        throw new Error(error)
    }
}

export const getPostsByUser = async (userId) => {
    try {
        const data = databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.equal('creator', userId)]
        )

        return data.documents
    } catch (error) {
        throw new Error(error)
    }
}

export const getPostsBySearch = async (search) => {
    try {
        const data = databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.search('title', search)]
        )

        return data.documents
    } catch (error) {
        throw new Error(error)
    }
}

