import { gql, useMutation } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/button";
import { FormError } from "../components/form-error";
import {
  CreateAccountInput,
  createAccountMutation,
  createAccountMutationVariables,
  UserRole,
} from "../mytypes";

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccountMutation($input: CreateAccountInput!) {
    createAccount(input: $input) {
      ok
      error
    }
  }
`;

export const SignUp = () => {
  const navigate = useNavigate();
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CreateAccountInput>({
    mode: "onChange",
  });

  const onCompleted = (data: createAccountMutation) => {
    const {
      createAccount: { ok },
    } = data;
    if (ok) {
      navigate("/", { replace: true, state: getValues() });
    }
  };

  const [
    createAccountMutation,
    { loading, data: createAccountMutationResult },
  ] = useMutation<createAccountMutation, createAccountMutationVariables>(
    CREATE_ACCOUNT_MUTATION,
    { onCompleted }
  );

  const onSubmit = () => {
    const { email, password, role } = getValues();
    if (!loading) {
      createAccountMutation({
        variables: {
          input: {
            email,
            password,
            role,
          },
        },
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>{`SignUp | Hcast`}</title>
      </Helmet>
      <div className="h-screen flex items-center justify-center bg-gray-800">
        <div className="bg-black overflow-hidden w-full max-w-lg h-[490px] rounded-md relative before:absolute before:w-full before:max-w-lg before:h-[490px] before:bg-gradient-to-t before:from-transparent before:via-cyan-300 before:to-cyan-300 before:top-[-50%] before:left-[-50%] before:origin-bottom-right before:animate-line-animation after:absolute after:w-full after:max-w-lg after:h-[490px] after:bg-gradient-to-t after:from-transparent after:via-cyan-300 after:to-cyan-300 after:top-[-50%] after:left-[-50%] after:origin-bottom-right after:animate-line-animation after:animation-delay-10">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col px-10 py-8 absolute z-10 inset-1 bg-black rounded-md"
          >
            <h2 className="text-cyan-300 mb-10 text-3xl font-medium text-center tracking-widest">
              Let's get started
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
            <div className="relative mt-2 group">
              <span className="text-gray-300 group-hover:text-cyan-300 text-2xl select-none transition-colors">
                Role:{" "}
              </span>
              <select
                defaultValue={UserRole.Listener}
                {...register("role", { required: "Role is required." })}
                className="text-gray-300 bg-transparent tracking-wider rounded-md px-8 py-1 focus:outline-none shadow-sm"
              >
                {Object.keys(UserRole).map((role, index) => (
                  <option key={index} className="bg-cyan-500" value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-between my-3">
              <Link
                className="text-gray-400 hover:text-cyan-400 hover:underline"
                to="/forgot-password"
              >
                &larr; Forgot Password
              </Link>
              <Link
                className="text-cyan-300 hover:text-cyan-400 hover:underline transition-all"
                to="/"
              >
                Go Login &rarr;
              </Link>
            </div>

            <Button
              canClick={isValid}
              loading={loading}
              actionText="Create Account"
            />
            {createAccountMutationResult?.createAccount.error && (
              <div className="mt-2">
                <FormError
                  errorMessage={createAccountMutationResult.createAccount.error}
                />
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};
