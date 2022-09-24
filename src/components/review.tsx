import {
  ApolloCache,
  DefaultContext,
  LazyQueryExecFunction,
  MutationFunctionOptions,
} from "@apollo/client";
import {
  faArrowCircleDown,
  faArrowCircleUp,
  faArrowTurnRight,
  faMinusCircle,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMe } from "../hooks/useMe";
import {
  createReviewMutation,
  createReviewMutationVariables,
  getChildReviewsQuery_getChildReviews_reviews,
} from "../mytypes";
import { ICheckNum, IWriteForm } from "../pages/detail-podcast";

interface IReviewProps {
  id: number;
  podcastId: number;
  childReviewLength: number | undefined;
  rating: number;
  text: string;
  updatedAt: string;
  userId: number;
  email: string;
  createReviewMutation: (
    options?:
      | MutationFunctionOptions<
          createReviewMutation,
          createReviewMutationVariables,
          DefaultContext,
          ApolloCache<any>
        >
      | undefined
  ) => Promise<any>;
  onDeleteReivew: (reviewId: number) => void;
  childReviews:
    | getChildReviewsQuery_getChildReviews_reviews[]
    | null
    | undefined;
}

const elapsedTime = (date: string): String => {
  const times = [
    { time: "minute", milliSeconds: 1000 * 60 },
    { time: "hour", milliSeconds: 1000 * 60 * 60 },
    { time: "day", milliSeconds: 1000 * 60 * 60 * 24 },
    { time: "month", milliSeconds: 1000 * 60 * 60 * 24 * 30 },
    { time: "year", milliSeconds: 1000 * 60 * 60 * 24 * 365 },
  ].reverse();
  const end = Date.now();
  const start = Date.parse(date);
  const diff = end - start;
  for (const value of times) {
    const betweenTime = Math.floor(diff / value.milliSeconds);
    if (betweenTime > 0) {
      return `${betweenTime} ${value.time} ago`;
    }
  }
  return "just before";
};

export const Review: React.FC<IReviewProps> = ({
  email,
  id,
  rating,
  podcastId,
  childReviewLength,
  text,
  updatedAt,
  userId,
  createReviewMutation,
  childReviews,
  onDeleteReivew,
}) => {
  const {
    register,
    handleSubmit,
    getValues,
    setValue: setText,
  } = useForm<IWriteForm>();
  const { data: userData } = useMe();
  const result = elapsedTime(updatedAt);
  const [toggle, setToggle] = useState(false);
  const [reviewToggle, setReviewToggle] = useState(false);
  const [score, setScore] = useState<ICheckNum>({ num: 0, isHover: false });
  const [value, setValue] = useState(0);

  const onReview = () => {
    const { review } = getValues();
    createReviewMutation({
      variables: {
        input: {
          podcastId,
          text: review,
          rating: value,
          parentReviewId: id,
        },
      },
    });
    setValue(0);
    setText("review", "");
    setReviewToggle(false);
  };

  const onToggleDownClick = () => {
    setToggle(true);
  };
  const onToggleUpClick = () => {
    setToggle(false);
  };
  const onReviewToggle = () => {
    setReviewToggle((prev) => !prev);
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
  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-2/3 mx-auto p-4 border-2 rounded-sm flex flex-col items-end space-y-1 relative">
        <div className="w-full p-4 border-2 rounded-sm">
          <div className="flex flex-row justify-between">
            <div className="flex space-x-1 items-center justify-start">
              <div className="text-gray-300">{email}</div>
              <div className="text-sm text-gray-400 font-light">{result}</div>
            </div>
            {userId === userData?.me.id && (
              <FontAwesomeIcon
                onClick={() => onDeleteReivew(id)}
                className="text-red-500 absolute left-5 top-5 cursor-pointer"
                icon={faMinusCircle}
              />
            )}
            <FontAwesomeIcon
              onClick={onReviewToggle}
              className="text-white cursor-pointer absolute rounded-lg bg-cyan-400 text-2xl right-1 top-2"
              icon={faArrowTurnRight}
            />
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesomeIcon
                  key={star}
                  icon={faStar}
                  className={`${
                    rating && rating >= star
                      ? "text-yellow-400"
                      : "text-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
          <hr className="mb-2 mt-1" />
          <p className="text-white ml-2">{text}</p>
        </div>
        {toggle ? (
          <div
            onClick={onToggleUpClick}
            className="absolute -bottom-4 right-1/2 cursor-pointer"
          >
            <FontAwesomeIcon
              className="text-white rounded-lg bg-cyan-400 text-2xl"
              icon={faArrowCircleUp}
            />
          </div>
        ) : (
          childReviewLength! > 0 && (
            <div
              onClick={onToggleDownClick}
              className="absolute -bottom-4 right-1/2 cursor-pointer"
            >
              <FontAwesomeIcon
                className="text-white rounded-lg bg-cyan-400 text-2xl"
                icon={faArrowCircleDown}
              />
            </div>
          )
        )}
        {toggle &&
          childReviews?.map(
            (review) =>
              review.parentReview?.id === id && (
                <div
                  key={review.id}
                  className="w-11/12 p-4 border-2 rounded-sm relative"
                >
                  <div className="flex flex-row justify-between">
                    <div className="flex space-x-1 items-center justify-start">
                      <div className="text-gray-300">
                        {review.creator.email}
                      </div>
                      <div className="text-sm text-gray-400 font-light">
                        {elapsedTime(review.updatedAt)}
                      </div>
                    </div>
                    {review.creator.id === userData?.me.id && (
                      <FontAwesomeIcon
                        onClick={() => onDeleteReivew(review.id)}
                        className="text-red-500 absolute left-0.5 top-0.5 cursor-pointer"
                        icon={faMinusCircle}
                      />
                    )}
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FontAwesomeIcon
                          key={star}
                          icon={faStar}
                          className={`${
                            review.rating && review.rating >= star
                              ? "text-yellow-400"
                              : "text-gray-400"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <hr className="mb-2 mt-1" />
                  <p className="text-white ml-2">{review.text}</p>
                </div>
              )
          )}
        {reviewToggle && (
          <div className="w-full">
            <form
              onSubmit={handleSubmit(onReview)}
              className="bg-transparent w-full h-40 p-6"
            >
              <div className="flex w-full justify-center mt-4">
                <div className="relative flex flex-col w-full">
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
        )}
      </div>
    </div>
  );
};
