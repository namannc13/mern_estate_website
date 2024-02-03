import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from 'react-router-dom'

export default function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async() => {
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)

            const result = await signInWithPopup(auth, provider);

            const res = await fetch( 'server/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({ name: result.user.displayName, email: result.user.email, photo: result.user.photoURL}),
            });
            const data = await res.json();
            dispatch(signInSuccess(data))
            navigate('/')
        } catch (error) {
            console.log('could not sign in using google', error);
        }
    }
  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-1 rounded-lg p-3 uppercase hover:opacity-95"
    >
      {/** the type is set to button as it is inside a form in signup and login pages so if we click on it, it will submit the form . To prevent that , we will set the type of the button to "button". now clicking on it will not submit the form */}
      OAuth
    </button>
  );
}
