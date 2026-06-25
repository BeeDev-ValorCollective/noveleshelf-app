// hooks/useFullName.js
import useAuthStore from '../store/authStore'

export default function useFullName() {
    const user = useAuthStore((state) => state.user)
    const currentProfile = useAuthStore((state) => state.currentProfile)
    const currentRole = useAuthStore((state) => state.currentRole)

    const profile = (currentRole === 'admin' || currentRole === 'moderator')
        ? user?.profile
        : currentProfile

    if (profile?.first_name || profile?.last_name) {
        return `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim()
    }

    return null
}