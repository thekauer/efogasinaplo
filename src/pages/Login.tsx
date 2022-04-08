import { Button } from "@mantine/core";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../lib/firebase";

export const Login = () => {
  const signInClick = () => signInWithPopup(auth, new GoogleAuthProvider());

  return (
    <div>
      <h1>Csatlakoz Google fiókodda!</h1>
      <Button onClick={signInClick}>Csatlakozz!</Button>
    </div>
  );
};
