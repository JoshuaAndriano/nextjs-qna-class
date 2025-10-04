"use client";

import { api } from "~/trpc/react";
import { PostCard } from "./PostCard";
import { Button } from "../ui/button";

export const HomePostList = () => {
  const paginatedPostsQuery = api.post.getPostsPaginated.useInfiniteQuery(
    {
      limit: 2,
    },
    {
      getNextPageParam: ({ nextCursor }) => {
        return nextCursor;
      },
    },
  );

  const handleFetchNextPage = async () => {
    await paginatedPostsQuery.fetchNextPage();
  };

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Recent Questions</h2>
      {/* List of Post */}
      <div className="flex flex-col justify-center gap-5">
        {paginatedPostsQuery.data?.pages
          .flatMap((page) => page.posts)
          .map((post) => {
            return (
              <PostCard
                id={post.id}
                createdDate={post.createdAt}
                description={post.description}
                title={post.title}
                isAnswered={Boolean(post.answeredAt)}
                totalComments={0}
                username={post.author.username ?? ""}
                userImage={post.author.image ?? ""}
                key={post.id}
              />
            );
          })}

        {paginatedPostsQuery.hasNextPage && (
          <Button
            disabled={paginatedPostsQuery.isFetching}
            className="self-center"
            onClick={handleFetchNextPage}
          >
            {paginatedPostsQuery.isFetching ? "Loading..." : "See More"}
          </Button>
        )}
      </div>
    </div>
  );
};
