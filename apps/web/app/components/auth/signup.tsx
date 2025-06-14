// import { useAuthContext } from "@/components/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { AiOutlineGoogle } from "react-icons/ai";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  useSignupMutation,
  useSignupWithGoogleMutation,
} from "~/lib/queries/user";
import { Separator } from "../ui/separator";

const signupFormSchema = z
  .object({
    name: z.string().min(1, "Please enter your name"),
    email: z.string().email(),
    password: z
      .string()
      .min(7)
      .refine(
        (val) =>
          (val.match(/[a-z]/)?.length ?? 0) > 0 &&
          (val.match(/[A-Z]/)?.length ?? 0) > 0 &&
          (val.match(/[0-9]/)?.length ?? 0) > 0 &&
          (val.match(/[^a-zA-Z0-9]/)?.length ?? 0) > 0,
        "Password must contain at least one lowercase letter, one uppercase letter, one number and one special character",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    confirmAge: z.boolean().refine((val) => val, "You must be over 18"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const SignupForm = () => {
  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      password: "",
      confirmPassword: "",
      confirmAge: false,
      email: "",
    },
  });

  const signupMutation = useSignupMutation();
  const signupWithGoogleMutation = useSignupWithGoogleMutation();

  async function onSubmit(values: z.infer<typeof signupFormSchema>) {
    signupMutation.mutate(values, {
      onError: (e) => {
        form.setError("root", {
          type: "manual",
          message: e.message,
        });
      },
    });
  }

  return (
    <Card className="grow w-full lg:max-w-md xl:max-w-lg">
      <CardHeader>
        <CardTitle className="text-2xl ">Sign up</CardTitle>
        <CardDescription>Create your account here.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/*username*/}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Joe Bloggs" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="j.bloggs@example.com" {...field} />
                  </FormControl>
                  <FormDescription>Your email address.</FormDescription>
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
                  <FormDescription>
                    Must be 7+ characters and include a lowercase, uppercase and
                    special character
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type={"password"}
                      placeholder="P4$$w0rd"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmAge"
              render={({ field }) => (
                <FormItem>
                  <div className={"flex flex-row items-start gap-2"}>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className={"mt-[1px]"}>
                      I confirm that I am over 18
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.root && (
              <FormMessage>{form.formState.errors.root.message}</FormMessage>
            )}
            <Button
              disabled={signupMutation.isPending}
              type="submit"
              className="w-full"
            >
              Sign up
            </Button>
          </form>
        </Form>

        <Separator className="my-4" />

        <Button
          disabled={signupMutation.isPending}
          type="button"
          className="w-full"
          variant={"outline"}
          onClick={() => {
            signupWithGoogleMutation.mutate();
          }}
        >
          <AiOutlineGoogle />
          Sign up with Google
        </Button>
      </CardContent>
    </Card>
  );
};
