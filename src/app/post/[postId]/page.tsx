import Link from "next/link";
import { AnswerList } from "~/components/shared/AnswerList";
import { CreateAnswerCard } from "~/components/shared/CreateAnswerCard";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { api } from "~/trpc/server";

export default async function PostDetail({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;

  const postDetail = await api.post.getPostById({ postId });

  return (
    <div className="space-y-8">
      {/* post detail card */}
      <div className="space-y-6 rounded-xl border p-6 shadow">
        {/* header */}
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="size-14">
              <AvatarImage src={postDetail?.author.image ?? ""} />
              <AvatarFallback>
                {postDetail?.author.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-0.5">
              <Link href={"/profile/" + postDetail?.author.username}>
                <p className="font-medium">{postDetail?.author.username}</p>
              </Link>
              <p className="text-muted-foreground text-sm">
                {postDetail?.createdAt.toLocaleDateString()}
              </p>
            </div>
          </div>

          <Badge variant="secondary" className="h-fit">
            Unanswered
          </Badge>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">{postDetail?.title}</h1>
          <p>{postDetail?.description}</p>
        </div>
      </div>

      {/* answer form */}
      <CreateAnswerCard postId={postId} />
      <AnswerList postId={postId} />
    </div>
  );
}
