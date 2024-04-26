import { Client, Account, ID, Avatars, Databases, Query, Storage } from 'react-native-appwrite';

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
const storage = new Storage(client);

export const createUser = async (username, email, password) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )

        if (!newAccount) {
            console.log('error occurred')
            throw Error
        }

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

export const SignAuthUserOut = async () => {
    try {
        const session = await account.deleteSession('current')

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
            config.videoCollectionId,
            [Query.orderDesc('$createdAt')]
        )

        return data.documents
    } catch (error) {
        throw new Error(error)
    }
}

export const getLatestPost = async () => {
    try {
        const data = await databases.listDocuments(
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
        const data = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.equal('creator', userId), Query.orderDesc('$createdAt')]
        )

        return data.documents
    } catch (error) {
        throw new Error(error)
    }
}

export const getPostsBySearch = async (search) => {
    try {
        const data = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.search('title', search)]
        )

        return data.documents
    } catch (error) {
        throw new Error(error)
    }
}

export const uploadFile = async (file, type) => {
    if (!file) return

    const asset = {
        name: file.fileName,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri
    }

    try {
        const uploadedFile = await storage.createFile(
            config.storageId,
            ID.unique(),
            asset
        )

        const fileUrl = await getFilePreview(uploadedFile.$id, type)

        return fileUrl
    } catch (error) {
        throw new Error(error)
    }
}

export const getFilePreview = async (fileId, type) => {
    let fileUrl

    try {
        if (type === 'video')
        {
            fileUrl = storage.getFileView(config.storageId, fileId)
        } 
        else if (type === 'image')
        {
            fileUrl = storage.getFilePreview(
                config.storageId,
                fileId,
                2000, 2000,'top', 100
            )
        }
        else 
        {
            throw new Error('Invalid file type.')
        }

        if (!fileUrl) throw Error

        return fileUrl
    } catch (error) {
        throw new Error(error)
    }
}

export const createVideo = async (form) => {
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, 'video')
        ])

        const newPost = await databases.createDocument(
            config.databaseId,
            config.videoCollectionId,
            ID.unique(),
            {
                title: form.title,
                thumbnail: thumbnailUrl,
                video: videoUrl,
                prompt: form.prompt,
                creator: form.userId
            }
        )

        return newPost
    } catch (error) {
        throw new Error(error)
    }
}
