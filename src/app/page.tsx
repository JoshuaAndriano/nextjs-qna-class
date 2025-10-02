import { CreatePostCard } from "~/components/shared/CreatePostCard";

export default async function Home() {
  return (
    <main className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-4xl font-bold">QnA Forum</h1>
        <p className="text-muted-foreground">
          Ask Questions, Share Knowledge, and Help the Community Grow.
        </p>
      </div>

      <CreatePostCard />
    </main>
  );
}
