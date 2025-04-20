import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  const headerLinkStyle =
    "bg-sky-500 pt-[10px] pb-[10px] pl-[20px] pr-[20px] hover:bg-sky-700 cursor-pointer hover:text-white rounded-md  text-white m-[10px] border-1 border-white";
  return (
    <header className="w-full bg-cyan-100">
      <Link to={"/signin"}>
        <button className={headerLinkStyle}>Signin</button>
      </Link>
      <button onClick={logout} className={headerLinkStyle}>
        Logout
      </button>
    </header>
  );
};

export default Header;
