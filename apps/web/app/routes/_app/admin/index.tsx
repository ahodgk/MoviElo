import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export const Route = createFileRoute("/_app/admin/")({
  component: AdminPage,
});

export default function AdminPage() {
  return (
    <div className={"sm:p-6"}>
      <h1 className={"text-xl font-bold"}>Admin Dashboard</h1>
      <h2>More to come soon.</h2>

      <div className={"flex flex-col lg:p-20 md:p-12 p-6"}>
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div>buttons</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
