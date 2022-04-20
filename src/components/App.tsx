import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userIdAtom } from "../atoms/UserAtom";
import { auth } from "../lib/firebase";
import { Home } from "../pages/Home";
import { List } from "../pages/List";
import Log from "../pages/Log";
import { Login } from "../pages/Login";
import { NewRecord } from "./NewRecord/NewRecord";

export const App = () => {
  let navigate = useNavigate();
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [userId, setUserId] = useRecoilState(userIdAtom);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user === undefined) return;
    const isSignedIn = !!user?.uid;

    if (!isSignedIn) {
      navigate("/login");
    } else {
      setUserId(user.uid);
      navigate("/");
    }
  }, [user]);

  return (
    <Routes>
      <Route
        index
        element={<Home username={user?.displayName?.split(" ")[1] as any} />}
      />
      <Route path="login" element={<Login />} />
      <Route path="new" element={<NewRecord />} />
      <Route path="list" element={<List />} />
      <Route path="log" element={<Log />} />
      {/* <Route path="catches" element={}>
            <Route path=":catchId" element={} />
            <Route path="new" element={} />
            <Route index element={} />
          </Route> */}
    </Routes>
  );
};
