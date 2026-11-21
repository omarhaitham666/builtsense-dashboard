import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export function usersQueryKey(accountId: string) {
  return ["users", accountId] as const;
}