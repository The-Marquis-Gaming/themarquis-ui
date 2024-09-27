import { useMutation } from "@tanstack/react-query";
import { Resend } from "~~/utils/api/resend";

const useResend = (
  onSuccess: (data: any) => void,
  onError: (err: string) => void,
) => {
  return useMutation({
    mutationFn: Resend,
    onSuccess: onSuccess,
    onError: onError,
  });
};

export default useResend;
