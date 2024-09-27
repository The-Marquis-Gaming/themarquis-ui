import { useMutation } from "@tanstack/react-query";
import { signUp } from "~~/utils/api/signup";

const useSignup = (
  onSuccess: (data: any) => void,
  onError: (err: string) => void,
) => {
  return useMutation({
    mutationFn: signUp,
    onSuccess: onSuccess,
    onError: onError,
  });
};

export default useSignup;
