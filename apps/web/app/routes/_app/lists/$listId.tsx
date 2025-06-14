import { TooltipTrigger } from "@radix-ui/react-tooltip";
import type { movieList, movieListItem } from "@repo/database";
import { useThrottledValue } from "@tanstack/react-pacer";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Hash, ListPlus, PenBox, Search } from "lucide-react";
import { Suspense, useCallback, useState } from "react";
import short from "short-uuid";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Slider } from "~/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Tooltip, TooltipContent } from "~/components/ui/tooltip";
import { useCompareMoviesMutation } from "~/lib/queries/comparison";
import {
  getListDetailsQueryOptions,
  getListItemsQueryOptions,
  useAddItemToListMutation,
  useResetListMutation,
} from "~/lib/queries/lists";
import {
  getMovieDetailsQueryOptions,
  listMoviesQueryOptions,
} from "~/lib/queries/tmdb/list-movies";
import { selectTwoRandomItems } from "./-weighted_choice";

type MovieListItem = typeof movieListItem.$inferSelect;
export const Route = createFileRoute("/_app/lists/$listId")({
  beforeLoad: async ({ context, params }) => {
    context.queryClient.prefetchQuery(getListItemsQueryOptions(params.listId));
    await context.queryClient.ensureQueryData(
      getListDetailsQueryOptions(params.listId),
    );
  },
  component: RouteComponent,
  params: {
    parse: (d) => {
      return {
        listId: short().validate(d.listId)
          ? short().toUUID(d.listId)
          : d.listId,
      };
    },
  },
});

function RouteComponent() {
  const { listId } = Route.useParams();
  const {
    data: { list: listDetails },
  } = useSuspenseQuery(getListDetailsQueryOptions(listId));

  const resetEloMutation = useResetListMutation();
  return (
    <div className="p-6 flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{listDetails?.name}</CardTitle>
            <Button className="" variant={"ghost"}>
              <PenBox className="size-6 text-muted-foreground" />
            </Button>
          </div>
          <CardDescription>
            Last updated at:{" "}
            {listDetails?.updatedAt?.toTimeString().split(" ")[0] +
              " " +
              listDetails?.updatedAt?.toDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Slider />

          <div className="flex flex-row gap-4 items-center justify-end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant={"destructive"}>Reset</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will reset the current
                    weightings and elo have.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      resetEloMutation.mutate({ data: { listId } });
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-6 grow-[2]">
        <Tabs defaultValue="items" className="w-full">
          <TabsList className="">
            <TabsTrigger value="items">Add movies</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <div className="flex flex-row gap-6">
            <div className="grow-[2] max-w-2/3">
              <TabsContent value="items" className="w-full">
                <AddMovieSection listId={listId} />
              </TabsContent>
              <TabsContent value="comparison" className="w-full">
                <Suspense fallback={<div>Loading comparison...</div>}>
                  <ComparisonSection listId={listId} />
                </Suspense>
              </TabsContent>
            </div>
            <div className="grow-[1] mt-2">
              <ListRankingsCard list={listDetails?.items} />
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
type MovieList = typeof movieList.$inferSelect;
type MovieListWithItems = MovieList & {
  items: MovieListItem[];
};

const ComparisonSection = ({ listId }: { listId: string }) => {
  const { data: listItems } = useSuspenseQuery(
    getListItemsQueryOptions(listId),
  );

  const [currentComparison, setCurrentComparison] = useState<{
    firstItemId: string;
    secondItemId: string;
  }>(() => {
    const [firstItem, secondItem] = selectTwoRandomItems(listItems);
    return {
      firstItemId: firstItem?.tmdbId,
      secondItemId: secondItem?.tmdbId,
    };
  });

  const compareMoviesMutation = useCompareMoviesMutation();

  const changeComparison = useCallback(() => {
    // remove the current items from the list
    const filteredList = listItems.filter(
      (item) =>
        item.tmdbId !== currentComparison.firstItemId &&
        item.tmdbId !== currentComparison.secondItemId,
    );

    // select two new items randomly, but weighted by the count, lower being more likely
    const [newFirstItem, newSecondItem] = selectTwoRandomItems(filteredList);

    setCurrentComparison({
      firstItemId: newFirstItem.tmdbId,
      secondItemId: newSecondItem.tmdbId,
    });
  }, [
    currentComparison.firstItemId,
    currentComparison.secondItemId,
    listItems,
  ]);

  if (!listItems || listItems.length < 4) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Comparison</CardTitle>
          <CardDescription>
            Not enough movies in the list to compare. Add more movies to
            compare.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Display empty state or message */}
          <p>No movies available for comparison. You need at least 4</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparison</CardTitle>
        <CardDescription>
          Compare movies in your list to see how they rank against each other.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-4 items-center">
          <div className="flex flex-row items-center gap-4">
            <MovieHeadToHeadCard
              tmdbId={currentComparison.firstItemId}
              onClick={() => {
                changeComparison();
                compareMoviesMutation.mutate({
                  data: {
                    movieListId: listId,
                    winningMovieListItemId: currentComparison.firstItemId,
                    losingMovieListItemId: currentComparison.secondItemId,
                  },
                });
              }}
            />
            <span className="text-4xl font-semibold italic">vs</span>
            <MovieHeadToHeadCard
              tmdbId={currentComparison.secondItemId}
              onClick={() => {
                changeComparison();
                compareMoviesMutation.mutate({
                  data: {
                    movieListId: listId,
                    winningMovieListItemId: currentComparison.secondItemId,
                    losingMovieListItemId: currentComparison.firstItemId,
                  },
                });
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MovieHeadToHeadCard = ({
  tmdbId,
  onClick,
}: {
  tmdbId: string;
  onClick: () => void;
}) => {
  console.log("tmdbId", tmdbId);

  const { data } = useQuery(getMovieDetailsQueryOptions(tmdbId));
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      asChild
      className="hover:scale-115 transition-all ease-in-out hover:-translate-y-2 hover:shadow-lg"
    >
      <img
        className="h-64"
        alt={`Poster for ${data?.title}`}
        src={`https://image.tmdb.org/t/p/w400${data?.poster_path}`}
      />
    </Button>
  );
};

const ListRankingsCard = ({ list }: { list?: MovieListItem[] }) => {
  if (!list || list.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>List Rankings</CardTitle>
          <CardDescription>
            No movies in this list yet. Add some movies to see rankings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Display empty state or message */}
          <p>No movies added to this list.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>List Rankings</CardTitle>
        <CardDescription>
          Here you can see the current rankings of movies in your list.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {list
          .sort((a, b) => b.currentElo - a.currentElo)
          .map((item, i) => (
            <MovieListRankCard key={item.tmdbId} item={item} index={i} />
          ))}
      </CardContent>
    </Card>
  );
};

const MovieListRankCard = ({
  item,
  index,
}: {
  item: MovieListItem;
  index: number;
}) => {
  const { data } = useQuery(getMovieDetailsQueryOptions(item.tmdbId));

  return (
    <Card>
      <div className="flex flex-row items-center gap-2 pr-4">
        <figure className="h-20 w-auto">
          <img
            className="h-full w-auto"
            alt={`Movie poster for ${data?.original_title}`}
            src={`https://image.tmdb.org/t/p/w200${data?.poster_path}`}
          />
        </figure>
        <span className="">
          <span className="flex flex-row items-center text-xl">
            <Hash className="size-5" />
            {index + 1}
          </span>
          {data?.title}
        </span>
        <div className="ml-auto">
          <span>Elo: {item.currentElo}</span>
        </div>
      </div>
    </Card>
  );
};

const AddMovieSection = ({ listId }: { listId: string }) => {
  const [searchString, setSearchString] = useState("");
  const [debouncedSearchString] = useThrottledValue(searchString, {
    wait: 500,
  });
  const { data } = useQuery(
    listMoviesQueryOptions({ query: debouncedSearchString }),
  );

  const addMovieToListMutation = useAddItemToListMutation();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add Movies</CardTitle>
        <CardDescription>Add movies to your list.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="">
          <Label className="relative">
            <Input
              type="search"
              placeholder="The Bee Movie"
              className="pl-8"
              onChange={(e) => setSearchString(e.target.value)}
              value={searchString}
            />
            <Search className="absolute left-2 top-2 size-5 text-muted-foreground" />
          </Label>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {data?.map((movie) => (
              <Card key={movie.id} className="mt-4 overflow-hidden">
                {/* <CardHeader>{movie.title}</CardHeader> */}
                <CardContent className="p-0 ">
                  <img
                    alt={`Poster for ${movie.title}`}
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  />
                </CardContent>
                <CardFooter className="p-4 flex row items-start">
                  <div className="flex flex-col">
                    <CardTitle className="mt-0 pt-0">{movie.title}</CardTitle>
                    <CardDescription className="clear-left mt-1">
                      ({movie.release_date?.split("-")[0]})
                    </CardDescription>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={"ghost"}
                        onClick={() => {
                          addMovieToListMutation.mutate({
                            data: {
                              tmdbid: String(movie.id),
                              listId: listId,
                            },
                          });
                        }}
                        className="ml-auto relative"
                      >
                        <ListPlus className="size-6" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add to list</TooltipContent>
                  </Tooltip>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
