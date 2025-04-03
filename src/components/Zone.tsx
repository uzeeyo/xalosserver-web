interface ZoneProps {
  children?: React.ReactNode;
}

function Zone({children }: ZoneProps) {
  return (
    <div
      className="h-[12rem] p-2 min-w-32 lg:min-w-48 w-56 bg-gray-800 rounded-lg flex justify-center"
    >
      {children}
    </div>
  );
}

export default Zone;
