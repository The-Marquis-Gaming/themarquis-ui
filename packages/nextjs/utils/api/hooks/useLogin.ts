import { useMutation } from "@tanstack/react-query";
import { Login } from "~~/utils/api/login";

const useLogin = (
  onSuccess: (data: any) => void,
  onError: (err: string) => void,
) => {
  return useMutation({
    mutationFn: Login,
    onSuccess: onSuccess,
    onError: onError,
  });
};

export default useLogin;
