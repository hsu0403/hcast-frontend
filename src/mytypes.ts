/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: deleteEpisodeMutation
// ====================================================

export interface deleteEpisodeMutation_deleteEpisode {
  __typename: "CoreOutput";
  ok: boolean;
  error: string | null;
}

export interface deleteEpisodeMutation {
  deleteEpisode: deleteEpisodeMutation_deleteEpisode;
}

export interface deleteEpisodeMutationVariables {
  input: EpisodeSearchInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: markEpisodeAsPlayedMutation
// ====================================================

export interface markEpisodeAsPlayedMutation_markEpisodeAsPlayed {
  __typename: "MarkEpisodePlayedOutput";
  ok: boolean;
  error: string | null;
}

export interface markEpisodeAsPlayedMutation {
  markEpisodeAsPlayed: markEpisodeAsPlayedMutation_markEpisodeAsPlayed;
}

export interface markEpisodeAsPlayedMutationVariables {
  input: MarkEpisodePlayedInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: meQuery
// ====================================================

export interface meQuery_me_playedEpisodes {
  __typename: "Episode";
  id: number;
}

export interface meQuery_me_podcasts {
  __typename: "Podcast";
  id: number;
  title: string;
  category: string;
  rating: number;
  coverImg: string;
}

export interface meQuery_me_subscriptions {
  __typename: "Podcast";
  id: number;
}

export interface meQuery_me {
  __typename: "User";
  id: number;
  email: string;
  emailVerified: boolean;
  role: UserRole;
  createdAt: any;
  playedEpisodes: meQuery_me_playedEpisodes[];
  podcasts: meQuery_me_podcasts[];
  subscriptions: meQuery_me_subscriptions[];
}

export interface meQuery {
  me: meQuery_me;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: verifyEmailMutation
// ====================================================

export interface verifyEmailMutation_verifyEmail {
  __typename: "VerifyEmailOutput";
  ok: boolean;
  error: string | null;
}

export interface verifyEmailMutation {
  verifyEmail: verifyEmailMutation_verifyEmail;
}

export interface verifyEmailMutationVariables {
  input: VerifyEmailInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: toggleSubscribeMutation
// ====================================================

export interface toggleSubscribeMutation_toggleSubscribe {
  __typename: "ToggleSubscribeOutput";
  ok: boolean;
  error: string | null;
}

export interface toggleSubscribeMutation {
  toggleSubscribe: toggleSubscribeMutation_toggleSubscribe;
}

export interface toggleSubscribeMutationVariables {
  input: ToggleSubscribeInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: deleteReviewMutation
// ====================================================

export interface deleteReviewMutation_deleteReview {
  __typename: "DeleteReviewOutput";
  ok: boolean;
  error: string | null;
}

export interface deleteReviewMutation {
  deleteReview: deleteReviewMutation_deleteReview;
}

export interface deleteReviewMutationVariables {
  input: DeleteReviewInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getChildReviewsQuery
// ====================================================

export interface getChildReviewsQuery_getChildReviews_reviews_creator {
  __typename: "User";
  id: number;
  email: string;
}

export interface getChildReviewsQuery_getChildReviews_reviews_parentReview {
  __typename: "Review";
  id: number;
}

export interface getChildReviewsQuery_getChildReviews_reviews {
  __typename: "Review";
  id: number;
  rating: number;
  text: string;
  updatedAt: any;
  creator: getChildReviewsQuery_getChildReviews_reviews_creator;
  parentReview: getChildReviewsQuery_getChildReviews_reviews_parentReview | null;
}

export interface getChildReviewsQuery_getChildReviews {
  __typename: "GetChildReviewsOutput";
  ok: boolean;
  error: string | null;
  reviews: getChildReviewsQuery_getChildReviews_reviews[] | null;
}

export interface getChildReviewsQuery {
  getChildReviews: getChildReviewsQuery_getChildReviews;
}

export interface getChildReviewsQueryVariables {
  input: GetChildReviewsInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPodcastQuery
// ====================================================

export interface getPodcastQuery_getPodcast_podcast_creator {
  __typename: "User";
  email: string;
  id: number;
}

export interface getPodcastQuery_getPodcast_podcast_episodes {
  __typename: "Episode";
  id: number;
  title: string;
  category: string;
  episodeUrl: string;
}

export interface getPodcastQuery_getPodcast_podcast {
  __typename: "Podcast";
  id: number;
  rating: number;
  title: string;
  category: string;
  coverImg: string;
  creator: getPodcastQuery_getPodcast_podcast_creator;
  episodes: getPodcastQuery_getPodcast_podcast_episodes[];
}

export interface getPodcastQuery_getPodcast {
  __typename: "PodcastOutput";
  ok: boolean;
  error: string | null;
  episodesCategory: string[] | null;
  podcast: getPodcastQuery_getPodcast_podcast | null;
}

export interface getPodcastQuery {
  getPodcast: getPodcastQuery_getPodcast;
}

export interface getPodcastQueryVariables {
  input: PodcastSearchInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getReviewsQuery
// ====================================================

export interface getReviewsQuery_getReviews_reviews_creator {
  __typename: "User";
  id: number;
  email: string;
}

export interface getReviewsQuery_getReviews_reviews_childReview {
  __typename: "Review";
  id: number;
}

export interface getReviewsQuery_getReviews_reviews {
  __typename: "Review";
  id: number;
  rating: number;
  text: string;
  updatedAt: any;
  creator: getReviewsQuery_getReviews_reviews_creator;
  childReview: getReviewsQuery_getReviews_reviews_childReview[] | null;
}

export interface getReviewsQuery_getReviews {
  __typename: "GetReviewsOutput";
  ok: boolean;
  error: string | null;
  reviews: getReviewsQuery_getReviews_reviews[] | null;
  totalCount: number | null;
  totalPages: number | null;
}

export interface getReviewsQuery {
  getReviews: getReviewsQuery_getReviews;
}

export interface getReviewsQueryVariables {
  input: GetReviewsInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createReviewMutation
// ====================================================

export interface createReviewMutation_createReview {
  __typename: "CreateReviewOutput";
  ok: boolean;
  error: string | null;
  id: number | null;
}

export interface createReviewMutation {
  createReview: createReviewMutation_createReview;
}

export interface createReviewMutationVariables {
  input: CreateReviewInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: editProfileMutation
// ====================================================

export interface editProfileMutation_editProfile {
  __typename: "EditProfileOutput";
  ok: boolean;
  error: string | null;
}

export interface editProfileMutation {
  editProfile: editProfileMutation_editProfile;
}

export interface editProfileMutationVariables {
  input: EditProfileInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: forgotPasswordMutation
// ====================================================

export interface forgotPasswordMutation_forgotPassword {
  __typename: "ForgotPasswordOutput";
  ok: boolean;
  error: string | null;
}

export interface forgotPasswordMutation {
  forgotPassword: forgotPasswordMutation_forgotPassword;
}

export interface forgotPasswordMutationVariables {
  input: ForgotPasswordInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createEpisodeMutation
// ====================================================

export interface createEpisodeMutation_createEpisode {
  __typename: "CreateEpisodeOutput";
  ok: boolean;
  error: string | null;
  id: number | null;
}

export interface createEpisodeMutation {
  createEpisode: createEpisodeMutation_createEpisode;
}

export interface createEpisodeMutationVariables {
  input: CreateEpisodeInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createPodcastMutation
// ====================================================

export interface createPodcastMutation_createPodcast {
  __typename: "CreatePodcastOutput";
  ok: boolean;
  error: string | null;
  id: number | null;
}

export interface createPodcastMutation {
  createPodcast: createPodcastMutation_createPodcast;
}

export interface createPodcastMutationVariables {
  input: CreatePodcastInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getAllPodcastsQuery
// ====================================================

export interface getAllPodcastsQuery_getAllPodcasts_podcasts {
  __typename: "Podcast";
  id: number;
  title: string;
  category: string;
  coverImg: string;
  rating: number;
}

export interface getAllPodcastsQuery_getAllPodcasts {
  __typename: "GetAllPodcastsOutput";
  ok: boolean;
  error: string | null;
  podcasts: getAllPodcastsQuery_getAllPodcasts_podcasts[] | null;
  totalCount: number | null;
  totalPages: number | null;
}

export interface getAllPodcastsQuery {
  getAllPodcasts: getAllPodcastsQuery_getAllPodcasts;
}

export interface getAllPodcastsQueryVariables {
  input: GetAllPodcastsInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: subscriptionsQuery
// ====================================================

export interface subscriptionsQuery_subscriptions {
  __typename: "Podcast";
  id: number;
  title: string;
  rating: number;
  coverImg: string;
  category: string;
}

export interface subscriptionsQuery {
  subscriptions: subscriptionsQuery_subscriptions[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: searchPodcastsQuery
// ====================================================

export interface searchPodcastsQuery_searchPodcasts_podcasts {
  __typename: "Podcast";
  id: number;
  title: string;
  category: string;
  rating: number;
  coverImg: string;
}

export interface searchPodcastsQuery_searchPodcasts {
  __typename: "SearchPodcastsOutput";
  ok: boolean;
  error: string | null;
  podcasts: searchPodcastsQuery_searchPodcasts_podcasts[] | null;
  totalCount: number | null;
  totalPages: number | null;
}

export interface searchPodcastsQuery {
  searchPodcasts: searchPodcastsQuery_searchPodcasts;
}

export interface searchPodcastsQueryVariables {
  input: SearchPodcastsInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: loginMutation
// ====================================================

export interface loginMutation_login {
  __typename: "LoginOutput";
  ok: boolean;
  error: string | null;
  token: string | null;
}

export interface loginMutation {
  login: loginMutation_login;
}

export interface loginMutationVariables {
  input: LoginInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createAccountMutation
// ====================================================

export interface createAccountMutation_createAccount {
  __typename: "CreateAccountOutput";
  ok: boolean;
  error: string | null;
}

export interface createAccountMutation {
  createAccount: createAccountMutation_createAccount;
}

export interface createAccountMutationVariables {
  input: CreateAccountInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: VerifiedUser
// ====================================================

export interface VerifiedUser {
  __typename: "User";
  emailVerified: boolean;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: EditedUser
// ====================================================

export interface EditedUser {
  __typename: "User";
  email: string;
  emailVerified: boolean;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum UserRole {
  Host = "Host",
  Listener = "Listener",
}

export interface CreateAccountInput {
  email: string;
  password: string;
  role: UserRole;
}

export interface CreateEpisodeInput {
  category: string;
  episodeUrl: string;
  podcastId: number;
  title: string;
}

export interface CreatePodcastInput {
  category: string;
  coverImg: string;
  title: string;
}

export interface CreateReviewInput {
  parentReviewId?: number | null;
  podcastId: number;
  rating?: number | null;
  text: string;
}

export interface DeleteReviewInput {
  reviewId: number;
}

export interface EditProfileInput {
  email?: string | null;
  password?: string | null;
}

export interface EpisodeSearchInput {
  episodeId: number;
  podcastId: number;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface GetAllPodcastsInput {
  page?: number | null;
}

export interface GetChildReviewsInput {
  podcastId: number;
}

export interface GetReviewsInput {
  page?: number | null;
  podcastId: number;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface MarkEpisodePlayedInput {
  id: number;
}

export interface PodcastSearchInput {
  id: number;
}

export interface SearchPodcastsInput {
  page?: number | null;
  titleQuery: string;
}

export interface ToggleSubscribeInput {
  podcastId: number;
}

export interface VerifyEmailInput {
  code: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
