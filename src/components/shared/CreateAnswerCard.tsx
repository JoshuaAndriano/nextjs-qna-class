"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { api } from "~/trpc/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { useSession } from "next-auth/react";

const answerFormSchema = z.object({
  body: z
    .string()
    .min(1, "Answer cannot be empty")
    .max(1000, "Maximum 1000 characters"),
});

type AnswerFormSchema = z.infer<typeof answerFormSchema>;

type CreateAnswerCardProps = {
  postId: string;
};

export const CreateAnswerCard = (props: CreateAnswerCardProps) => {
  const { data: session } = useSession();

  const form = useForm<AnswerFormSchema>({
    resolver: zodResolver(answerFormSchema),
    defaultValues: { body: "" },
  });

  const apiUtils = api.useUtils();

  const createAnswerMutation = api.answer.createAnswer.useMutation({
    onSuccess: async () => {
      alert("Answer submitted!");
      form.reset();

      await apiUtils.answer.getAnswersByPostId.invalidate({
        postId: props.postId,
      });
    },
  });

  const getAnswersQuery = api.answer.getAnswersByPostId.useQuery({
    postId: props.postId,
  });

  const handleSubmitAnswer = (values: AnswerFormSchema) => {
    createAnswerMutation.mutate({
      body: values.body,
      postId: props.postId,
    });
  };

  return (
    <div className="space-y-3">
      <h3 className="text-xl font-semibold">
        {getAnswersQuery.data?.length ?? 0} Answer
      </h3>
      <Form {...form}>
        <Card>
          <CardHeader>
            <CardTitle>Your Answer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Avatar className="size-12">
                <AvatarImage src={session?.user.image ?? ""} />
                <AvatarFallback>
                  {session?.user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Textarea
                        placeholder="Type your answer here..."
                        className="min-h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              disabled={createAnswerMutation.isPending}
              onClick={form.handleSubmit(handleSubmitAnswer)}
            >
              {createAnswerMutation.isPending
                ? "Submitting..."
                : "Submit Answer"}
            </Button>
          </CardFooter>
        </Card>
      </Form>
    </div>
  );
};
