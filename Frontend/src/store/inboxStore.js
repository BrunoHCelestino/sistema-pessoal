import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useInboxStore = create(
  persist(
    (set, get) => ({
      readIds: {},
      hiddenIds: {},

      isRead: (id) => Boolean(get().readIds[id]),
      isHidden: (id) => Boolean(get().hiddenIds[id]),

      markRead: (id) => {
        if (get().readIds[id]) return;
        set((state) => ({ readIds: { ...state.readIds, [id]: true } }));
      },

      setRead: (id, read) => {
        const { readIds } = get();
        const next = { ...readIds };
        if (read) next[id] = true;
        else delete next[id];
        set({ readIds: next });
      },

      hide: (id) => {
        if (get().hiddenIds[id]) return;
        set((state) => ({ hiddenIds: { ...state.hiddenIds, [id]: true } }));
      },
    }),
    { name: 'bc_inbox' }
  )
);

export function useUnreadCount(messages) {
  const readIds = useInboxStore((state) => state.readIds);
  if (!messages?.length) return 0;
  return messages.reduce(
    (count, message) => count + (readIds[message.id] ? 0 : 1),
    0
  );
}

export function visibleMessages(messages, hiddenIds) {
  if (!messages) return [];
  return messages.filter((message) => !hiddenIds[message.id]);
}