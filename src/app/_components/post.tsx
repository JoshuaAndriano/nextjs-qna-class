"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { api } from "~/trpc/react";

export function LatestPost() {
  const utils = api.useUtils();
  const [posts] = api.post.getAllPosts.useSuspenseQuery();
  const latestPost = posts.at(0) ?? null;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const createPost = api.post.createPost.useMutation({
    onSuccess: async () => {
      await utils.post.getAllPosts.invalidate();
      setTitle("");
      setDescription("");
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !description.trim()) {
      return;
    }

    createPost.mutate({
      title: title.trim(),
      description: description.trim(),
    });
  };

  return (
    <div className="w-full max-w-xs space-y-3">
      {latestPost ? (
        <p className="truncate">Your most recent post: {latestPost.title}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="w-full rounded-full bg-white/10 px-4 py-2 text-white"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="h-24 w-full rounded-2xl bg-white/10 px-4 py-2 text-white"
        />
        <button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={createPost.isPending}
        >
          {createPost.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
