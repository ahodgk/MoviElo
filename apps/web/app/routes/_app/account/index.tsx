import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
// import {
//   AlertDialog,
//   type AlertDialogState,
// } from "@/components/custom/AlertDialog";
import { Button } from "~/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { resetPasswordFn } from "~/lib/functions/auth/reset-password";

export const Route = createFileRoute("/_app/account/")({
  component: ProfilePage,
});

export default function ProfilePage() {
  // const [alertState, setAlertState] = useState<AlertDialogState>({
  //   isOpen: false,
  // });
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  const deleteAccountClicked = () => setIsAlertDialogOpen(true);

  // const { form } = useEditProfileForm();

  const { user } = Route.useRouteContext();

  const resetPassword = useServerFn(resetPasswordFn);
  const onResetPassword = async () => {
    await resetPassword({ data: { email: user?.email ?? "" } });
  };


  return (
    <div className="flex flex-col items-center min-h-screen w-full">
      <AlertDialog
        open={isAlertDialogOpen}
        onOpenChange={setIsAlertDialogOpen}
        // onSubmit={handleDeleteAccount}
        // alertState={alertState}
        // title="Are you sure you want to delete your account?"
        // description="Once you confirm, all personal data we hold about you will be permanently deleted. Please note this action is irreversible, and we won’t be able to restore your data once it’s removed."
        // setAlertState={setAlertState}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button asChild variant={"destructive"}>
              <AlertDialogAction>Delete my account</AlertDialogAction>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* <AlertDialo */}

    </div>
  );
}
