import {
  faArrowAltCircleRight,
  faSquarePlus,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { authToken, isLoggedInVar } from "../apollo";
import { LOCALSTORAGE_TOKEN } from "../constants";
import hcastLogo from "../images/logo.png";
import { UserRole } from "../mytypes";

interface IHeaderProps {
  email: string;
  role: UserRole;
  emailVerified: boolean;
}

interface IFormProp {
  searchTerm: string;
}

export const Header: React.FC<IHeaderProps> = ({
  email,
  role,
  emailVerified,
}) => {
  const navigate = useNavigate();
  const [_, emailAddress] = email.split("@");
  const userRef = useRef<any>(null);
  const [toggle, setToggle] = useState(false);
  const onUserClick = () => {
    setToggle((prev) => !prev);
  };
  const onLogoutClick = () => {
    localStorage.removeItem(LOCALSTORAGE_TOKEN);
    authToken(null);
    isLoggedInVar(false);
  };
  const { register, getValues, handleSubmit } = useForm<IFormProp>();
  const onSearchSubmit = () => {
    const { searchTerm } = getValues();
    navigate({ pathname: "/search", search: `?term=${searchTerm}` });
  };
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setToggle(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [userRef]);
  return (
    <>
      {!emailVerified && (
        <div className="z-40 bg-red-500 p-3 text-center text-base text-white">
          <span>Please verify your email</span>
          <FontAwesomeIcon
            icon={faArrowAltCircleRight}
            className="animate-ping mx-4"
          />
          <a
            href={`http://${emailAddress}`}
            className="hover:underline hover:text-slate-500"
          >
            {email}
          </a>
        </div>
      )}
      <header className="bg-white">
        <div className="w-full px-5 max-w-screen-xl mx-auto flex justify-between items-center">
          <Link to="/">
            <img src={hcastLogo} alt="hcast-logo" className="w-44 h-32" />
          </Link>
          <form
            onSubmit={handleSubmit(onSearchSubmit)}
            className="w-1/2 flex items-center justify-center"
          >
            <input
              {...register("searchTerm", { required: true })}
              type="search"
              className="w-4/5 py-3 px-5 border-2 border-cyan-400 rounded-md shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors"
              placeholder="Search Podcast.."
            />
          </form>
          <div className="flex space-x-4">
            {role === UserRole.Host && (
              <Link to="/create-podcast">
                <FontAwesomeIcon icon={faSquarePlus} className="text-xl" />
              </Link>
            )}
            <span ref={userRef} className="text-xs relative z-50">
              <div onClick={onUserClick} className="cursor-pointer">
                <FontAwesomeIcon icon={faUser} className="text-xl" />
              </div>
              <ul
                className={`transition-all absolute mt-2 rounded-l-lg bg-cyan-500 w-40 right-0 text-2xl ${
                  toggle
                    ? "visible animate-appear-animation"
                    : "invisible animate-disappear-animation"
                }`}
              >
                <Link to="/edit-profile">
                  <li className="py-1 px-2 cursor-pointer hover:bg-blue-500 hover:text-gray-300 rounded-tl-lg transition-colors">
                    Edit Profile
                  </li>
                </Link>
                <hr className="w-full" />
                <li
                  onClick={onLogoutClick}
                  className="py-1 px-2 cursor-pointer hover:bg-blue-500 hover:text-gray-300 rounded-bl-lg transition-colors"
                >
                  Log Out
                </li>
              </ul>
            </span>
          </div>
        </div>
        <hr className="w-full overflow-hidden bg-gray-800 h-1 relative before:absolute before:w-full before:h-20 before:bg-gradient-to-t before:from-transparent before:via-cyan-300 before:to-cyan-300 before:top-80 before:left-[-50%] before:origin-bottom-right before:animate-lineheader-animation" />
      </header>
    </>
  );
};
