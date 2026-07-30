// components/SettingsComponents/AccountSection.js
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import useAuthStore from '../../store/authStore';
import { getAvailableRoles, getTabGroupForRole, getDashboardRouteForRole, toTitleCase } from '../../utils/roleHelpers';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

export default function AccountSection() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const currentRole = useAuthStore((state) => state.currentRole);
  const setCurrentRole = useAuthStore((state) => state.setCurrentRole);

  const availableRoles = getAvailableRoles(user);
  const showSwitcher = availableRoles.length > 1 && user?.is_verified;

  const handleRoleSwitch = (role) => {
    if (role === currentRole) return;
    setCurrentRole(role);
    router.replace(`/(protected)/${getTabGroupForRole(role)}/${getDashboardRouteForRole(role)}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>Current role</Text>
      <Text style={styles.currentRole}>{toTitleCase(currentRole)}</Text>

      {showSwitcher && (
        <View style={styles.switcherBlock}>
          <Text style={styles.sectionLabel}>Switch role</Text>
          <View style={styles.roleList}>
            {availableRoles.map((item) => (
              <Pressable
                key={item.role}
                onPress={() => handleRoleSwitch(item.role)}
                style={[
                  styles.roleOption,
                  currentRole === item.role && styles.roleOptionActive,
                ]}
              >
                <Text
                  style={[
                    styles.roleOptionText,
                    currentRole === item.role && styles.roleOptionTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
  },
  sectionLabel: {
    color: colors.secondary,
    fontFamily: fonts.meriendaRegular,
    fontSize: 22,
    marginBottom: 4,
  },
  currentRole: {
    color: colors.white,
    fontFamily: fonts.fredericka,
    fontSize: 22,
    marginBottom: 20,
  },
  switcherBlock: {
    marginBottom: 24,
  },
  roleList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  roleOption: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.tertiary,
  },
  roleOptionActive: {
    backgroundColor: colors.tertiary,
  },
  roleOptionText: {
    color: colors.tertiary,
    fontFamily: fonts.meriendaRegular,
    fontSize: 18,
  },
  roleOptionTextActive: {
    color: colors.background,
  },
});