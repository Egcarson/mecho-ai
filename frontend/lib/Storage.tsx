const KEY = "localvoice_username";

export const storage = {
  getName: () => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem(KEY);
  },

  setName: (name: string) => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(KEY, name);
  },

  clearName: () => {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(KEY);
  },
};
