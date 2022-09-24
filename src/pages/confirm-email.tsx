import { gql, useApolloClient, useMutation } from "@apollo/client";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useMe } from "../hooks/useMe";
import { verifyEmailMutation, verifyEmailMutationVariables } from "../mytypes";

const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmailMutation($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;

export const ConfirmEmail = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();
  const onCompleted = (data: verifyEmailMutation) => {
    const {
      verifyEmail: { ok, error },
    } = data;
    if (ok && userData?.me) {
      client.writeFragment({
        id: `User:${userData.me.id}`,
        fragment: gql`
          fragment VerifiedUser on User {
            emailVerified
          }
        `,
        data: {
          emailVerified: true,
        },
      });
    }
  };
  const [verifyEmail] = useMutation<
    verifyEmailMutation,
    verifyEmailMutationVariables
  >(VERIFY_EMAIL_MUTATION, { onCompleted });
  useEffect(() => {
    const [_, code] = window.location.href.split("code=");
    verifyEmail({
      variables: {
        input: {
          code,
        },
      },
    });
  }, []);
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800">
      <Helmet>
        <title>{`Confirm '${userData?.me.email}' | Hcast`}</title>
      </Helmet>
      {userData?.me.emailVerified ? (
        <div className="flex justify-center items-center space-x-2 text-2xl">
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="text-emerald-400 animate-appear-animation"
          />
          <h2 className="mb-1 font-medium text-slate-300">Confirm email</h2>
        </div>
      ) : (
        <>
          <div className="flex items-end">
            <h2 className="text-2xl mb-1 font-medium text-gray-300">
              Confirming email
            </h2>
            <span className="animate-disappear-infinite-animation mb-1 font-medium text-gray-300">
              .
            </span>
            <span className="animate-disappear-infinite-animation animation-delay-1 mb-1 font-medium text-gray-300">
              .
            </span>
            <span className="animate-disappear-infinite-animation animation-delay-2 mb-1 font-medium text-gray-300">
              .
            </span>
          </div>
          <div className="flex">
            <h4 className="text-gray-400 text-sm">
              Please wait, don't close this page
            </h4>
            <span className="animate-disappear-infinite-animation mb-1 font-medium text-gray-300">
              .
            </span>
            <span className="animate-disappear-infinite-animation animation-delay-1 mb-1 font-medium text-gray-300">
              .
            </span>
            <span className="animate-disappear-infinite-animation animation-delay-2 mb-1 font-medium text-gray-300">
              .
            </span>
          </div>
        </>
      )}
    </div>
  );
};
