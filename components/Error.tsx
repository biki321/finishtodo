function Error({ msg, emoji }: { msg: string; emoji?: string }) {
  return (
    <div
      className="h-screen flex justify-center items-center
         font-semibold text-lg"
    >
      <p className="flex items-center">
        {msg} <span className="text-3xl">{emoji}</span>
      </p>
    </div>
  );
}

export default Error;
