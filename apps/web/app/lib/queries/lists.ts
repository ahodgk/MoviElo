import type { movieList } from "@repo/database";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import toast from "react-hot-toast";
import {
  getComparisonHistoryFn,
  getListDetails,
  getListItemsFn,
  getLists,
} from "~/lib/functions/lists/get";
import { addListItemFn, editListFn, resetEloFn } from "../functions/lists/edit";
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

type TGetListDetails = any; //Awaited<ReturnType<Required<ReturnType<typeof getListDetailsQueryOptions>>['queryFn']>>;

type MovieList = typeof movieList.$inferSelect;
export const useCreateListMutation = () => {
  const queryClient = useQueryClient();
  const createList = useServerFn(createListFn);
  return useMutation({
    mutationFn: createList,
    onMutate: async () => {
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
      const previousList = queryClient.getQueryData<TGetListDetails>([
        "list",
        data.listId,
      ]);

      queryClient.setQueryData(
        ["list", data.listId],
        (oldList: TGetListDetails) => {
          return {
            ...oldList,
            items: [...(oldList.items || []), data],
          };
        },
      );

      return { previousList };
    },
    onSuccess: () => {
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
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["list", variables.data.listId],
      });
    },
  });
};

export const useResetListMutation = () => {
  const queryClient = useQueryClient();
  const resetElo = useServerFn(resetEloFn);

  return useMutation({
    mutationFn: resetElo,
    onMutate: async ({ data }) => {
      toast.loading("Resetting list elo...", { id: "reset-list-elo" });
      await queryClient.cancelQueries({ queryKey: ["list", data.listId] });
    },
    onSuccess: () => {
      toast.success("List elo reset successfully!", {
        id: "reset-list-elo",
      });
    },
    onError: (error) => {
      toast.error(`Failed to reset list elo: ${error.message}`, {
        id: "reset-list-elo",
      });
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["list", variables.data.listId],
      });
    },
  });
};

export const getListComparisonHistoryQueryOptions = (listId: string) =>
  queryOptions({
    queryKey: ["list", listId, "history"],
    queryFn: () => getComparisonHistoryFn({ data: { listId } }),
  });

export const useEditListMutation = () => {
  const queryClient = useQueryClient();
  const editList = useServerFn(editListFn);

  return useMutation({
    mutationFn: editList,
    onMutate: async ({ data }) => {
      toast.loading("Editing list...", { id: "edit-list" });
      await queryClient.cancelQueries({ queryKey: ["list", data.listId] });
      const previousList = queryClient.getQueryData<TGetListDetails>([
        "list",
        data.listId,
      ]);

      queryClient.setQueryData(
        ["list", data.listId],
        (oldList: TGetListDetails) => {
          return {
            ...oldList,
            name: data.name,
            initialK: data.initialK,
            tuningFactor: data.tuningFactor,
          };
        },
      );

      return { previousList };
    },
    onSuccess: () => {
      toast.success("List saved successfully!", {
        id: "edit-list",
      });
    },
    onError: (error, variables, context) => {
      toast.error(`Failed to edit list: ${error.message}`, {
        id: "edit-list",
      });
      if (context?.previousList) {
        queryClient.setQueryData(
          ["list", variables.data.listId],
          context.previousList,
        );
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["list", variables.data.listId],
      });
    },
  });
};
