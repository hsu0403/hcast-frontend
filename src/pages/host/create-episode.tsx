import { gql, useApolloClient, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";
import { useMe } from "../../hooks/useMe";
import {
  createEpisodeMutation,
  createEpisodeMutationVariables,
} from "../../mytypes";
import { GET_PODCAST_QUERY } from "../detail-podcast";

const CREATE_EPISODE_MUTATION = gql`
  mutation createEpisodeMutation($input: CreateEpisodeInput!) {
    createEpisode(input: $input) {
      ok
      error
      id
    }
  }
`;

interface IFormProps {
  category: string;
  episode: FileList;
  title: string;
  podcast: string;
}

export const CreateEpisode = () => {
  const client = useApolloClient();
  const [episodeUrl, setEpisodeUrl] = useState("");
  const { data: userData } = useMe();
  const [uploading, setUploading] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm<IFormProps>({ mode: "onChange" });

  const onCompleted = (data: createEpisodeMutation) => {
    const {
      createEpisode: { ok, error, id },
    } = data;
    if (ok) {
      const { category, podcast, title } = getValues();
      setUploading(false);
      window.alert("An episode has been created.");
      const resultQuery = client.readQuery({
        query: GET_PODCAST_QUERY,
        variables: { input: { id: +podcast } },
      });
      client.writeQuery({
        query: GET_PODCAST_QUERY,
        variables: { input: { id: +podcast } },
        data: {
          getPodcast: {
            ...resultQuery.getPodcast,
            episodesCategory: [
              ...resultQuery.getPodcast.episodesCategory,
              category.trim().toUpperCase(),
            ],
            podcast: {
              ...resultQuery.getPodcast.podcast,
              episodes: [
                {
                  __typename: "Episode",
                  id,
                  title,
                  category: category.trim().toUpperCase(),
                  episodeUrl,
                },
                ...resultQuery.getPodcast.podcast.episodes,
              ],
            },
          },
        },
      });
    }
  };

  const [createEpisodeMutation, { data: createEpisodeMutationResult }] =
    useMutation<createEpisodeMutation, createEpisodeMutationVariables>(
      CREATE_EPISODE_MUTATION,
      {
        onCompleted,
      }
    );

  const onSubmit = async () => {
    try {
      setUploading(true);
      const { category, episode, title, podcast } = getValues();
      const actualFile = episode[0];
      const formBody = new FormData();
      formBody.append("file", actualFile);
      const { url } = await (
        await fetch("http://localhost:4000/uploads/", {
          method: "POST",
          body: formBody,
        })
      ).json();

      setEpisodeUrl(url);
      createEpisodeMutation({
        variables: {
          input: {
            category,
            episodeUrl: url,
            podcastId: +podcast,
            title,
          },
        },
      });
      setUploading(false);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      <Helmet>
        <title>{`Create Episode | Hcast`}</title>
      </Helmet>
      <div className="h-screen flex items-center justify-center bg-gray-800">
        <div className="bg-black overflow-hidden w-full max-w-lg h-[520px] rounded-md relative before:absolute before:w-full before:max-w-lg before:h-[520px] before:bg-gradient-to-t before:from-transparent before:via-cyan-300 before:to-cyan-300 before:top-[-50%] before:left-[-50%] before:origin-bottom-right before:animate-line-animation after:absolute after:w-full after:max-w-lg after:h-[520px] after:bg-gradient-to-t after:from-transparent after:via-cyan-300 after:to-cyan-300 after:top-[-50%] after:left-[-50%] after:origin-bottom-right after:animate-line-animation after:animation-delay-10">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col px-10 py-8 absolute z-10 inset-1 bg-black rounded-md"
          >
            <h2 className="text-cyan-300 mb-10 text-3xl font-medium text-center tracking-widest">
              New Episode
            </h2>
            <div className="relative mb-14">
              <input
                autoComplete="off"
                required
                {...register("title", {
                  required: "Title is required.",
                  minLength: 4,
                })}
                type="text"
                name="title"
                className="relative w-full py-3 px-5 rounded-md shadow-sm bg-transparent border-none outline-none peer text-gray-300 z-10"
              />
              <span className="absolute tracking-wider text-gray-300 text-lg left-0 py-3 px-5 pointer-events-none transition-all peer-focus:text-cyan-300 peer-valid:text-cyan-300 peer-focus:-translate-y-9 peer-valid:-translate-y-9 peer-focus:-translate-x-4 peer-valid:-translate-x-4 peer-focus:text-sm peer-valid:text-sm">
                Title
              </span>
              <i className="absolute left-0 bottom-0 w-full h-[2px] bg-cyan-400 rounded-md transition-all pointer-events-none z-[9] peer-focus:h-[48px]"></i>
            </div>
            {errors.title?.message && (
              <div className="-mt-12 mb-6">
                <FormError errorMessage={errors.title.message} />
              </div>
            )}
            {errors.title?.type === "minLength" && (
              <div className="-mt-12 mb-6">
                <FormError errorMessage="The Title must be at least 4 digits." />
              </div>
            )}
            <div className="relative mb-8">
              <input
                required
                {...register("category", {
                  required: "Category is required.",
                  minLength: 4,
                })}
                type="text"
                name="category"
                className="relative w-full py-3 px-5 rounded-md shadow-sm bg-transparent border-none outline-none peer text-gray-300 z-10"
              />
              <span className="absolute tracking-wider text-gray-300 text-lg left-0 py-3 px-5 pointer-events-none transition-all peer-focus:text-cyan-300 peer-valid:text-cyan-300 peer-focus:-translate-y-9 peer-valid:-translate-y-9 peer-focus:-translate-x-4 peer-valid:-translate-x-4 peer-focus:text-sm peer-valid:text-sm">
                Category
              </span>
              <i className="absolute left-0 bottom-0 w-full h-[2px] bg-cyan-400 rounded-md transition-all pointer-events-none z-[9] peer-focus:h-[48px]"></i>
            </div>
            {errors.category?.message && (
              <div className="-mt-6">
                <FormError errorMessage={errors.category.message} />
              </div>
            )}
            {errors.category?.type === "minLength" && (
              <div className="-mt-6">
                <FormError errorMessage="The category must be at least 4 digits." />
              </div>
            )}
            <div className="relative mt-2 mb-6">
              <input
                className="text-gray-400"
                type="file"
                accept="audio/*"
                {...register("episode", {
                  required: "Episode is required.",
                })}
              />
            </div>
            <div className="relative mt-2 group mb-4">
              <span className="text-gray-300 group-hover:text-cyan-300 text-2xl select-none transition-colors">
                Podcast:{" "}
              </span>
              <select
                {...register("podcast", { required: "podcast is required." })}
                className="text-gray-300 bg-transparent tracking-wider rounded-md px-8 py-1 focus:outline-none shadow-sm"
              >
                {userData?.me.podcasts.map((podcast) => (
                  <option
                    key={podcast.id}
                    className="bg-cyan-500"
                    value={podcast.id}
                  >
                    {podcast.title}
                  </option>
                ))}
              </select>
            </div>
            <Button
              canClick={isValid}
              loading={uploading}
              actionText="Create"
            />
            {createEpisodeMutationResult?.createEpisode.error && (
              <div className="mt-2">
                <FormError
                  errorMessage={createEpisodeMutationResult.createEpisode.error}
                />
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};
