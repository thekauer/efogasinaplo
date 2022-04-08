import { User } from "firebase/auth";
import { atom } from "recoil";

export const userIdAtom = atom<string | null>({
  key: "userState",
  default: null,
});
