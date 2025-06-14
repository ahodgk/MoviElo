"use client";

import type { userProfile } from "@repo/database";
import { createFileRoute } from "@tanstack/react-router";
import { P } from "pino";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

type UserProfile = typeof userProfile.$inferSelect;

export const Route = createFileRoute("/_app/profile-setup/")({
  component: ProfileSetupPage,
  validateSearch: (search: Record<string, unknown>) => {
    let step = (search.step as number | undefined) || 1;
    if (step > 3) {
      step = 3;
    }
    if (step < 1) {
      step = 1;
    }
    return {
      step,
    };
  },
});

export default function ProfileSetupPage() {
  const { step } = Route.useSearch();
  return (
    <div className="p-4 flex flex-col items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Profile Setup</CardTitle>
          <CardDescription className="max-w-md">
            Tell us a bit about yourself to get started! This will help us
            tailor your experience and provide you with relevant content.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <ProfileSetupSteps step={step} />
        </CardContent>
      </Card>
    </div>
  );
}

import { defineStepper } from "~/components/ui/stepper";
import { z } from "zod";

const { Stepper } = defineStepper(
  { id: "step-1", title: "Step 1" },
  { id: "step-2", title: "Step 2" },
  { id: "step-3", title: "Step 3" },
);

const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string(),
  age: z.number().min(18, "You must be at least 18 years old"),
  skin_type: z.enum(["oily", "dry", "combination", "normal"]),
})

const ProfileSetupSteps = ({ step }: { step: number }) => {
  return (
    <div>
      <Stepper.Provider>
        {({ methods }) => (
          <>
            <Stepper.Navigation>
              {methods.all.map((step) => (
                <Stepper.Step
                  key={step.id}
                  of={step.id}
                  onClick={() => methods.goTo(step.id)}
                >
                  <Stepper.Title
                    onClick={() => methods.goTo(step.id)}
                    className="cursor-pointer"
                  >
                    {step.title}
                  </Stepper.Title>
                </Stepper.Step>
              ))}
            </Stepper.Navigation>
            {methods.switch({
              "step-1": (step) => <Step1 />,
              "step-2": (step) => <div>{step.title}</div>,
              "step-3": (step) => <div>{step.title}</div>,
            })}
          </>
        )}
      </Stepper.Provider>
    </div>
  );
};

const Step1 = () => {
  return (
    <div>
      <h2>Step 1: Basic Information</h2>
      <p>Enter your basic information here.</p>
      {/* Add form fields for basic information */}
    </div>
  );
};
