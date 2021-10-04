import * as C from "./constants";

interface Run {
  rank: number;
  username: string;
  score: number;
  date: string;
}

export async function postScore(
  username: string,
  score: number
): Promise<{
  runs: Run[];
  myRun: Run;
}> {
  const response = await fetch(C.LEADERBOARD_URL + "/score/", {
    method: "POST",
    body: JSON.stringify({ username, score }),
  });
  return await response.json();
}
