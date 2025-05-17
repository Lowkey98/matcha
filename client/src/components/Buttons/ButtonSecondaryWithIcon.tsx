export default function ButtonSecondaryWithIcon({
  type,
  icon,
  value,
}: {
  type: "button" | "submit";
  icon: React.JSX.Element;
  value: string;
}) {
  return (
    <button
      type={type}
      className="border-grayDark-100 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 bg-white p-3"
    >
      {icon}
      <span className="text-secondary">{value}</span>
    </button>
  );
}
