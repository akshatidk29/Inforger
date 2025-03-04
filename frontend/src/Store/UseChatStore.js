import { create } from "zustand";
import toast from "react-hot-toast";
import { UseAuthStore } from "./UseAuthStore";
import { axiosInstance } from "../Lib/Axios.js";

// Zustand store to manage chat-related state
export const UseChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/Message/User");
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch users");
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        if (!userId) return;
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/Message/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch messages");
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (text) => {
        const { selectedUser, messages } = get();
        if (!selectedUser) return;

        try {
            const res = await axiosInstance.post(`/Message/Send/${selectedUser._id}`,  text);
            set({ messages: [...messages, res.data] });
            toast.success("Message sent!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send message");
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = UseAuthStore.getState().socket;
        socket.on("newMessage", (newMessage) => {
            set({ messages: [...get().messages, newMessage] });
        });
    },

    unsubscribeFromMessages: () => {
        const socket = UseAuthStore.getState().socket;
        socket.off("newMessage");
    },

    setSelectedUser: (selectedUser) => {
        set({ selectedUser });
        toast.success(`Chatting with ${selectedUser.fullname}`);
    },
}));
