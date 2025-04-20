import { useRef, useEffect } from "react";
import axios from "axios";
import { mutate } from "swr";
import { useParams, useNavigate } from "react-router-dom";
import useSWR from "swr";

type Log = {
  _id?: string;
  title: string;
  content: string;
  date: string;
};

const fetcher = async (url: string) => {
  const res = await fetch(url);
  return res.json();
};

const LogForm = () => {
  let isEditing = false;
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);

  //is Editing
  const { logId } = useParams();
  if (logId) isEditing = true;
  const navigate = useNavigate();
  const { data, error, isLoading } = useSWR<Log>(
    logId ? `https://localhost:3000/api/fetchLog/${logId}` : null,
    fetcher
  );
  if (error) {
    console.log(error);
    return <div>An error occurred</div>;
  }
  if (isLoading) {
    return <div>Loading</div>;
  }

  useEffect(() => {
    if (isEditing && data) {
      if (titleRef.current) titleRef.current.value = data.title;
      if (contentRef.current) contentRef.current.value = data.content;
      if (dateRef.current) dateRef.current.value = data.date;
    }
  }, [isEditing, data]);

  const onAddLog = async (e: React.FormEvent) => {
    const userId = localStorage.getItem('userId');
    if(!userId){
      throw new Error('You have to log in')
    }
    e.preventDefault(); //prevent reload page
    const newLog = {
      title: titleRef.current ? titleRef.current.value : "",
      content: contentRef.current ? contentRef.current.value : "",
      date: dateRef.current ? dateRef.current.value : "",
      userId: userId,
    };
    const token = localStorage.getItem("token");
    if(!token){
      throw new Error('You have to log in');
    }
    if (isEditing) {
      await axios.put(`https://localhost:3000/api/editLog/${logId}`, newLog,{
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
    } else {
      await axios.post("https://localhost:3000/api/postLog", newLog, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
    }
    if (titleRef.current) titleRef.current.value = "";
    if (contentRef.current) contentRef.current.value = "";
    if (dateRef.current) dateRef.current.value = "";
    mutate("https://localhost:3000/api/fetchLogs");
    if (isEditing) {
      isEditing = false;
      navigate("/home");
    }
  };

  const inputStyle =
    "border-1 border-sky-500 w-8/10 w-full mb-[10px] p-[10px] bg-white rounded-md";

  return (
    <div className="w-full flex justify-center p-10">
      <form
        onSubmit={onAddLog}
        method="POST"
        className="w-8/10 p-10 flex flex-col items-center bg-sky-300 rounded-xl"
      >
        <input
          type="text"
          name="title"
          ref={titleRef}
          className={inputStyle}
          placeholder="Title"
        ></input>

        <textarea
          name="content"
          ref={contentRef}
          className={inputStyle}
          rows={10}
        ></textarea>

        <input
          type="date"
          name="date"
          ref={dateRef}
          className={inputStyle}
        ></input>

        <button
          type="submit"
          className="bg-sky-500 mt-[20px] pt-[10px] pb-[10px] pl-[20px] pr-[20px] rounded-md text-white border-white border-1 hover:bg-sky-600 cursor-pointer hover:text-gray-700"
        >
          {isEditing ? "Edit" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default LogForm;
