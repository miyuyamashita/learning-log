import { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SigninForm = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const inputStyle =
    "border-1 border-sky-500 w-8/10 w-full mb-[10px] p-[10px] bg-white rounded-md";

  const errorMessageStyle = 'text-red-500 mt-[10px] ';
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {

      const errors : string[] = [];

      const email = emailRef.current?.value.trim().toLowerCase();
      const password = passwordRef.current?.value;
      const confirmPassword = confirmPasswordRef.current?.value;

      if(!email){
        errors.push('Email is required')
      }
      if(!password){
        errors.push('Password is required')
      }
      if(!confirmPassword){
        errors.push("Please confirm your password")
      }
      if(password && confirmPassword && password !== confirmPassword){
        errors.push('Passwords do not match')
      }
      if(password && password.length < 5){
        errors.push("Password must be at least 5 characters")
      }

      if(errors.length > 0){
        setErrorMessages(errors);
        return ;
      }

      const user = {
        email, password, confirmPassword
      };

      await axios.post("https://localhost:3000/auth/signup", user, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      navigate("/");

    } catch (e: any) {
      if (e.response && e.response.data && e.response.data.message) {
        setErrorMessages([e.response.data.message]);
      }
    }
  };

  return (
    <>
      <div className="flex justify-center mt-[20px]">
        <form
          onSubmit={onSubmit}
          method="POST"
          className="w-8/10 p-10 flex flex-col items-center bg-sky-300 rounded-xl"
        >
          <div className="text-3xl mb-[30px] text-white font-bold">Signup</div>
          <input
            type="text"
            name="email"
            ref={emailRef}
            className={inputStyle}
            placeholder="E-mail"

          ></input>

          <input
            type="password"
            name="password"
            ref={passwordRef}
            className={inputStyle}
            placeholder="Password"
          ></input>
          <input
            type="password"
            name="confirmPassword"
            ref={confirmPasswordRef}
            className={inputStyle}
            placeholder="confirmPassword"
          ></input>

          <button
            type="submit"
            className="bg-sky-500 mt-[20px] pt-[10px] pb-[10px] pl-[20px] pr-[20px] rounded-md text-white border-white border-1 hover:bg-sky-600 cursor-pointer hover:text-gray-700"
          >
            Register
          </button>
          {errorMessages.map(error => <p className={errorMessageStyle} key={error}>
            {error}
          </p>)}
        </form>
      </div>
    </>
  );
};

export default SigninForm;
