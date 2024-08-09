import { useMutation } from "@tanstack/react-query";
import { subscribe } from "~~/utils/api/mail";

const useSubscribe = (
  onSuccess: (data: any) => void,
  onError: (err: string) => void,
) => {
  return useMutation({
    mutationFn: subscribe,
    onSuccess: onSuccess,
    onError: onError,
  });
};

export default useSubscribe;
