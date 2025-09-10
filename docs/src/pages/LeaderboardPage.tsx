import { useState, useEffect } from 'react';

import getBackendUrl from "../utils/getBackendUrl";
import '../css/LeaderboardPage.css';

interface PlayerData {
  score: number;
  highScore: number;
  wordsPerMinute: number;
  totalWordsTyped: number;
  accuracy: number;
  levelsCompleted: number;
  _id: string;
}

interface LeaderboardUser {
  id: string;
  name: string;
  email: string;
  playerdata: PlayerData;
}

type SortByOption =
  | 'highScore'
  | 'wordsPerMinute'
  | 'totalWordsTyped'
  | 'accuracy'
  | 'levelsCompleted';

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [sortBy, setSortBy] = useState<SortByOption>('highScore');
  const [loading, setLoading] = useState<boolean>(false);
  const limit = 10;

  const sortByOptions: { value: SortByOption; label: string }[] = [
    { value: 'highScore', label: 'High Score' },
    { value: 'wordsPerMinute', label: 'Words Per Minute' },
    { value: 'totalWordsTyped', label: 'Total Words Typed' },
    { value: 'accuracy', label: 'Accuracy' },
    { value: 'levelsCompleted', label: 'Levels Completed' },
  ];

  useEffect(() => {
    setLoading(true);
    fetch(`${getBackendUrl()}/api/v1/user/get-leaderboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sortBy, limit }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLeaderboardData(data.leaderboard);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching leaderboard data:', error);
        setLoading(false);
      });
  }, [sortBy]);

  const handleSortByChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value as SortByOption);
  };

  const currentSortByLabel = sortByOptions.find(
    (option) => option.value === sortBy
  )?.label;

  return (
    <div className='leaderboard-page__container'>
      <div className='leaderboard-page'>
        <h1>Leaderboard</h1>
        <div className='leaderboard-page__controls'>
          <label htmlFor='sortBy'>Sort By:</label>
          <div className='custom-select'>
            <select id='sortBy' value={sortBy} onChange={handleSortByChange}>
              {sortByOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <table className='leaderboard-table'>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>{currentSortByLabel}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3}>Loading...</td>
              </tr>
            ) : (
              leaderboardData.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.playerdata[sortBy]}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
