import * as C from "./constants";

export function postScore(username: string, score: number) {
  fetch(C.LEADERBOARD_URL + "/score/", {
    method: "POST",
    body: JSON.stringify({ username, score }),
  });
}

export async function getLeaderboard(): Promise<{
  runs: { username: string; score: number; date: string }[];
}> {
  const response = await fetch(C.LEADERBOARD_URL + "/leaderboard/");
  return response.json();
}
