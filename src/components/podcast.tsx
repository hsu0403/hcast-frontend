import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";

interface IPodcastProps {
  title: string;
  category: string;
  rating: number;
  coverImg: string;
  id: number;
}

export const Podcast: React.FC<IPodcastProps> = ({
  category,
  rating,
  title,
  coverImg,
  id,
}) => {
  const tempArr = [1, 2, 3, 4, 5];

  return (
    <div className="bg-cyan-600 flex flex-col w-full rounded-sm">
      <Link to={`/podcast/${id}`}>
        <div
          className="py-20 bg-cover bg-no-repeat bg-center mb-2"
          style={{ backgroundImage: `url(${coverImg})` }}
        ></div>
      </Link>
      <div className="flex justify-end items-center mb-2 mr-2">
        {tempArr.map((star) => (
          <FontAwesomeIcon
            key={star}
            icon={faStar}
            className={`${
              rating >= star ? "text-yellow-400" : "text-gray-400"
            }`}
          />
        ))}
      </div>
      <h3 className="text-xs font-light ml-2">{category}</h3>
      <h5 className="text-xl font-medium ml-2 mb-5">{title}</h5>
    </div>
  );
};
