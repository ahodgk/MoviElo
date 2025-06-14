// import { useAuthContext } from "@/components/context/AuthContext";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useForm } from "react-hook-form";
import { AiOutlineGoogle } from "react-icons/ai";
import { z } from "zod";
// import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { loginFn } from "~/lib/functions/auth/login";
import { useSignupWithGoogleMutation } from "~/lib/queries/user";
import { Separator } from "../ui/separator";

const loginFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Please enter your password"),
});

export const LoginForm = () => {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginWithGoogleMutation = useSignupWithGoogleMutation();

  const loginServerFn = useServerFn(loginFn);
  const queryClient = useQueryClient();
  const loginMutation = useMutation({
    mutationFn: loginServerFn,
    onError: (e) => {
      form.setError("root", {
        type: "manual",
        message: e.message,
      });
    },
    onSettled: () => {
      return queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    loginMutation.mutate({ data: values });
    // router.push("/dashboard");
  }

  return (
    <Card className="grow w-full lg:max-w-md xl:max-w-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Log in</CardTitle>
        <CardDescription>Log yourself back in</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input placeholder="j.bloggs@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type={"password"}
                      placeholder="P4$$w0rd"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <Button
                    asChild
                    variant={"link"}
                    className={"ml-auto px-0 pt-0 hover:!underline"}
                  >
                    <Link to={"/reset-password"}>Reset password</Link>
                  </Button>
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <FormMessage>{form.formState.errors.root.message}</FormMessage>
            )}
            <Button
              disabled={loginMutation.isPending}
              type="submit"
              className="w-full"
            >
              Log in
            </Button>
          </form>
        </Form>

        <Separator className="my-4" />

        <Button
          disabled={loginMutation.isPending}
          type="button"
          className="w-full"
          variant={"outline"}
          onClick={() => {
            loginWithGoogleMutation.mutate();
          }}
        >
          <AiOutlineGoogle />
          Log in with Google
        </Button>
      </CardContent>
    </Card>
  );
};
