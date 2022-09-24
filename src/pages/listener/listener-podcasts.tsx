import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Podcast } from "../../components/podcast";
import {
  getAllPodcastsQuery,
  getAllPodcastsQueryVariables,
  subscriptionsQuery,
} from "../../mytypes";

const GET_ALL_PODCASTS = gql`
  query getAllPodcastsQuery($input: GetAllPodcastsInput!) {
    getAllPodcasts(input: $input) {
      ok
      error
      podcasts {
        id
        title
        category
        coverImg
        rating
      }
      totalCount
      totalPages
    }
  }
`;

export const SUBSCRIPTIONS_QUERY = gql`
  query subscriptionsQuery {
    subscriptions {
      id
      title
      rating
      coverImg
      category
    }
  }
`;

export const ListenerPodcasts = () => {
  const [page, setPage] = useState(1);
  const { data, loading } = useQuery<
    getAllPodcastsQuery,
    getAllPodcastsQueryVariables
  >(GET_ALL_PODCASTS, {
    variables: {
      input: {
        page,
      },
    },
  });
  const { data: subscriptionsData } =
    useQuery<subscriptionsQuery>(SUBSCRIPTIONS_QUERY);
  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);
  return (
    <div className="h-screen flex flex-col items-center justify-between bg-gray-800">
      <Helmet>
        <title>{`Home | Hcast`}</title>
      </Helmet>
      <div className="w-full flex flex-col justify-center items-start p-10">
        <h2 className="ml-4 text-2xl text-cyan-300">[Subscriptions]</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-7 mt-10 mx-2 w-full">
          {subscriptionsData?.subscriptions?.map((podcast) => (
            <Podcast
              key={podcast.id}
              category={podcast.category}
              rating={podcast.rating}
              title={podcast.title}
              coverImg={podcast.coverImg}
              id={podcast.id}
            />
          ))}
        </div>
        {subscriptionsData?.subscriptions.length === 0 && (
          <h3 className="text-red-700 animate-pulse mx-auto text-xl">
            Be the first to subscribe!
          </h3>
        )}
      </div>
      <h3 className="text-2xl text-cyan-300">[Podcasts]</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-7 mx-2 w-4/5">
        {data?.getAllPodcasts.podcasts?.map((podcast) => (
          <Podcast
            key={podcast.id}
            category={podcast.category}
            rating={podcast.rating}
            title={podcast.title}
            coverImg={podcast.coverImg}
            id={podcast.id}
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
        {data?.getAllPodcasts.totalCount === 0 ? (
          <span className="mx-5 text-gray-300">Not Yet..</span>
        ) : (
          <span className="mx-5 text-gray-300">
            Page {page} of {data?.getAllPodcasts.totalPages}
          </span>
        )}
        {data?.getAllPodcasts.totalCount !== 0 &&
        page !== data?.getAllPodcasts.totalPages ? (
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
    </div>
  );
};
