// app/(protected)/profile-update.js
// Shared across all role tab groups so router.back() returns to the
// dashboard the user came from. Picks the form for the current role.
import useAuthStore from '../../store/authStore';
import UpdateReaderProfile from '../../components/SettingsComponents/ProfileUpdateComponents/UpdateReaderProfile';
import UpdateAuthorProfile from '../../components/SettingsComponents/ProfileUpdateComponents/UpdateAuthorProfile';
import UpdateFreeAuthorProfile from '../../components/SettingsComponents/ProfileUpdateComponents/UpdateFreeAuthorProfile';
import UpdateModeratorProfile from '../../components/SettingsComponents/ProfileUpdateComponents/UpdateModeratorProfile';
import UpdateAdminProfile from '../../components/SettingsComponents/ProfileUpdateComponents/UpdateAdminProfile';

const FORM_BY_ROLE = {
  reader: UpdateReaderProfile,
  author: UpdateAuthorProfile,
  free_author: UpdateFreeAuthorProfile,
  moderator: UpdateModeratorProfile,
  admin: UpdateAdminProfile,
};

export default function ProfileUpdate() {
  const currentRole = useAuthStore((state) => state.currentRole);
  const Form = FORM_BY_ROLE[currentRole] || UpdateReaderProfile;
  return <Form />;
}
