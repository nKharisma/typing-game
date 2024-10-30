import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const getToken = async () => {
    return "JWT TOKEN";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        const response = await fetch("https://typecode.app/api/leaderboard", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            mode: 'cors',
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        setLeaderboardData(result);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchData();
  }, [getToken]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const items = [
    {
      score: 4253,
      username: "Bill",
    },
    {
      score: 8902,
      name: "Jill",
    },
    {
      score: 6492,
      username: "Will",
    },
    {
      score: 1325,
      username: "Kill",
    },
    {
      score: 8907,
      username: "pill",
    },
  ];

  const leaderboardCards = items.map((item) => (
    <div key={item.score} className="leaderboard-card">
      <p className="leaderboard-card-score">{item.score}</p>
      <p className="leaderboard-card-name">{item.username}</p>
    </div>
  ));

  return (
    <div>
      <h1>Data from API:</h1>
      <p>{JSON.stringify(leaderboardData, null, 2)}</p>
      <br />
      <div className="leaderboard-card-container">{leaderboardCards}</div>
      <hr></hr>
      <h1 className="dashboard-title">Dashboard page</h1>
      <p>This is a protected page.</p>
    </div>
  );
}
