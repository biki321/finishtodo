import { useUser } from "@auth0/nextjs-auth0";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

const Avatar = ({ size }: { size: number }) => {
  const { user } = useUser();
  if (!user) return null;
  return (
    <AvatarPrimitive.Root
      className={`flex justify-center items-center w-${size} h-${size}
    cursor-pointer rounded-full`}
    >
      {user && (
        <AvatarPrimitive.Image
          src={user.picture!}
          alt={user.nickname!}
          className="w-full h-full object-cover rounded-full"
        />
      )}
      <AvatarPrimitive.Fallback
        delayMs={600}
        className="flex justify-center items-center
      w-full h-full bg-white font-medium text-lime-700 rounded-full"
      >
        {user?.nickname?.slice(0, 2).toUpperCase()}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
};

export default Avatar;
