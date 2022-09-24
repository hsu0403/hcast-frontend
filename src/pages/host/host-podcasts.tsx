import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Podcast } from "../../components/podcast";
import { useMe } from "../../hooks/useMe";

export const HostPodcasts = () => {
  const { data, loading, error } = useMe();

  return (
    <div className="h-screen flex items-center justify-center bg-gray-800">
      <Helmet>
        <title>{`Home | Hcast`}</title>
      </Helmet>
      {data?.me.podcasts.length === 0 ? (
        <Link to="/create-podcast">
          <span className="text-red-700 animate-pulse text-4xl">
            Make your first podcast
          </span>
        </Link>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-7 mt-10 mx-2 w-4/5">
          {data?.me.podcasts.map((podcast) => (
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
      )}
    </div>
  );
};
