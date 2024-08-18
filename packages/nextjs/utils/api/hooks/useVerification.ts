import { useMutation } from "@tanstack/react-query";
import { Verification } from "~~/utils/api/verification";

const useVerification = (
  onSuccess: (data: any) => void,
  onError: (err: string) => void,
) => {
  return useMutation({
    mutationFn: Verification,
    onSuccess: onSuccess,
    onError: onError,
  });
};

export default useVerification;
