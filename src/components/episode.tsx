import { gql, useMutation } from "@apollo/client";
import {
  faCheck,
  faCheckCircle,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef } from "react";
import { ME_QUERY, useMe } from "../hooks/useMe";
import {
  deleteEpisodeMutation,
  deleteEpisodeMutationVariables,
  markEpisodeAsPlayedMutation,
  markEpisodeAsPlayedMutationVariables,
  UserRole,
} from "../mytypes";
import { GET_PODCAST_QUERY } from "../pages/detail-podcast";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

const DELETE_EPISODE_MUTATION = gql`
  mutation deleteEpisodeMutation($input: EpisodeSearchInput!) {
    deleteEpisode(input: $input) {
      ok
      error
    }
  }
`;

const MARK_EPISODE_AS_PLAYED_MUTATION = gql`
  mutation markEpisodeAsPlayedMutation($input: MarkEpisodePlayedInput!) {
    markEpisodeAsPlayed(input: $input) {
      ok
      error
    }
  }
`;

interface IEpisodeProps {
  id: number;
  title: string;
  category: string;
  episodeUrl: string;
  podcastId: number;
  userId: number;
  creatorId: number;
}

export const Episode: React.FC<IEpisodeProps> = ({
  category,
  episodeUrl,
  id,
  title,
  podcastId,
  userId,
  creatorId,
}) => {
  const { data: userData } = useMe();
  const [deleteEpisodeMutation, { loading, data }] = useMutation<
    deleteEpisodeMutation,
    deleteEpisodeMutationVariables
  >(DELETE_EPISODE_MUTATION, {
    refetchQueries: [
      {
        query: GET_PODCAST_QUERY,
        variables: {
          input: {
            id: podcastId,
          },
        },
      },
    ],
  });
  const [markEpisodeAsPlayedMutation] = useMutation<
    markEpisodeAsPlayedMutation,
    markEpisodeAsPlayedMutationVariables
  >(MARK_EPISODE_AS_PLAYED_MUTATION, {
    refetchQueries: [
      {
        query: ME_QUERY,
      },
    ],
  });
  const onDeleteClick = () => {
    const result = window.confirm("Do you want to delete?");
    if (!loading && result) {
      deleteEpisodeMutation({
        variables: {
          input: { episodeId: id, podcastId },
        },
      });
    }
  };
  const onEnded = () => {
    if (UserRole.Listener === userData?.me.role) {
      if (!userData?.me.playedEpisodes.some((episode) => episode.id === id)) {
        markEpisodeAsPlayedMutation({
          variables: {
            input: {
              id,
            },
          },
        });
      }
    }
  };
  return (
    <div className="text-red-500 flex justify-center items-center mb-4">
      <div className="space-y-2">
        <span className="flex items-center space-x-2">
          <h6 className="text-zinc-100 text-lg">{title}</h6>
          {creatorId === userId && (
            <FontAwesomeIcon
              onClick={onDeleteClick}
              className="text-red-500 text-lg cursor-pointer hover:animate-pulse"
              icon={faTrashCan}
            />
          )}
        </span>
        <div className="flex justify-center items-center">
          {userData?.me.role === UserRole.Listener && (
            <FontAwesomeIcon
              className={`mr-3 ${
                userData?.me.playedEpisodes.some((play) => play.id === id)
                  ? "text-green-400"
                  : "text-gray-600"
              }`}
              icon={faCheckCircle}
            />
          )}

          <div className="w-96">
            <AudioPlayer
              autoPlay={false}
              preload={"metadata"}
              className="rounded-md bg-cyan-500"
              src={episodeUrl}
              volume={0.5}
              onEnded={onEnded}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
