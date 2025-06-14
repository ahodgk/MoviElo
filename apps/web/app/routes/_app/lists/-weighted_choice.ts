// function weightedRandomSelect(
//   items: { tmdbId: string; count: number }[],
//   alpha = 1.2,
// ) {
//   //   const items = _items.sort((a, b) => a.count - b.count);

//   const weights = items.map((it) => 1 / (it.count + 1) ** alpha);
//   // Calculate total sum of weights
//   const totalWeight = weights.reduce((s, w) => s + w, 0);

//   // Generate a random number in the range [0, totalWeight)
//   let randomValue = Math.random() * totalWeight;
//   // Iterate through items and subtract each weight until randomValue falls in this bucket
//   for (let i = 0; i < items.length; i++) {
//     randomValue -= weights[i];
//     if (randomValue <= 0) {
//       return items[i];
//     }
//   }
//   // Fallback in case of rounding error
//   return items[items.length - 1];
// }

// export const selectTwoRandomItems = (list: { count: number; tmdbId: string, elo: number }[]) => {
//   const newFirstItem = weightedRandomSelect(list);
//   const newSecondItem = weightedRandomSelect(
//     list.filter((item) => item.tmdbId !== newFirstItem.tmdbId),
//   );

//   return [newFirstItem, newSecondItem];
// };

type Item = { tmdbId: string; count: number; elo: number };

/* ------------------------------------------------------------------ */
/*  Generic weighted random picker                                    */
/* ------------------------------------------------------------------ */
function weightedRandomSelect<T>(
  items: T[],
  getWeight: (item: T) => number,
): T {
  const weights = items.map(getWeight);
  const totalWeight = weights.reduce((s, w) => s + w, 0);

  let r = Math.random() * totalWeight;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) {
      return items[i];
    }
  }
  return items[items.length - 1]; // ← never reached in practice
}

/* ------------------------------------------------------------------ */
/*  Helpers for the concrete problem                                  */
/* ------------------------------------------------------------------ */
const countWeight =
  (alpha = 1.2) =>
  (it: Item) =>
    1 / (it.count + 1) ** alpha; // what you already had

// “sigma” controls how quickly probability falls off with ELO distance
const eloDistanceWeight =
  (reference: Item, sigma = 1) =>
  (it: Item) => {
    const diff = Math.abs(it.elo - reference.elo);
    /* Example 1: inverse-linear fall-off
       return 1 / (diff + 1);                          */

    /* Example 2 (nicer): Gaussian fall-off           */
    return Math.exp(-(diff * diff) / (2 * sigma * sigma));
  };

/* ------------------------------------------------------------------ */
/*  Putting it together                                               */
/* ------------------------------------------------------------------ */
export function selectTwoRandomItems(
  list: Item[],
  alpha = 1.2, // strength of the “count” penalty
  sigma = 1000, // how tight you want the ELO pairing
): [Item, Item] {
  // -------------------- first pick (old logic) ---------------------
  const first = weightedRandomSelect(list, countWeight(alpha));

  // -------------------- second pick (combined logic) ---------------
  const second = weightedRandomSelect(
    list.filter((it) => it.tmdbId !== first.tmdbId),
    (it) => countWeight(alpha)(it) * eloDistanceWeight(first, sigma)(it),
  );

  return [first, second];
}
