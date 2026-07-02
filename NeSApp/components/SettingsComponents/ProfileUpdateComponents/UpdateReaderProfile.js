import { useState, useEffect } from 'react';
import {
    View, Text, Image, TextInput, ScrollView,
    TouchableOpacity, StyleSheet, ActivityIndicator, Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import useAuthStore from '../../../store/authStore';
import { getMediaUrl } from '../../../utils/mediaUrl';
import { ENDPOINTS } from '../../../utils/api';
import { colors } from '../../../constants/colors';
import { fonts } from '../../../constants/fonts';
import GradientButton from '../../GradientButton';

export default function UpdateReaderProfile() {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const accessToken = useAuthStore((state) => state.accessToken);
    const updateUser = useAuthStore((state) => state.updateUser);

    const profile = user?.profile

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [username, setUsername] = useState('')
    const [bio, setBio] = useState('')
    const [avatarUri, setAvatarUri] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    useEffect(() => {
        if (profile) {
            setFirstName(profile.first_name || '')
            setLastName(profile.last_name || '')
            setUsername(profile.username || '')
            setBio(profile.bio || '')
        }
    }, [profile])

    const handlePickAvatar = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (!permission.granted) {
            Alert.alert('Permission required', 'Please allow access to your photo library to update your avatar.')
            return
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        })

        if (!result.canceled) {
            setAvatarUri(result.assets[0].uri)
        }
    }

    const handleSubmit = async () => {
        setError(null)
        setSuccess(null)
        setIsLoading(true)

        try {
            const formData = new FormData()
            formData.append('first_name', firstName)
            formData.append('last_name', lastName)
            formData.append('username', username)
            formData.append('bio', bio)

            if (avatarUri) {
                const filename = avatarUri.split('/').pop()
                const match = /\.(\w+)$/.exec(filename)
                const type = match ? `image/${match[1]}` : 'image/jpeg'
                formData.append('avatar_url', { uri: avatarUri, name: filename, type })
            }

            const res = await fetch(ENDPOINTS.auth.updateProfile, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: formData,
            })

            const data = await res.json()
            console.log('error data', data)
            if (res.ok) {
                updateUser({ ...user, profile: data.profile })
                setSuccess('Profile updated successfully')
            } else {
                setError(data.error || 'Update failed. Please try again.')
            }
        } catch {
            setError('Unable to connect. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    if (!user) return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.primary} size='large' />
        </View>
    )

    const currentAvatar = avatarUri || (profile?.avatar_url ? getMediaUrl(profile.avatar_url) : null)

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

            {/* Avatar */}
            <TouchableOpacity style={styles.avatarContainer} onPress={handlePickAvatar}>
                {currentAvatar ? (
                    <Image source={{ uri: currentAvatar }} style={styles.avatar} />
                ) : (
                    <View style={[styles.avatar, styles.avatarPlaceholder]}>
                        <Text style={styles.avatarPlaceholderText}>
                            {firstName?.[0] || user?.email?.[0] || '?'}
                        </Text>
                    </View>
                )}
                <View style={styles.avatarEditBadge}>
                    <Text style={styles.avatarEditText}>Edit</Text>
                </View>
            </TouchableOpacity>

            {/* Fields */}
            <View style={styles.fields}>
                <View style={styles.field}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput
                        style={styles.input}
                        value={firstName}
                        onChangeText={setFirstName}
                        placeholderTextColor={colors.faded}
                        placeholder='First name'
                    />
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Last Name</Text>
                    <TextInput
                        style={styles.input}
                        value={lastName}
                        onChangeText={setLastName}
                        placeholderTextColor={colors.faded}
                        placeholder='Last name'
                    />
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Username</Text>
                    <TextInput
                        style={styles.input}
                        value={username}
                        onChangeText={setUsername}
                        placeholderTextColor={colors.faded}
                        placeholder='Username'
                        autoCapitalize='none'
                        autoCorrect={false}
                    />
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Bio</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={bio}
                        onChangeText={setBio}
                        placeholderTextColor={colors.faded}
                        placeholder='Tell us a little about yourself'
                        multiline
                        numberOfLines={4}
                        textAlignVertical='top'
                    />
                </View>
            </View>

            {/* Feedback */}
            {error && <Text style={styles.error}>{error}</Text>}
            {success && <Text style={styles.success}>{success}</Text>}

            {/* Buttons */}
            <View style={styles.buttons}>
                <GradientButton
                    title={isLoading ? 'Saving...' : 'Save Changes'}
                    onPress={handleSubmit}
                    disabled={isLoading}
                />
                <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => router.back()}
                >
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: 24,
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 32,
        marginTop: 8,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: colors.secondary,
    },
    avatarPlaceholder: {
        backgroundColor: colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarPlaceholderText: {
        color: colors.white,
        fontSize: 36,
        fontFamily: fonts.fredericka,
        textTransform: 'uppercase',
    },
    avatarEditBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.primary,
        borderRadius: 999,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    avatarEditText: {
        color: colors.background,
        fontSize: 11,
        fontFamily: fonts.meriendaBold,
    },
    fields: {
        width: '100%',
        gap: 16,
    },
    field: {
        width: '100%',
        gap: 6,
    },
    label: {
        color: colors.secondary,
        fontFamily: fonts.fredericka,
        fontSize: 14,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        borderRadius: 8,
        color: colors.white,
        fontFamily: fonts.meriendaRegular,
        fontSize: 15,
        padding: 12,
        width: '100%',
    },
    textArea: {
        minHeight: 100,
    },
    error: {
        color: colors.primary,
        fontFamily: fonts.meriendaRegular,
        fontSize: 13,
        textAlign: 'center',
        marginTop: 12,
    },
    success: {
        color: '#4caf50',
        fontFamily: fonts.meriendaRegular,
        fontSize: 13,
        textAlign: 'center',
        marginTop: 12,
    },
    buttons: {
        width: '100%',
        alignItems: 'center',
        gap: 12,
        marginTop: 24,
    },
    cancelBtn: {
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        borderRadius: 999,
        width: '100%',
        alignItems: 'center',
    },
    cancelText: {
        color: colors.secondary,
        fontFamily: fonts.fredericka,
        fontSize: 15,
    },
})