import { createFileRoute, Link } from "@tanstack/react-router";
import { SignupForm } from "~/components/auth/signup";

export const Route = createFileRoute("/_auth/register")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className={"py-16 md:py-24"}>
      <div className="flex flex-col items-center justify-center">
        <SignupForm />

        <Link
          to={"/login"}
          className={
            "mx-auto hover:!underline mt-4 block text-sm w-full text-center"
          }
        >
          Already have an account? Log in
        </Link>
      </div>
    </div>
  );
}
