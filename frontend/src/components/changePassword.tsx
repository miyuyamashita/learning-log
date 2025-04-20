import { useRef, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import Header from "./Header";

const ChangePassword = () => {
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputStyle =
    "border-1 border-sky-500 w-8/10 w-full mb-[10px] p-[10px] bg-white rounded-md";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const user = {
        password: passwordRef.current?.value,
        confirmPassword: confirmPasswordRef.current?.value,
      };
      const res = await axios.post(
        "http://localhost:3005/auth/changePassword",
        user,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      navigate("/");
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
          <div className="text-3xl mb-[30px] text-white font-bold">
            Change Password
          </div>
          <input
            type="password"
            name="password"
            ref={passwordRef}
            className={inputStyle}
            placeholder="New password"
          ></input>

          <input
            type="password"
            name="confirmPassword"
            ref={confirmPasswordRef}
            className={inputStyle}
            placeholder="Confirm new Password"
          ></input>

          <button
            type="submit"
            className="bg-sky-500 mt-[20px] pt-[10px] pb-[10px] pl-[20px] pr-[20px] rounded-md text-white border-white border-1 hover:bg-sky-600 cursor-pointer hover:text-gray-700"
          >
            Change Password
          </button>
          {errorMessage}
        </form>

      </div>
    </>
  );
};

export default ChangePassword;
