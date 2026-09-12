import { useQuery } from '@tanstack/react-query';
import { fetchMessages } from '../api/messages.js';

export function useMessages() {
  return useQuery({
    queryKey: ['messages'],
    queryFn: fetchMessages,
    refetchInterval: 30_000,
    staleTime: 15_000,
    retry: 1,
  });
}