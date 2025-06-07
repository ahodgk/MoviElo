"use client";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPasswordFn } from "~/lib/functions/auth/reset-password";

export const Route = createFileRoute("/_auth/reset-password")({
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const [email, setEmail] = useState("");

  return (
    <div>
      <Card className={"w-full lg:w-1/2 mx-auto mt-12"}>
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            We will send you an email with a reset password link
          </CardDescription>
        </CardHeader>

        <form onSubmit={() => resetPasswordFn({ data: { email } })}>
          <CardContent>
            <Label>
              Email address:
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={"email@example.com"}
              />
            </Label>
          </CardContent>
          <CardFooter>
            <Button type={"submit"}>Reset Password</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
