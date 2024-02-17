import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice";

import { EmailButton } from "@/components/shadcn/login-with-email-button";
import { Button } from "@/components/ui/button"

export default function Signup() {
  const { error, loading } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    try { // this try and catch block is important for handling the error in the frontend rather than the backend 
      e.preventDefault();
      dispatch(signInStart());
      const res = await fetch("/server/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/login')
      console.log(data);
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  };

  console.log(formData);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="name"
          className="border p-3 rounded-lg"
          id="name"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />
        <Button
          variant="outline"
          disabled={loading}
          className=""
        >
          {loading ? "loading..." : "Sign Up"}
        </Button>
        {/* <OAuth /> */}
        <EmailButton name="Signup"/>
      </form>
      <div className="flex justify-between mt-5">
        <p>Have an Account?</p>
        <Link to={"/login"}>
          <span className="">Log In</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}
