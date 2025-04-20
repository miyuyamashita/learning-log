import useSWR from "swr";
import { Link, useLocation } from "react-router-dom";

const LogList = () => {
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

  const { data, error, isLoading } = useSWR(
    "https://localhost:3000/api/fetchLogs",
    fetcher
  );

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get("keyword") || "";
  const keywords = keyword.split(" ");

  if (error) {
    return <h1>{error.message}</h1>;
  }
  if (isLoading) {
    return <h1>Loading</h1>;
  }
  if(!data){

  }

  const filteredData = data.filter((log: any) => {
    return keywords.every((keyword) => {
      return (
        log.title.toLowerCase().includes(keyword) ||
        log.content.toLowerCase().includes(keyword)
      );
    });
  });

  return (
    <>
      <div className="grid grid-cols-4 gap-10 p-[20px]">
        {filteredData.map((log: any) => {
          const date = new Date(log.date);
          return (
            <Link
              to={`/logDetail/${log._id}`}
              key={log._id}
              className="bg-sky-200 hover:bg-sky-300 rounded-md shadow-md"
            >
              <div
                key={log._id}
                className="pl-[10px] pr-[10px] pt-[20px] pb-[20px] rounded-md "
              >
                <strong>{log.title}</strong>

                <hr className="mb-[10px]"></hr>
                <div className="h-20 overflow-hidden bg-white rounded-md">
                  {log.content}
                </div>
                <span className="text-gray-700">({date.toDateString()})</span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default LogList;
