import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { syncUser } from "../lib/api";

// the best way to implement this is by using webhooks
function useUserSync() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const hasSynced = useRef(false);

  const { mutate: syncUserMutation, isPending, isSuccess } = useMutation({ 
    mutationFn: syncUser,
    onSuccess: () => {
      hasSynced.current = true;
    }
  });

  useEffect(() => {
    if (isSignedIn && user && !isPending && !isSuccess && !hasSynced.current) {
      syncUserMutation({
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName || user.firstName,
        imageUrl: user.imageUrl,
      });
    }
  }, [isSignedIn, user, isPending, isSuccess]);

  return { isSynced: isSuccess };
}

export default useUserSync;