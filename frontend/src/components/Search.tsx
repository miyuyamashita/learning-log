import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const handleSearch = () => {
    navigate(`/home?keyword=${encodeURIComponent(keyword)}`);
  };
  return (
    <>
      <div className="flex justify-center items-center mt-10">
        <input
          className="border-1 border-gray-600 rounded-md rounded-tr-none text-lg h-[44px] rounded-br-none input"
          type="text"
          onChange={(e) => setKeyword(e.target.value.toLowerCase())}
        ></input>

        <button
          className="bg-sky-500 pt-[10px] pb-[10px] pl-[20px] pr-[20px] hover:bg-sky-700 cursor-pointer hover:text-white rounded-md rounded-tl-none rounded-bl-none text-white"
          onClick={() => handleSearch()}
        >
          Search
        </button>
      </div>
    </>
  );
};

export default Search;
