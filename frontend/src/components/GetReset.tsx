import { useRef, useState } from "react";
import axios from "axios";
import { useNavigate} from "react-router-dom";

import Header from "./Header";

const GetReset = () => {
  const emailRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputStyle =
    "border-1 border-sky-500 w-8/10 w-full mb-[10px] p-[10px] bg-white rounded-md";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // const token = localStorage.getItem("token");

    try {
      const email =  emailRef.current?.value;

      if(!email){
        setErrorMessage('email is required');
        return
      }

      const userEmail = {email}
      const res = await axios.post(
        "https://localhost:3000/auth/getChangePassword",
        userEmail,
        {
          headers: {
            "Content-Type": "application/json",

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
            type="email"
            name="email"
            ref={emailRef}
            className={inputStyle}
            placeholder="email"
          ></input>


          <button
            type="submit"
            className="bg-sky-500 mt-[20px] pt-[10px] pb-[10px] pl-[20px] pr-[20px] rounded-md text-white border-white border-1 hover:bg-sky-600 cursor-pointer hover:text-gray-700"
          >
            Send E-Mail
          </button>
          {errorMessage}
        </form>

      </div>
    </>
  );
};

export default GetReset;
