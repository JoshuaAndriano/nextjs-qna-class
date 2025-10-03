"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { api } from "~/trpc/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { signIn, useSession } from "next-auth/react";

// Validasi
const CreatePostFormSchema = z.object({
  title: z
    .string()
    .max(100, "Maksimal 100 karakter")
    .min(1, "Judul harus diisi"),
  description: z.string().max(1000, "Maksimal 500 karakter"),
});

// Ts
type CreatePostFormSchema = z.infer<typeof CreatePostFormSchema>;

export const CreatePostCard = () => {
  const { data: session } = useSession();

  const form = useForm<CreatePostFormSchema>({
    resolver: zodResolver(CreatePostFormSchema),
    defaultValues: { title: "", description: "" },
  });

  const apiUtils = api.useUtils();

  const createPostMutation = api.post.createPost.useMutation({
    onSuccess: async () => {
      alert("Post created successfully");

      form.reset();

      await apiUtils.post.getAllPosts.invalidate();
    },
  });

  const handleCreatePost = (values: CreatePostFormSchema) => {
    createPostMutation.mutate({
      title: values.title,
      description: values.description,
    });
  };

  const handleLogin = async () => {
    await signIn("google");
  };

  return (
    <Form {...form}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Ask a Question</CardTitle>
        </CardHeader>

        {!!session ? (
          <CardContent>
            <div className="flex gap-4">
              <Avatar className="size-14">
                <AvatarFallback>
                  {session.user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
                <AvatarImage src={session.user.image ?? ""} />
              </Avatar>
              <div className="w-full space-y-1.5">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Title of your Question"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your question in detail"
                          className="min-h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        ) : (
          <CardContent>
            <div className="space-y-4 text-center">
              <p className="text-xl">Please log in to ask a question.</p>
              <Button onClick={handleLogin} size="lg">
                Sign In
              </Button>
            </div>
          </CardContent>
        )}

        {!!session && (
          <CardFooter className="flex justify-end">
            <Button
              disabled={createPostMutation.isPending}
              onClick={form.handleSubmit(handleCreatePost)}
            >
              {createPostMutation.isPending ? "Posting..." : "Post Question"}
            </Button>
          </CardFooter>
        )}
      </Card>
    </Form>
  );
};
