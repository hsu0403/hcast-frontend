import { gql, useQuery } from "@apollo/client";
import { meQuery } from "../mytypes";

export const ME_QUERY = gql`
  query meQuery {
    me {
      id
      email
      emailVerified
      role
      createdAt
      playedEpisodes {
        id
      }
      podcasts {
        id
        title
        category
        rating
        coverImg
      }
      subscriptions {
        id
      }
    }
  }
`;

export const useMe = () => {
  return useQuery<meQuery>(ME_QUERY);
};
