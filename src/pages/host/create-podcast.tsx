import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";
import { useMe } from "../../hooks/useMe";
import {
  createPodcastMutation,
  createPodcastMutationVariables,
} from "../../mytypes";

const CREATE_PODCAST_MUTATION = gql`
  mutation createPodcastMutation($input: CreatePodcastInput!) {
    createPodcast(input: $input) {
      ok
      error
      id
    }
  }
`;

interface IForm {
  category: string;
  coverImg: FileList;
  title: string;
}

export const CreatePodcast = () => {
  const { refetch, data: userData } = useMe();
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IForm>({
    mode: "onChange",
  });

  const onCompleted = async (data: createPodcastMutation) => {
    const {
      createPodcast: { ok, error, id },
    } = data;
    if (ok) {
      setUploading(false);
      await refetch();
      navigate(`/podcast/${id}`, { replace: true });
    }
  };
  const [createPodcastMutation, { data: createPodcastMutationResult }] =
    useMutation<createPodcastMutation, createPodcastMutationVariables>(
      CREATE_PODCAST_MUTATION,
      {
        onCompleted,
      }
    );
  const onSubmit = async () => {
    try {
      setUploading(true);
      const { category, title, coverImg } = getValues();

      const actualFile = coverImg[0];
      const formBody = new FormData();
      formBody.append("file", actualFile);
      const { url } = await (
        await fetch(
          process.env.NODE_ENV === "production"
            ? "https://hcast-backend.herokuapp.com/uploads/"
            : "http://localhost:4000/uploads/",
          {
            method: "POST",
            body: formBody,
          }
        )
      ).json();
      createPodcastMutation({
        variables: {
          input: {
            category,
            title,
            coverImg: url,
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
        <title>{`Create Podcast | Hcast`}</title>
      </Helmet>
      <div className="h-screen flex items-center justify-center bg-gray-800">
        {userData?.me.emailVerified ? (
          <div className="bg-black overflow-hidden w-full max-w-lg h-[460px] rounded-md relative before:absolute before:w-full before:max-w-lg before:h-[460px] before:bg-gradient-to-t before:from-transparent before:via-cyan-300 before:to-cyan-300 before:top-[-50%] before:left-[-50%] before:origin-bottom-right before:animate-line-animation after:absolute after:w-full after:max-w-lg after:h-[460px] after:bg-gradient-to-t after:from-transparent after:via-cyan-300 after:to-cyan-300 after:top-[-50%] after:left-[-50%] after:origin-bottom-right after:animate-line-animation after:animation-delay-10">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col px-10 py-8 absolute z-10 inset-1 bg-black rounded-md"
            >
              <h2 className="text-cyan-300 mb-10 text-3xl font-medium text-center tracking-widest">
                New Podcast
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
                  accept="image/*"
                  {...register("coverImg", {
                    required: "Cover Image is required.",
                  })}
                />
              </div>
              <Button
                canClick={isValid}
                loading={uploading}
                actionText="Create"
              />
              {createPodcastMutationResult?.createPodcast.error && (
                <div className="mt-2">
                  <FormError
                    errorMessage={
                      createPodcastMutationResult.createPodcast.error
                    }
                  />
                </div>
              )}
            </form>
          </div>
        ) : (
          <h1 className="text-3xl text-red-700 animate-pulse">
            Email verification is required for use!
          </h1>
        )}
      </div>
    </>
  );
};
