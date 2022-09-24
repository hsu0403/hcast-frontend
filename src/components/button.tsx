interface IButtonProps {
  canClick: boolean;
  loading: boolean;
  actionText: string;
}

export const Button: React.FC<IButtonProps> = ({
  actionText,
  canClick,
  loading,
}) => (
  <button
    disabled={!canClick}
    className={`${
      loading ? "pointer-events-none" : ""
    } w-full rounded-md px-5 py-2 text-gray-300 text-lg font-medium focus:outline-none focus:bg-cyan-600 focus:ring-2 focus:ring-cyan-700 focus:ring-offset-2 transition-all ${
      canClick ? "bg-cyan-500 hover:bg-cyan-600" : "bg-cyan-200"
    } `}
  >
    {loading ? "Loading..." : actionText}
  </button>
);
