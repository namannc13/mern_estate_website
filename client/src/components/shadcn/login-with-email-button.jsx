import { EnvelopeOpenIcon } from "@radix-ui/react-icons";
import { ReloadIcon } from "@radix-ui/react-icons";

import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  signInSuccess,
  signInStart,
  signInFailure,
} from "../../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

export function EmailButton({ name }) {
  const { loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      dispatch(signInStart());
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await fetch("/server/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure("Authentication Error"));
    }
  };
  return (
    <Button onClick={handleGoogleClick} disabled={loading}>
      {loading ? (
        <>
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          loading...
        </>
      ) : (
        <>
          <EnvelopeOpenIcon className="mr-2 h-4 w-4" />
          {name} with Email
        </>
      )}
    </Button>
  );
}

