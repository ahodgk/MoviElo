export const adjustElo = (
  elo: number,
  expected_score: number,
  score: number,
  initial_k: number,
  count: number,
  tuning_param: number,
) => {
  const k = K(initial_k, count, tuning_param); // Assuming count is 0 for initial calculation
  const new_elo = elo + k * (score - expected_score);
  if (Math.abs(new_elo - elo) < 0.5) {
    return new_elo - elo > 0 ? elo + 1 : elo - 1; // Ensure a minimum change of 0.5
  }
  return new_elo;
};

export const K = (initial_k: number, count: number, tuning_param: number) => {
  return initial_k / (1 + count / tuning_param);
};
