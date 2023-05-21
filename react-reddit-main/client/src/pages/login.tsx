import React, { FormEvent, useState } from "react";
import InputGroup from "../components/InputGroup";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import { useAuthDispatch, useAuthState } from "../context/auth";
import Image from "next/image";

const Login = () => {
  let router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any>({});
  const { authenticated } = useAuthState();
  const dispatch = useAuthDispatch();

  if (authenticated) router.push("/");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const res = await axios.post(
        "/auth/login",
        { password, username },
        { withCredentials: true }
      );

      dispatch("LOGIN", res.data?.user);

      router.push("/");
    } catch (error: any) {
      console.log(error);
      setErrors(error.response?.data || {});
    }
  };

  return (
    <div className="bg-white">
      <div className="flex flex-col items-center justify-center h-screen p-6">
        <div className="w-10/12 mx-auto md:w-96">
          <div className="flex justify-center items-center mb-12">
            <Image
              src="/images/logo.jpg"
              alt="compant logo"
              width={150}
              height={55}
            />
          </div>
          {/* <h1 className="mb-2 text-xl font-medium text-center rounded-l-lg">
            로그인
          </h1> */}
          <form onSubmit={handleSubmit}>
            <InputGroup
              placeholder="Email"
              value={username}
              setValue={setUsername}
              error={errors.username}
            />
            <InputGroup
              placeholder="Password"
              value={password}
              setValue={setPassword}
              error={errors.password}
            />
            <button className="w-full py-2 mb-1 text-xs font-bold text-white uppercase bg-pink-600 border border-gray-400 rounded-full">
              login
            </button>
          </form>
          <small>
            <Link href="/register">
              <a className="mx-20 text-g-500 uppercase">회원가입 </a>
            </Link>
            <Link href="/register">
              <a className="mx-10 text-g-500 uppercase">아이디 찾기</a>
            </Link>
            <Link href="/register">
              <a className="mx-10 text-g-500 uppercase">비밀번호 찾기</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
