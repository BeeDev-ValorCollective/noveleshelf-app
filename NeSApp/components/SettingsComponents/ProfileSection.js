// components/SettingsComponents/ProfileSection.js
import { View, Text, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import useAuthStore from '../../store/authStore';
import useFullName from '../../hooks/useFullName';
import { getMediaUrl } from '../../utils/mediaUrl';
import { getTabGroupForRole } from '../../utils/roleHelpers';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import GradientButton from '../GradientButton';

const USERNAME_FIELD_BY_ROLE = {
  author: 'author_username',
  free_author: 'author_username',
  moderator: 'mod_username',
  admin: 'admin_username',
};

export default function ProfileSection() {
  const router = useRouter();
  const currentProfile = useAuthStore((state) => state.currentProfile);
  const currentRole = useAuthStore((state) => state.currentRole);
  const fullName = useFullName();

  const avatarUrl = getMediaUrl(currentProfile?.avatar_url);
  const usernameField = USERNAME_FIELD_BY_ROLE[currentRole];
  const username = usernameField ? currentProfile?.[usernameField] : currentProfile?.username;
  const hasPenName = currentRole === 'author' || currentRole === 'free_author';
  const penName = hasPenName ? currentProfile?.pen_name : null;

  const handleEditProfile = () => {
    router.push('profile-update')
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]} />
        )}

        <View style={styles.identity}>
          <Text style={styles.name}>
            {fullName || <Text style={styles.placeholder}>Name not set</Text>}
          </Text>
          <Text style={styles.username}>
            {username || <Text style={styles.placeholder}>Username not set</Text>}
          </Text>
          {penName !== null && (
            <Text style={styles.penName}>
              {penName || <Text style={styles.placeholder}>Pen name not set</Text>}
            </Text>
          )}
        </View>
      </View>

      <Text style={styles.bio}>
        {currentProfile?.bio || <Text style={styles.placeholder}>No bio yet</Text>}
      </Text>

      <View style={styles.editButtonWrap}>
        <GradientButton title="Update Profile" onPress={handleEditProfile} style={styles.button} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingBottom: 20,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 32,
  },
  avatarPlaceholder: {
    backgroundColor: colors.secondary,
  },
  identity: {
    flex: 1,
  },
  name: {
    color: colors.white,
    fontFamily: fonts.fredericka,
    fontSize: 20,
  },
  username: {
    color: colors.secondary,
    fontFamily: fonts.meriendaRegular,
    fontSize: 14,
    marginTop: 2,
  },
  penName: {
    color: colors.secondary,
    fontFamily: fonts.meriendaRegular,
    fontSize: 14,
    marginTop: 2,
  },
  placeholder: {
    fontStyle: 'italic',
  },
  bio: {
    color: colors.white,
    fontFamily: fonts.meriendaRegular,
    fontSize: 14,
    marginTop: 12,
  },
  editButtonWrap: {
    marginTop: 16,
    alignItems: 'center',
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: 270,
  },
});