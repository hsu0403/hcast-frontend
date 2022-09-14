interface IFormErrorProps {
  errorMessage: string;
}

export const FormError: React.FC<IFormErrorProps> = ({ errorMessage }) => (
  <span className="font-semibold text-red-500">{errorMessage}</span>
);
