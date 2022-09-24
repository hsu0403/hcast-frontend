import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import {
  faArrowCircleRight,
  faArrowCircleUp,
  faPlusCircle,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Episode } from "../components/episode";
import { Review } from "../components/review";
import { ME_QUERY, useMe } from "../hooks/useMe";
import {
  createReviewMutation,
  createReviewMutationVariables,
  deleteReviewMutation,
  deleteReviewMutationVariables,
  getChildReviewsQuery,
  getChildReviewsQueryVariables,
  getPodcastQuery,
  getPodcastQueryVariables,
  getReviewsQuery,
  getReviewsQueryVariables,
  toggleSubscribeMutation,
  toggleSubscribeMutationVariables,
  UserRole,
} from "../mytypes";
import { SUBSCRIPTIONS_QUERY } from "./listener/listener-podcasts";

// TODO: toggle subscribe mutation
const TOGGLE_SUBSCRIBE_MUTATION = gql`
  mutation toggleSubscribeMutation($input: ToggleSubscribeInput!) {
    toggleSubscribe(input: $input) {
      ok
      error
    }
  }
`;

const DELETE_REVIEW_MUTATION = gql`
  mutation deleteReviewMutation($input: DeleteReviewInput!) {
    deleteReview(input: $input) {
      ok
      error
    }
  }
`;

const GET_CHILD_REVIEWS_QUERY = gql`
  query getChildReviewsQuery($input: GetChildReviewsInput!) {
    getChildReviews(input: $input) {
      ok
      error
      reviews {
        id
        rating
        text
        updatedAt
        creator {
          id
          email
        }
        parentReview {
          id
        }
      }
    }
  }
`;

export const GET_PODCAST_QUERY = gql`
  query getPodcastQuery($input: PodcastSearchInput!) {
    getPodcast(input: $input) {
      ok
      error
      episodesCategory
      podcast {
        id
        rating
        title
        category
        coverImg
        creator {
          email
          id
        }
        episodes {
          id
          title
          category
          episodeUrl
        }
      }
    }
  }
`;

const GET_REVIEWS_QUERY = gql`
  query getReviewsQuery($input: GetReviewsInput!) {
    getReviews(input: $input) {
      ok
      error
      reviews {
        id
        rating
        text
        updatedAt
        creator {
          id
          email
        }
        childReview {
          id
        }
      }
      totalCount
      totalPages
    }
  }
`;

export const CREATE_REVIEW_MUTATION = gql`
  mutation createReviewMutation($input: CreateReviewInput!) {
    createReview(input: $input) {
      ok
      error
      id
    }
  }
`;

type IParams = {
  id: string;
};

export interface ICheckNum {
  num: number;
  isHover: boolean;
}

export interface IWriteForm {
  review: string;
}

export const DetailPodcast = () => {
  const [page, setPage] = useState(1);
  const { data: userData } = useMe();
  const { id } = useParams<IParams>();
  const [score, setScore] = useState<ICheckNum>({ num: 0, isHover: false });
  const [value, setValue] = useState(0);
  const { data, loading, error, refetch } = useQuery<
    getPodcastQuery,
    getPodcastQueryVariables
  >(GET_PODCAST_QUERY, {
    variables: {
      input: {
        id: +id!,
      },
    },
  });

  const { data: getReviewsData, refetch: reviewsRefetch } = useQuery<
    getReviewsQuery,
    getReviewsQueryVariables
  >(GET_REVIEWS_QUERY, {
    variables: {
      input: {
        podcastId: +id!,
        page,
      },
    },
  });
  const { data: getChildReviewData, refetch: childReviewsRefetch } = useQuery<
    getChildReviewsQuery,
    getChildReviewsQueryVariables
  >(GET_CHILD_REVIEWS_QUERY, {
    variables: {
      input: {
        podcastId: +id!,
      },
    },
  });

  const {
    register,
    handleSubmit,
    getValues,
    setValue: setText,
  } = useForm<IWriteForm>();

  const onCompleted = async (data: createReviewMutation) => {
    const {
      createReview: { ok, id },
    } = data;
    if (ok) {
      setText("review", "");
      setValue(0);
      await refetch();
      await reviewsRefetch();
      await childReviewsRefetch();
    }
  };

  const [deleteReviewMutation, { loading: deleteReviewLoading }] = useMutation<
    deleteReviewMutation,
    deleteReviewMutationVariables
  >(DELETE_REVIEW_MUTATION, {
    onCompleted: async (data: deleteReviewMutation) => {
      const {
        deleteReview: { ok, error },
      } = data;
      if (ok) {
        await reviewsRefetch();
        await childReviewsRefetch();
      }
    },
  });

  const onDeleteReivew = (reviewId: number) => {
    const result = window.confirm("Do you want to delete?");
    if (!deleteReviewLoading && result) {
      deleteReviewMutation({
        variables: {
          input: {
            reviewId,
          },
        },
      });
    }
  };

  const [toggleSubscribeMutation, { loading: toggleLoading }] = useMutation<
    toggleSubscribeMutation,
    toggleSubscribeMutationVariables
  >(TOGGLE_SUBSCRIBE_MUTATION, {
    refetchQueries: [
      {
        query: ME_QUERY,
      },
      {
        query: SUBSCRIPTIONS_QUERY,
      },
    ],
  });

  const onToggleSubscribe = () => {
    if (!toggleLoading) {
      toggleSubscribeMutation({
        variables: {
          input: {
            podcastId: +id!,
          },
        },
      });
    }
  };

  const [
    createReviewMutation,
    { loading: createReviewLoading, data: createReviewData },
  ] = useMutation<createReviewMutation, createReviewMutationVariables>(
    CREATE_REVIEW_MUTATION,
    { onCompleted }
  );

  const onReview = () => {
    const { review } = getValues();
    createReviewMutation({
      variables: {
        input: {
          podcastId: +id!,
          text: review,
          rating: value,
        },
      },
    });
  };

  const onMouseEnter = (num: number) => {
    setScore({ num, isHover: true });
  };

  const onMouseOut = () => {
    setScore({ num: 0, isHover: false });
  };

  const onClick = (num: number) => {
    setValue(num);
  };

  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);

  return (
    <div
      className={`${
        userData?.me.id === data?.getPodcast.podcast?.creator.id ||
        userData?.me.subscriptions.some((subscribe) => subscribe.id === +id!)
          ? "h-auto"
          : "h-screen"
      } relative bg-gray-800`}
    >
      <Helmet>
        <title>{`${data?.getPodcast.podcast?.title} | Hcast`}</title>
      </Helmet>
      <div className="max-w-7xl flex flex-col mx-auto space-y-6">
        <div
          className="relative py-48 w-full bg-cover bg-no-repeat bg-center mb-2"
          style={{
            backgroundImage: `url(${data?.getPodcast.podcast?.coverImg})`,
          }}
        >
          {userData?.me.role === UserRole.Listener && (
            <div>
              {userData?.me.subscriptions.some(
                (subscribe) => subscribe.id === +id!
              ) ? (
                <div
                  onClick={onToggleSubscribe}
                  className="bg-gray-600 text-gray-300 absolute right-5 bottom-5 cursor-pointer p-2 rounded-md"
                >
                  {toggleLoading ? "Loading..." : "Subscribing"}
                </div>
              ) : (
                <div
                  onClick={onToggleSubscribe}
                  className="bg-red-500 text-slate-200 absolute right-5 bottom-5 cursor-pointer p-2 rounded-md"
                >
                  {toggleLoading ? "Loading..." : "Subscribe"}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between w-full items-center px-4">
          <div>
            <h3 className="text-cyan-400 text-3xl select-none">
              {data?.getPodcast.podcast?.title}
            </h3>
            <h4 className="text-cyan-400 text-sm select-none text-end">
              {data?.getPodcast.podcast?.category}
            </h4>
          </div>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <FontAwesomeIcon
                key={star}
                icon={faStar}
                className={`${
                  data?.getPodcast.podcast?.rating &&
                  data.getPodcast.podcast.rating >= star
                    ? "text-yellow-400"
                    : "text-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        {userData?.me.id === data?.getPodcast.podcast?.creator.id ||
        userData?.me.subscriptions.some(
          (subscribe) => subscribe.id === +id!
        ) ? (
          <>
            <span className="flex justify-center items-center relative">
              <h4 className="text-cyan-500 text-2xl">[Episodes]</h4>
              {data?.getPodcast.podcast?.episodes.length !== 0 &&
                userData?.me.id === data?.getPodcast.podcast?.creator.id && (
                  <Link
                    className="text-red-500 hover:text-red-600 transition-colors absolute cursor-pointer ml-32"
                    to={`/podcast/create-episode`}
                  >
                    <FontAwesomeIcon icon={faPlusCircle} />
                  </Link>
                )}
            </span>
            {userData?.me.role === UserRole.Host &&
              data?.getPodcast.podcast?.episodes.length === 0 && (
                <div className="flex w-full justify-center items-center">
                  <FontAwesomeIcon
                    className="text-red-500 mr-2"
                    icon={faArrowCircleRight}
                  />
                  <Link className="text-red-300" to={`/podcast/create-episode`}>
                    Go! Create my first episode!
                  </Link>
                </div>
              )}
            {userData?.me.role === UserRole.Listener &&
              data?.getPodcast.podcast?.episodes.length === 0 && (
                <div className="w-full text-red-500 text-center">Not Yet..</div>
              )}
            {data?.getPodcast.episodesCategory?.map((category) => (
              <div key={category} className="felx flex-col">
                <h5 className="text-xl text-cyan-500 ml-52">{category}</h5>
                {data?.getPodcast.podcast?.episodes.map(
                  (episode) =>
                    category === episode.category && (
                      <Episode
                        key={episode.id}
                        category={episode.category}
                        episodeUrl={episode.episodeUrl}
                        id={episode.id}
                        title={episode.title}
                        podcastId={+id!}
                        userId={userData?.me.id!}
                        creatorId={data.getPodcast.podcast?.creator.id!}
                      />
                    )
                )}
              </div>
            ))}
            <h4 className="text-cyan-500 text-2xl text-center">[Reivew]</h4>
            <div className="w-full">
              <form
                onSubmit={handleSubmit(onReview)}
                className="bg-transparent w-full h-40 p-6"
              >
                <div className="flex w-full justify-center mt-4">
                  <div className="relative flex flex-col w-3/5">
                    <span className="text-gray-300 absolute left-2 -top-7">
                      {userData?.me.email}
                    </span>
                    <div
                      onMouseLeave={onMouseOut}
                      className="flex space-x-2 absolute right-6 -top-6"
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FontAwesomeIcon
                          key={star}
                          icon={faStar}
                          onClick={() => onClick(star)}
                          onMouseEnter={() => onMouseEnter(star)}
                          className={`cursor-pointer ${
                            score.isHover
                              ? star <= score.num
                                ? "text-yellow-400"
                                : "text-gray-400"
                              : star <= value
                              ? "text-yellow-400"
                              : "text-gray-400"
                          }`}
                        />
                      ))}
                    </div>
                    <textarea
                      placeholder="Please, Write your reivew!"
                      {...register("review", { required: true, minLength: 5 })}
                      className="focus:outline-none rounded p-3 mr-5 border border-cyan-400 shadow-lg"
                    ></textarea>
                  </div>
                  <button className="p-2 transition-colors bg-cyan-300 rounded hover:bg-cyan-400 focus:bg-cyan-400">
                    Review
                  </button>
                </div>
              </form>
            </div>
            <div className="max-w-7xl flex flex-col justify-center w-full space-y-6">
              {getReviewsData?.getReviews.reviews?.map((review) => (
                <Review
                  key={review.id}
                  email={review.creator.email}
                  id={review.id}
                  podcastId={+id!}
                  rating={review.rating}
                  childReviewLength={review.childReview?.length}
                  text={review.text}
                  updatedAt={review.updatedAt}
                  userId={review.creator.id}
                  childReviews={getChildReviewData?.getChildReviews.reviews}
                  createReviewMutation={createReviewMutation}
                  onDeleteReivew={onDeleteReivew}
                />
              ))}
            </div>
            <div className="grid grid-cols-3 text-center max-w-md mt-20 items-center mx-auto pb-5">
              {page > 1 ? (
                <button
                  onClick={onPrevPageClick}
                  className="font-medium text-2xl focus:outline-none text-cyan-300"
                >
                  &larr;
                </button>
              ) : (
                <div></div>
              )}
              {getReviewsData?.getReviews.totalCount === 0 ? (
                <div className="w-full flex flex-col justify-center items-center">
                  <FontAwesomeIcon
                    className="text-red-500 animate-bounce"
                    icon={faArrowCircleUp}
                  />
                  <span className="mx-5 text-red-300 w-full">
                    Create First Review!
                  </span>
                </div>
              ) : (
                <span className="mx-5 text-gray-300">
                  Page {page} of {getReviewsData?.getReviews.totalPages}
                </span>
              )}
              {getReviewsData?.getReviews.totalCount !== 0 &&
              page !== getReviewsData?.getReviews.totalPages ? (
                <button
                  onClick={onNextPageClick}
                  className="font-medium text-2xl focus:outline-none text-cyan-300"
                >
                  &rarr;
                </button>
              ) : (
                <div></div>
              )}
            </div>
          </>
        ) : (
          <div className="text-red-500 text-center text-3xl p-4">
            You can view it by subscribing!
          </div>
        )}
      </div>
    </div>
  );
};
