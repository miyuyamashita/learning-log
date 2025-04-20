import { useParams, Link, useNavigate } from "react-router-dom";
import useSWR from "swr";
import axios from "axios";

type Log = {
  _id: string;
  title: string;
  content: string;
  date: string;
};
const fetcher = async (url: string) => {
  const token = localStorage.getItem("token");
  if(!token){
    throw new Error('You have to log in');
  }
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  // if(!res.ok){
  //   if (res.status === 401) {
  //     throw new Error("認証エラー：ログインし直してください");
  //   }
  //   throw new Error("データの取得に失敗しました");
  // }

  return res.json();

};

const LogDetail = () => {
  const { logId } = useParams();
  const buttonStyle =
    "bg-sky-500 m-[20px]  pt-[10px] pb-[10px] pl-[20px] pr-[20px] hover:bg-sky-700 cursor-pointer hover:text-white rounded-md text-gray-700";

  const navigate = useNavigate();

  const onDelete = async (logId: string) => {
    const token = localStorage.getItem("token");
    if(!token){
      throw new Error('You have to log in');
    }
    await axios.delete(`https://localhost:3000/api/deleteLog/${logId}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    navigate("/home");
  };

  const {
    data: log,
    error,
    isLoading,
  } = useSWR<Log>(`https://localhost:3000/api/fetchLog/${logId}`, fetcher);

  if (error) {
    console.log(error);
    return <div>An error occurred</div>;
  }
  if (isLoading) {
    return <div>Loading</div>;
  }
  if (!log) {
    return <div>The log was undefined</div>;
  }

  return (
    <div className="w-8/10 m-auto mt-[50px]">
      <div className="bg-sky-200 rounded-md shadow-md flex flex-col items-center p-[30px]  relative">
        <div className="flex justify-center w-8/10">
          <strong>{log.title}</strong>
          <span className="absolute right-10">({log.date})</span>
        </div>
        <hr className="mb-[30px] w-8/10"></hr>
        <div>{log.content}</div>

        <div>
          <Link to={`/editLog/${log._id}`} key={log._id + "-edit"}>
            <button className={buttonStyle}>Edit</button>
          </Link>
          <Link to={`/deleteLog/${log._id}`} key={log._id + "-delete"}>
            <button className={buttonStyle} onClick={() => onDelete(log._id)}>
              Delete
            </button>
          </Link>
        </div>
      </div>
      <button className={buttonStyle} onClick={() => navigate("/home")}>
        ← Back
      </button>
    </div>
  );
};

export default LogDetail;
