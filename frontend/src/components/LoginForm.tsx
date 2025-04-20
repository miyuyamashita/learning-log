import { useRef, useState, } from "react";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";

import Header from "./Header";

const LoginForm = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputStyle =
    "border-1 border-sky-500 w-8/10 w-full mb-[10px] p-[10px] bg-white rounded-md";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = {
        email: emailRef.current?.value,
        password: passwordRef.current?.value,
      };
      const res = await axios.post("https://localhost:3000/auth/login", user, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const token = res.data.token;
      localStorage.setItem("token", token);
      navigate("/home");
    } catch (e: any) {
      if (e.response && e.response.data && e.response.data.message) {
        setErrorMessage(e.response.data.message);
      }
    }
  };

  return (
    <>
      <Header />
      <div className="flex justify-center mt-[20px]">
        <form
          onSubmit={onSubmit}
          method="POST"
          className="w-8/10 p-10 flex flex-col items-center bg-sky-300 rounded-xl"
        >
          <div className="text-3xl mb-[30px] text-white font-bold">Login</div>
          <input
            type="email"
            name="email"
            ref={emailRef}
            className={inputStyle}
            placeholder="Email"
          ></input>

          <input
            type="password"
            name="password"
            ref={passwordRef}
            className={inputStyle}
            placeholder="Password"
          ></input>

          <button
            type="submit"
            className="bg-sky-500 mt-[20px] pt-[10px] pb-[10px] pl-[20px] pr-[20px] rounded-md text-white border-white border-1 hover:bg-sky-600 cursor-pointer hover:text-gray-700"
          >
            Login
          </button>
            <Link to={'/getChangePassword'}>
              <button className="underline hover hover:text-white" >
                Change Password
              </button>
            </Link>


          {errorMessage && (
            <p className="text-red-600 mt-2 font-semibold">{errorMessage}</p>
          )}
        </form>
      </div>
    </>
  );
};

export default LoginForm;
