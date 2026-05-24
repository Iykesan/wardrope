import { createId } from "@/shared/lib/utils";

const USER_ID_KEY = "wardrope:user-id";

export const getOrCreateUserId = () => {
  if (typeof window === "undefined") {
    return "server-user";
  }

  const existing = window.localStorage.getItem(USER_ID_KEY);
  if (existing) {
    return existing;
  }

  const nextId = createId();
  window.localStorage.setItem(USER_ID_KEY, nextId);
  return nextId;
};
