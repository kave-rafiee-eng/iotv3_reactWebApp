import { create } from "zustand";

type userDataType = {
  devices: number[];
  email: string;
};
type useLoginStoreType = {
  isLogin: boolean;
  connectionType: "ws" | "mqtt";
  userData: userDataType;

  setUserData: (userData: userDataType) => void;

  changeLoginType: (type: "ws" | "mqtt") => void;
  setLogin: (value: boolean) => void;
};
export const useLoginStore = create<useLoginStoreType>((set, get) => ({
  isLogin: true,
  setLogin: (value) => set({ isLogin: value }),
  changeLoginType: (type) => {
    set({ connectionType: type });
  },
  connectionType: "mqtt",
  userData: {
    devices: [],
    email: "",
  },
  setUserData: (userData) => {
    set({ userData: userData });
  },
}));
