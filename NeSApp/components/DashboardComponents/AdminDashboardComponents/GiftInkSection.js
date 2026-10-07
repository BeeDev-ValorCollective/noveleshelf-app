import { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Modal,
    FlatList,
    Alert,
    Platform,
} from "react-native";

import { ChevronDown, Search, X } from "lucide-react-native";

import useAuthStore from "../../../store/authStore";
import { ENDPOINTS } from "../../../utils/api";
import { colors } from "../../../constants/colors";
import { fonts } from "../../../constants/fonts";

export default function GiftInkSection() {
    const accessToken = useAuthStore((state) => state.accessToken);

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const [search, setSearch] = useState("");
    const [amount, setAmount] = useState("");
    const [notes, setNotes] = useState("");

    const [selectorOpen, setSelectorOpen] = useState(false);

    const [loadingUsers, setLoadingUsers] = useState(true);

    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (!accessToken) {
            return;
        }

        fetchUsers();
    }, [accessToken]);

    /*
     * The server returns users 20 at a time.
     * This loads every page so the admin selector
     * can search the full user list.
     */
    const fetchUsers = async () => {
        setLoadingUsers(true);
        setError("");

        try {
            let page = 1;
            let allUsers = [];
            let totalPages = 1;

            do {
                const response = await fetch(
                    `${ENDPOINTS.admin.listUsers}?page=${page}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    },
                );

                const data = await response.json().catch(() => ({}));

                if (!response.ok) {
                    throw new Error(
                        data?.detail || data?.error || "Could not load users.",
                    );
                }

                allUsers = [...allUsers, ...(data.results || [])];

                totalPages = data.total_pages || 1;
                page += 1;
            } while (page <= totalPages);

            setUsers(allUsers);
        } catch (err) {
            console.error("Admin user list error:", err);

            setError(err.message || "Could not load users.");
        } finally {
            setLoadingUsers(false);
        }
    };

    const filteredUsers = users.filter((user) => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return true;
        }

        const email = user?.email?.toLowerCase() || "";

        const username = user?.profile?.username?.toLowerCase() || "";

        const firstName = user?.profile?.first_name?.toLowerCase() || "";

        const lastName = user?.profile?.last_name?.toLowerCase() || "";

        const fullName = `${firstName} ${lastName}`.trim();

        return (
            email.includes(query) ||
            username.includes(query) ||
            firstName.includes(query) ||
            lastName.includes(query) ||
            fullName.includes(query)
        );
    });

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setSelectorOpen(false);
        setSearch("");
        setError("");
        setSuccess("");
    };

    const handleGift = () => {
        setError("");
        setSuccess("");

        const parsedAmount = Number.parseInt(amount, 10);

        if (!selectedUser) {
            setError("Please select a user.");
            return;
        }

        if (!Number.isInteger(parsedAmount) || parsedAmount <= 0) {
            setError("Gift amount must be a positive whole number.");
            return;
        }

        const message = `Gift ${parsedAmount} Black Ink ${parsedAmount === 1 ? "drop" : "drops"
            } to ${selectedUser.email}?`;

        /*
         * Expo Web does not reliably display Alert.alert(),
         * so use the browser confirmation dialog there.
         */
        if (Platform.OS === "web") {
            const confirmed = window.confirm(message);

            if (confirmed) {
                submitGift(parsedAmount);
            }

            return;
        }

        /*
         * Native iOS / Android confirmation.
         */
        Alert.alert("Gift Black Ink", message, [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "Gift",
                onPress: () => submitGift(parsedAmount),
            },
        ]);
    };

    const submitGift = async (parsedAmount) => {
        setSubmitting(true);
        setError("");
        setSuccess("");

        try {
            const response = await fetch(ENDPOINTS.currency.adminGiftCurrency, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: selectedUser.id,
                    amount: parsedAmount,
                    notes: notes.trim() || "Admin gift",
                }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                setError(data?.detail || data?.error || "Could not gift Black Ink.");

                return;
            }

            const newBalance = data?.wallet?.black_ink_balance;

            setSuccess(
                `${data.detail}${newBalance !== undefined ? ` New balance: ${newBalance}.` : ""
                }`,
            );

            setAmount("");
            setNotes("");
        } catch (err) {
            console.error("Gift Black Ink error:", err);

            setError("Unable to connect to the server.");
        } finally {
            setSubmitting(false);
        }
    };

    const renderUser = ({ item }) => (
        <TouchableOpacity
            style={styles.userOption}
            onPress={() => handleSelectUser(item)}
        >
            <Text style={styles.userEmail} numberOfLines={1}>
                {item.email}
            </Text>

            {item.username && (
                <Text style={styles.userUsername} numberOfLines={1}>
                    {item.username}
                </Text>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Gift Black Ink</Text>

            <Text style={styles.description}>
                Add Black Ink drops directly to a reader's wallet.
            </Text>

            {/* Recipient */}
            <View style={styles.field}>
                <Text style={styles.label}>Recipient</Text>

                <TouchableOpacity
                    style={styles.selector}
                    onPress={() => setSelectorOpen(true)}
                    disabled={loadingUsers}
                >
                    {loadingUsers ? (
                        <ActivityIndicator size="small" color={colors.primary} />
                    ) : (
                        <>
                            <Text
                                style={[
                                    styles.selectorText,
                                    !selectedUser && styles.placeholder,
                                ]}
                                numberOfLines={1}
                            >
                                {selectedUser?.email || "Select a user"}
                            </Text>

                            <ChevronDown size={18} color={colors.secondary} />
                        </>
                    )}
                </TouchableOpacity>
            </View>

            {/* Amount */}
            <View style={styles.field}>
                <Text style={styles.label}>Black Ink Drops</Text>

                <TextInput
                    style={styles.input}
                    value={amount}
                    onChangeText={setAmount}
                    placeholder="25"
                    placeholderTextColor={colors.secondary}
                    keyboardType="number-pad"
                    editable={!submitting}
                />
            </View>

            {/* Notes */}
            <View style={styles.field}>
                <Text style={styles.label}>Reason / Notes</Text>

                <TextInput
                    style={[styles.input, styles.notesInput]}
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="Optional reason for the gift..."
                    placeholderTextColor={colors.secondary}
                    multiline
                    textAlignVertical="top"
                    editable={!submitting}
                />
            </View>

            {/* Selected recipient summary */}
            {selectedUser && (
                <View style={styles.summary}>
                    <Text style={styles.summaryLabel}>Recipient</Text>

                    <Text style={styles.summaryValue} numberOfLines={1}>
                        {selectedUser.email}
                    </Text>
                </View>
            )}

            {error ? <Text style={styles.error}>{error}</Text> : null}

            {success ? <Text style={styles.success}>{success}</Text> : null}

            <TouchableOpacity
                style={[
                    styles.giftButton,
                    (!selectedUser || !amount || submitting) && styles.buttonDisabled,
                ]}
                onPress={handleGift}
                disabled={!selectedUser || !amount || submitting}
            >
                {submitting ? (
                    <ActivityIndicator size="small" color={colors.background} />
                ) : (
                    <Text style={styles.giftButtonText}>Gift Black Ink</Text>
                )}
            </TouchableOpacity>

            {/* User selector modal */}
            <Modal
                visible={selectorOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setSelectorOpen(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select User</Text>

                            <TouchableOpacity
                                onPress={() => setSelectorOpen(false)}
                                style={styles.modalClose}
                            >
                                <X size={20} color={colors.white} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.searchBox}>
                            <Search size={18} color={colors.secondary} />

                            <TextInput
                                style={styles.searchInput}
                                value={search}
                                onChangeText={setSearch}
                                placeholder="Search email or username..."
                                placeholderTextColor={colors.secondary}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />

                            {search.length > 0 && (
                                <TouchableOpacity onPress={() => setSearch("")}>
                                    <X size={17} color={colors.secondary} />
                                </TouchableOpacity>
                            )}
                        </View>

                        <FlatList
                            data={filteredUsers}
                            keyExtractor={(item) => String(item.id)}
                            renderItem={renderUser}
                            keyboardShouldPersistTaps="handled"
                            style={styles.userList}
                            ListEmptyComponent={
                                <Text style={styles.emptyText}>No matching users.</Text>
                            }
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginTop: 20,
        marginBottom: 20,
        padding: 18,

        backgroundColor: "rgba(255,255,255,0.04)",

        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",

        borderRadius: 16,
    },

    heading: {
        color: colors.white,
        fontFamily: fonts.fredericka,
        fontSize: 24,
    },

    description: {
        color: colors.secondary,
        fontFamily: fonts.meriendaRegular,
        fontSize: 13,
        marginTop: 5,
        marginBottom: 18,
    },

    field: {
        width: "100%",
        marginBottom: 15,
    },

    label: {
        color: colors.secondary,
        fontFamily: fonts.meriendaRegular,
        fontSize: 13,
        marginBottom: 6,
    },

    selector: {
        width: "100%",
        minHeight: 48,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        paddingHorizontal: 14,

        backgroundColor: "rgba(255,255,255,0.05)",

        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.12)",

        borderRadius: 8,
    },

    selectorText: {
        flex: 1,
        color: colors.white,
        fontFamily: fonts.meriendaRegular,
        fontSize: 14,
        marginRight: 10,
    },

    placeholder: {
        color: colors.secondary,
    },

    input: {
        width: "100%",
        minHeight: 48,

        paddingHorizontal: 14,
        paddingVertical: 10,

        color: colors.white,

        backgroundColor: "rgba(255,255,255,0.05)",

        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.12)",

        borderRadius: 8,

        fontFamily: fonts.meriendaRegular,
        fontSize: 14,
    },

    notesInput: {
        minHeight: 100,
        paddingTop: 12,
    },

    summary: {
        width: "100%",

        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

        padding: 12,
        marginBottom: 14,

        backgroundColor: "rgba(104,185,185,0.08)",

        borderWidth: 1,
        borderColor: "rgba(104,185,185,0.20)",

        borderRadius: 8,
    },

    summaryLabel: {
        color: colors.secondary,
        fontFamily: fonts.meriendaRegular,
        fontSize: 12,
    },

    summaryValue: {
        flex: 1,
        marginLeft: 12,

        color: colors.white,
        fontFamily: fonts.meriendaBold,
        fontSize: 13,

        textAlign: "right",
    },

    error: {
        color: "#dd7a7a",
        fontFamily: fonts.meriendaRegular,
        fontSize: 13,
        marginBottom: 12,
    },

    success: {
        color: "#7ec8a0",
        fontFamily: fonts.meriendaRegular,
        fontSize: 13,
        marginBottom: 12,
    },

    giftButton: {
        minHeight: 48,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor: colors.primary,

        borderRadius: 10,

        paddingHorizontal: 20,
    },

    buttonDisabled: {
        opacity: 0.5,
    },

    giftButtonText: {
        color: colors.background,
        fontFamily: fonts.meriendaBold,
        fontSize: 15,
    },

    /* User selector */

    modalOverlay: {
        flex: 1,

        justifyContent: "center",

        paddingHorizontal: 20,

        backgroundColor: "rgba(0,0,0,0.75)",
    },

    modalCard: {
        width: "100%",
        maxHeight: "75%",

        alignSelf: "center",

        backgroundColor: "#1a1c2e",

        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.12)",

        borderRadius: 16,

        padding: 18,
    },

    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        marginBottom: 14,
    },

    modalTitle: {
        color: colors.white,
        fontFamily: fonts.fredericka,
        fontSize: 22,
    },

    modalClose: {
        padding: 6,
    },

    searchBox: {
        flexDirection: "row",
        alignItems: "center",

        minHeight: 46,

        paddingHorizontal: 12,
        marginBottom: 12,

        backgroundColor: "rgba(255,255,255,0.05)",

        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.12)",

        borderRadius: 8,

        gap: 8,
    },

    searchInput: {
        flex: 1,

        color: colors.white,

        fontFamily: fonts.meriendaRegular,
        fontSize: 13,

        paddingVertical: 10,
    },

    userList: {
        width: "100%",
    },

    userOption: {
        paddingVertical: 12,
        paddingHorizontal: 10,

        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.08)",
    },

    userEmail: {
        color: colors.white,
        fontFamily: fonts.meriendaRegular,
        fontSize: 14,
    },

    userUsername: {
        color: colors.secondary,
        fontFamily: fonts.meriendaRegular,
        fontSize: 12,
        marginTop: 2,
    },

    emptyText: {
        color: colors.secondary,
        fontFamily: fonts.meriendaRegular,
        fontSize: 13,

        textAlign: "center",
        paddingVertical: 24,
    },
});
