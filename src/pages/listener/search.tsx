import { gql, useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Podcast } from "../../components/podcast";
import {
  searchPodcastsQuery,
  searchPodcastsQueryVariables,
} from "../../mytypes";
import { Loading } from "../../components/loading";
import { Helmet } from "react-helmet-async";

const SEARCH_PODCASTS_QUERY = gql`
  query searchPodcastsQuery($input: SearchPodcastsInput!) {
    searchPodcasts(input: $input) {
      ok
      error
      podcasts {
        id
        title
        category
        rating
        coverImg
      }
      totalCount
      totalPages
    }
  }
`;

export const Search = () => {
  const [page, setPage] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, { loading, data }] = useLazyQuery<
    searchPodcastsQuery,
    searchPodcastsQueryVariables
  >(SEARCH_PODCASTS_QUERY);
  const [_, query] = location.search.split("?term=");
  useEffect(() => {
    if (!query) {
      navigate("/", { replace: true });
    }
    searchQuery({
      variables: {
        input: {
          titleQuery: query,
          page,
        },
      },
    });
  }, [navigate, location, searchQuery, page, query]);
  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);
  return (
    <div className="h-screen flex flex-col items-center justify-between bg-gray-800">
      <Helmet>
        <title>{`Search '${query}' | Hcast`}</title>
      </Helmet>

      {loading ? (
        <Loading />
      ) : data?.searchPodcasts.podcasts?.length === 0 ? (
        <div className="text-cyan-400 mt-32 text-4xl">
          {query} is not found.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-7 mt-10 mx-2 w-4/5 mb-5">
            {data?.searchPodcasts.podcasts?.map((podcast) => (
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
            <span className="mx-5 text-gray-300">
              Page {page} of {data?.searchPodcasts.totalPages}
            </span>
            {page !== data?.searchPodcasts.totalPages ? (
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
      )}
    </div>
  );
};
