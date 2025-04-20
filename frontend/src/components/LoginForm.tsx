import { useRef, useState, } from "react";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";

import Header from "./Header";

const LoginForm = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const inputStyle =
    "border-1 border-sky-500 w-8/10 w-full mb-[10px] p-[10px] bg-white rounded-md";
    const errorMessageStyle = 'text-red-500 mt-[10px] ';
  const onSubmit = async (e: React.FormEvent) => {
    const errors : string[] = [];
    e.preventDefault();
    try {

        const email=  emailRef.current?.value.trim().toLowerCase();
        const password= passwordRef.current?.value;

      if(!email){
        errors.push('Email is not provided');
      }

      if(!password){
        errors.push('password is not provided');
      }

      if(errors.length > 0){
        setErrorMessages(errors);
        return
      }

      const user = {email, password};

      const res = await axios.post("https://localhost:3000/auth/login", user, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const token = res.data.token;
      console.log(res.data);
      localStorage.setItem("token", token);
      localStorage.setItem('userId',res.data.userId)
      navigate("/home");
    } catch (e: any) {
      if (e.response && e.response.data && e.response.data.message) {
        setErrorMessages([e.response.data.message]);
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


          {errorMessages.map(error => <p className={errorMessageStyle} key={error}>
            {error}
          </p>)}
        </form>
      </div>
    </>
  );
};

export default LoginForm;
