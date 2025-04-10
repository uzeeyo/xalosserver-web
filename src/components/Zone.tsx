interface ZoneProps {
  children?: React.ReactNode;
  id: number;
}

function Zone({children, id}: ZoneProps) {
  return (
    <div
      className="h-[12rem] p-2 min-w-32 lg:min-w-48 w-56 bg-gray-800 rounded-lg flex justify-center relative"
    >
      {children}
      <div className="absolute bottom-0 left-1/2 text-xs">{id}</div>
    </div>
  );
}

export default Zone;
