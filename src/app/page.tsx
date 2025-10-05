import type { Metadata } from "next";
import { CreatePostCard } from "~/components/shared/CreatePostCard";
import { HomePostList } from "~/components/shared/HomePostList";
import { auth } from "~/server/auth";

export const metadata: Metadata = {
  title: "QnA Forum - Home",
  description: "Ask Questions, Share Knowledge, and Help the Community Grow.",
};

export default async function Home() {
  const session = await auth();
  const isAuthenticated = Boolean(session);

  return (
    <main className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-4xl font-bold">QnA Forum</h1>
        <p className="text-muted-foreground">
          Ask Questions, Share Knowledge, and Help the Community Grow.
        </p>
      </div>

      <CreatePostCard />

      {isAuthenticated && <HomePostList />}
    </main>
  );
}
