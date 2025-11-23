"use client";
import { useState } from "react";

export interface AuthFormProps {
  submitText: String,
}

export default function AuthForm({ submitText }: AuthFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: any) {
    e.preventDefault();
    const loginData = {
      username: username,
      password: password
    }
    console.log(JSON.stringify(loginData));
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>Username
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => {setUsername(e.target.value)}}
            required
          />
        </label>
        <label>Password
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => {setPassword(e.target.value)}}
            required
          />
        </label>
        <button type="submit">{submitText}</button>
      </form>
    </>
  );
}
