import { createFileRoute, Link } from "@tanstack/react-router";
import { LoginForm } from "~/components/auth/login";

export const Route = createFileRoute("/_auth/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className={"py-16 md:py-24"}>
      <div className="flex flex-col items-center justify-center">
        <LoginForm />

        <Link
          to={"/register"}
          className={
            "mx-auto hover:!underline mt-4 block text-sm w-full text-center"
          }
        >
          Don't have an account? Sign up
        </Link>
      </div>
    </div>
  );
}
