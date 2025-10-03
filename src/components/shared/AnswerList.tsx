"use client";

import { api } from "~/trpc/react";
import { AnswerCard } from "./AnswerCard";

type AnswerListProps = {
  postId: string;
};

export const AnswerList = (props: AnswerListProps) => {
  const getAnswersQuery = api.answer.getAnswersByPostId.useQuery({
    postId: props.postId,
  });

  return (
    <div className="space-y-2">
      {getAnswersQuery.data?.map((answer) => {
        return (
          <AnswerCard
            id={answer.id}
            body={answer.body}
            createdDate={answer.createdAt}
            userImage={answer.author.image ?? ""}
            username={answer.author.username ?? ""}
            key={answer.id}
          />
        );
      })}
    </div>
  );
};
