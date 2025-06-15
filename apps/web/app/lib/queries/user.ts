import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import toast from "react-hot-toast";
import {
  exchangeGoogleCodeFn,
  signupFn,
  signupWithGoogleFn,
} from "../functions/auth/signup";
import { fetchUser, setUserProfileFn } from "../functions/user";

export const useSignupMutation = () => {
  const signupServerFn = useServerFn(signupFn);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: {
      name: string;
      email: string;
      password: string;
    }) => {
      await signupServerFn({
        data: {
          firstName: values.name,
          email: values.email,
          password: values.password,
          redirectUrl: "/profile-setup",
        },
      });
    },
    onSettled: () => {
      return queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onSuccess: () => {
      navigate({ to: "/profile-setup", search: { step: 1 } });
    },
  });
};

export const useSignupWithGoogleMutation = () => {
  const signupServerFn = useServerFn(signupWithGoogleFn);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await signupServerFn();
    },
    onSettled: () => {
      return queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onSuccess: () => {
      navigate({ to: "/profile-setup", search: { step: 1 } });
    },
  });
};

export const useExchangeGoogleCodeMutation = () => {
  const signupServerFn = useServerFn(exchangeGoogleCodeFn);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: { code: string }) => {
      await signupServerFn({
        data: {
          code: values.code,
        },
      });
    },
    onSettled: () => {
      return queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onSuccess: () => {
      navigate({ to: "/profile-setup", search: { step: 1 } });
    },
  });
};

export const fetchUserQueryOptions = () =>
  queryOptions({
    queryKey: ["user"],
    queryFn: () => {
      return fetchUser();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

export const useEditUserProfileMutation = (quiet?: boolean) => {
  const editUserProfile = useServerFn(setUserProfileFn);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editUserProfile,

    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onSuccess: () => {
      if (!quiet) {
        toast.success("Profile updated successfully");
      }
    },
  });
};
