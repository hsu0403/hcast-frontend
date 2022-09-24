import { gql, useMutation } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/button";
import { FormError } from "../components/form-error";
import {
  ForgotPasswordInput,
  forgotPasswordMutation,
  forgotPasswordMutationVariables,
} from "../mytypes";

const FORGOT_PASSWORD_MUTATION = gql`
  mutation forgotPasswordMutation($input: ForgotPasswordInput!) {
    forgotPassword(input: $input) {
      ok
      error
    }
  }
`;

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordInput>({
    mode: "onChange",
  });

  const onCompleted = (data: forgotPasswordMutation) => {
    const {
      forgotPassword: { ok },
    } = data;
    if (ok) {
      alert(
        "You have successfully changed your password. please check your e-mail."
      );
      navigate("/", { replace: true, state: getValues() });
    }
  };

  const [forgotPasswordMutation, { loading, data }] = useMutation<
    forgotPasswordMutation,
    forgotPasswordMutationVariables
  >(FORGOT_PASSWORD_MUTATION, { onCompleted });

  const onSubmit = () => {
    const { email } = getValues();

    forgotPasswordMutation({
      variables: {
        input: {
          email,
        },
      },
    });
  };

  return (
    <>
      <Helmet>
        <title>{`Forgot Password | Hcast`}</title>
      </Helmet>
      <div className="h-screen flex items-center justify-center bg-gray-800">
        <div className="bg-black overflow-hidden w-full max-w-lg h-[460px] rounded-md relative before:absolute before:w-full before:max-w-lg before:h-[460px] before:bg-gradient-to-t before:from-transparent before:via-cyan-300 before:to-cyan-300 before:top-[-50%] before:left-[-50%] before:origin-bottom-right before:animate-line-animation after:absolute after:w-full after:max-w-lg after:h-[460px] after:bg-gradient-to-t after:from-transparent after:via-cyan-300 after:to-cyan-300 after:top-[-50%] after:left-[-50%] after:origin-bottom-right after:animate-line-animation after:animation-delay-10">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col px-10 py-8 absolute z-10 inset-1 bg-black rounded-md"
          >
            <h2 className="text-cyan-300 mb-10 text-3xl font-medium text-center tracking-widest">
              Forgot Password?
            </h2>
            <div className="relative mb-20 mt-20">
              <input
                autoComplete="off"
                required
                {...register("email", {
                  required: "Email is required.",
                  pattern: {
                    value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                    message: "Invalid email address",
                  },
                })}
                type="email"
                name="email"
                className="relative w-full py-3 px-5 rounded-md shadow-sm bg-transparent border-none outline-none peer text-gray-300 z-10"
              />
              <span className="absolute tracking-wider text-gray-300 text-lg left-0 py-3 px-5 pointer-events-none transition-all peer-focus:text-cyan-300 peer-valid:text-cyan-300 peer-focus:-translate-y-9 peer-valid:-translate-y-9 peer-focus:-translate-x-4 peer-valid:-translate-x-4 peer-focus:text-sm peer-valid:text-sm">
                Email
              </span>
              <i className="absolute left-0 bottom-0 w-full h-[2px] bg-cyan-400 rounded-md transition-all pointer-events-none z-[9] peer-focus:h-[48px]"></i>
            </div>
            {errors.email?.message && (
              <div className="-mt-16 mb-10">
                <FormError errorMessage={errors.email.message} />
              </div>
            )}
            <div className="flex justify-between my-3">
              <Link
                className="text-gray-400 hover:text-cyan-400 hover:underline"
                to="/"
              >
                &larr; Create an Account
              </Link>
              <Link
                className="text-cyan-300 hover:text-cyan-400 hover:underline transition-all"
                to="/signup"
              >
                Go Login &rarr;
              </Link>
            </div>

            <Button
              canClick={isValid}
              loading={loading}
              actionText="New Password to E-mail"
            />
            {data?.forgotPassword.error && (
              <div className="mt-2">
                <FormError errorMessage={data.forgotPassword.error} />
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};
