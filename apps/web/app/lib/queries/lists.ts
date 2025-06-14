import type { movieList, movieListItem } from "@repo/database";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import toast from "react-hot-toast";
import {
  getListDetails,
  getListItemsFn,
  getLists,
} from "~/lib/functions/lists/get";
import { addListItemFn, resetEloFn } from "../functions/lists/edit";
import { createListFn } from "../functions/lists/new";

export const getListsQueryOptions = () =>
  queryOptions({
    queryKey: ["lists"],
    queryFn: getLists,
  });

export const getListDetailsQueryOptions = (listId: string) =>
  queryOptions({
    queryKey: ["list", listId],
    queryFn: async () => await getListDetails({ data: { listId } }),
  });

type MovieList = typeof movieList.$inferSelect;
export const useCreateListMutation = () => {
  const queryClient = useQueryClient();
  const createList = useServerFn(createListFn);
  return useMutation({
    mutationFn: createList,
    onMutate: async (newList) => {
      toast.loading("Creating list...", { id: "create-list" });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      queryClient.setQueryData(["lists"], (oldLists: MovieList[]) => {
        return [...(oldLists || []), data];
      });
      toast.success("List created successfully!", {
        id: "create-list",
      });
    },
    onError: (error) => {
      toast.error(`Failed to create list: ${error.message}`, {
        id: "create-list",
      });
    },
  });
};
type MovieListWithItems = MovieList & {
  items: (typeof movieListItem.$inferSelect)[];
};

export const getListItemsQueryOptions = (listId: string) =>
  queryOptions({
    queryKey: ["list", listId, "items"],
    queryFn: () => getListItemsFn({ data: { listId } }),
  });

export const useAddItemToListMutation = () => {
  const queryClient = useQueryClient();
  const addListItem = useServerFn(addListItemFn);
  return useMutation({
    mutationFn: addListItem,

    onMutate: async ({ data }) => {
      toast.loading("Adding item to list...", { id: "add-list-item" });
      await queryClient.cancelQueries({ queryKey: ["list", data.listId] });
      const previousList = queryClient.getQueryData<MovieList>([
        "list",
        data.listId,
      ]);

      queryClient.setQueryData(
        ["list", data.listId],
        (oldList: MovieListWithItems) => {
          return {
            ...oldList,
            items: [...(oldList.items || []), data],
          };
        },
      );

      return { previousList };
    },
    onSuccess: (data, variables, context) => {
      toast.success("Item added to list successfully!", {
        id: "add-list-item",
      });
    },
    onError: (error, variables, context) => {
      toast.error(`Failed to add item to list: ${error.message}`, {
        id: "add-list-item",
      });
      if (context?.previousList) {
        queryClient.setQueryData(
          ["list", variables.data.listId],
          context.previousList,
        );
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["list", variables.data.listId],
      });
    },
  });
};


export const useResetListMutation = ()=>{
  const queryClient = useQueryClient();
  const resetElo = useServerFn(resetEloFn);

  return useMutation({
    mutationFn: resetElo,
    onMutate: async ({ data }) => {
      toast.loading("Resetting list elo...", { id: "reset-list-elo" });
      await queryClient.cancelQueries({ queryKey: ["list", data.listId] });
    },
    onSuccess: (data, variables, context) => {
      toast.success("List elo reset successfully!", {
        id: "reset-list-elo",
      });
    },
    onError: (error, variables, context) => {
      toast.error(`Failed to reset list elo: ${error.message}`, {
        id: "reset-list-elo",
      });
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["list", variables.data.listId],
      });
    },
  });
}