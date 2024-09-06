import { useMutation } from "@tanstack/react-query";
import { Logout } from "~~/utils/api/logout";

const useLogout = (
  onSuccess: (data: any) => void,
  onError: (err: string) => void,
) => {
  return useMutation({
    mutationFn: Logout,
    onSuccess: onSuccess,
    onError: onError,
  });
};

export default useLogout;
