import type { movieList } from "@repo/database";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Suspense } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  getListsQueryOptions,
  useCreateListMutation,
} from "~/lib/queries/lists";

export const Route = createFileRoute("/_app/lists/")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    context.queryClient.prefetchQuery(getListsQueryOptions());
  },
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const createListMutation = useCreateListMutation();

  const onCreateClick = () =>
    createListMutation.mutate(
      { data: {} },
      {
        onSuccess: ({ id }) => {
          navigate({ to: "$listId", params: { listId: id } });
        },
      },
    );

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="yourlists">
          <div className="flex justify-between items-center gap-6">
            <TabsList className="">
              <TabsTrigger value="yourlists">Your Lists</TabsTrigger>
              <TabsTrigger value="browse">Browse</TabsTrigger>
            </TabsList>
            <Button
              disabled={createListMutation.isPending}
              onClick={onCreateClick}
              className="ml-auto group max-w-10 hover:max-w-full hover:min-w-20 min-w-0 transition-all ease-in-out duration-1000"
            >
              <Plus />
              <span className="group-hover:inline hidden group-disabled:hidden">
                New List
              </span>
              <span className="group-disabled:inline hidden">Creating...</span>
            </Button>
            <Input type="search" className="max-w-md" />
          </div>
          <TabsContent value="yourlists">
            <Suspense fallback={<div>Loading...</div>}>
              <DisplayYourLists />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

const DisplayYourLists = () => {
  const { data } = useSuspenseQuery(getListsQueryOptions());

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Lists</h1>
      <ListsDisplay lists={data} />
    </div>
  );
};

type MovieList = typeof movieList.$inferSelect;
const ListsDisplay = ({ lists }: { lists: MovieList[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {lists.map((list) => (
        <Card key={list.id}>
          <CardHeader>
            <CardTitle>{list.name}</CardTitle>
          </CardHeader>
          <CardContent>{list.description}</CardContent>
        </Card>
      ))}
    </div>
  );
};
