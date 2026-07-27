// utils/roleHelpers.js

const normalizeProfile = (profile, usernameKey) => {
  if (!profile) return null;
  return {
    ...profile,
    username: profile[usernameKey] ?? null,
  };
};

export const getProfileForRole = (user, role) => {
  if (!user) return null;
  switch (role) {
    case 'author':
      return normalizeProfile(user.author_profile, 'author_username');
    case 'free_author':
      return normalizeProfile(user.free_author_profile, 'author_username');
    case 'moderator':
      return normalizeProfile(user.moderator_profile, 'moderator_username');
    case 'admin':
      return normalizeProfile(user.admin_profile, 'admin_username');
    default:
      return normalizeProfile(user.profile, 'username');
  }
};

export const getAvailableRoles = (user) => {
  const availableRoles = [];
  if (!user) return availableRoles;

  if (user.profile) availableRoles.push({ role: 'reader', label: 'Reader' });
  if (user.free_author_profile) availableRoles.push({ role: 'free_author', label: 'Free Author' });
  if (user.author_profile) availableRoles.push({ role: 'author', label: 'Author' });
  if (user.moderator_profile) availableRoles.push({ role: 'moderator', label: 'Moderator' });
  if (user.admin_profile) availableRoles.push({ role: 'admin', label: 'Admin' });

  return availableRoles;
};

export const toTitleCase = (str) => str?.replace(/\b\w/g, (c) => c.toUpperCase()) ?? null;

// Maps each role to its dedicated route group.
export const getTabGroupForRole = (role) => {
  switch (role) {
    case 'reader':
      return '(reader-tabs)';
    case 'free_author':
      return '(free-author-tabs)';
    case 'author':
      return '(author-tabs)';
    case 'moderator':
      return '(moderator-tabs)';
    case 'admin':
      return '(admin-tabs)';
    default:
      return '(reader-tabs)';
  }
};

export const getDashboardRouteForRole = (role) => {
  return role === 'reader' ? 'dashboard' : `${role.replace('_', '-')}-dashboard`;
};

export const getSettingsRouteForRole = (role) => {
  return role === 'reader' ? 'settings' : `${role.replace('_', '-')}-settings`;
};