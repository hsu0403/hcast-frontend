import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button } from "../components/button";
import { FormError } from "../components/form-error";
import { loginMutation, loginMutationVariables } from "../mytypes";

const LOGIN_MUTATION = gql`
  mutation loginMutation($input: LoginInput!) {
    login(input: $input) {
      ok
      error
      token
    }
  }
`;

interface IForm {
  email: string;
  password: string;
}

export const Login = () => {
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IForm>({
    mode: "onChange",
  });

  const onCompleted = (data: loginMutation) => {
    const {
      login: { ok, error, token },
    } = data;
    if (ok) {
      console.log(token);
    }
  };

  const [loginMutation, { loading, error, data: loginMutaionResult }] =
    useMutation<loginMutation, loginMutationVariables>(LOGIN_MUTATION, {
      onCompleted,
    });

  const onSubmit = () => {
    const { email, password } = getValues();
    loginMutation({
      variables: {
        input: {
          email,
          password,
        },
      },
    });
  };

  return (
    <>
      <div className="h-screen flex items-center justify-center bg-gray-800">
        <div className="bg-black overflow-hidden w-full max-w-lg h-[460px] rounded-md relative before:absolute before:w-full before:max-w-lg before:h-[460px] before:bg-gradient-to-t before:from-transparent before:via-cyan-300 before:to-cyan-300 before:top-[-50%] before:left-[-50%] before:origin-bottom-right before:animate-line-animation after:absolute after:w-full after:max-w-lg after:h-[460px] after:bg-gradient-to-t after:from-transparent after:via-cyan-300 after:to-cyan-300 after:top-[-50%] after:left-[-50%] after:origin-bottom-right after:animate-line-animation after:animation-delay-10">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col px-10 py-8 absolute z-10 inset-1 bg-black rounded-md"
          >
            <h2 className="text-cyan-300 mb-10 text-3xl font-medium text-center tracking-widest">
              Welcome
            </h2>
            <div className="relative mb-14">
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
              <div className="-mt-12 mb-6">
                <FormError errorMessage={errors.email.message} />
              </div>
            )}
            <div className="relative mb-8">
              <input
                required
                {...register("password", {
                  required: "Password is required.",
                  minLength: 8,
                })}
                type="password"
                name="password"
                className="relative w-full py-3 px-5 rounded-md shadow-sm bg-transparent border-none outline-none peer text-gray-300 z-10"
              />
              <span className="absolute tracking-wider text-gray-300 text-lg left-0 py-3 px-5 pointer-events-none transition-all peer-focus:text-cyan-300 peer-valid:text-cyan-300 peer-focus:-translate-y-9 peer-valid:-translate-y-9 peer-focus:-translate-x-4 peer-valid:-translate-x-4 peer-focus:text-sm peer-valid:text-sm">
                Password
              </span>
              <i className="absolute left-0 bottom-0 w-full h-[2px] bg-cyan-400 rounded-md transition-all pointer-events-none z-[9] peer-focus:h-[48px]"></i>
            </div>
            {errors.password?.message && (
              <div className="-mt-6">
                <FormError errorMessage={errors.password.message} />
              </div>
            )}
            {errors.password?.type === "minLength" && (
              <div className="-mt-6">
                <FormError errorMessage="The password must be at least 8 digits." />
              </div>
            )}
            <div className="flex justify-between my-3">
              <Link
                className="text-gray-400 hover:text-cyan-400 hover:underline"
                to="/forgot-password"
              >
                &larr; Forgot Password
              </Link>
              <Link
                className="text-cyan-300 hover:text-cyan-400 hover:underline transition-all"
                to="/signup"
              >
                Create an Account &rarr;
              </Link>
            </div>

            <Button canClick={isValid} loading={loading} actionText="Log In" />
            {loginMutaionResult?.login.error && (
              <div className="mt-2">
                <FormError errorMessage={loginMutaionResult.login.error} />
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};
