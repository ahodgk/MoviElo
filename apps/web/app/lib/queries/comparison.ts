import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import toast from "react-hot-toast";
import { compareMovieFn } from "../functions/comparison";
import { logger } from "../logger";

export const useCompareMoviesMutation = () => {
  const queryClient = useQueryClient();
  const compareMovie = useServerFn(compareMovieFn);
  return useMutation({
    mutationFn: compareMovie,
    onMutate: (data) => data.data,
    onError: (err) => {
      toast.error("Something went wrong, those results may not be recorded.");
      logger.error(err, "Error comparing movies");
    },
    onSettled: (_result, _error, _variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["list", context?.movieListId],
      });
    },
  });
};
