import { useMutation } from "@tanstack/react-query";
import { WithDraw } from "../withdraw";

const useWithDrwaw = (
  onSuccess: (data: any) => void,
  onError: (err: string) => void,
) => {
  return useMutation({
    mutationFn: WithDraw,
    onSuccess: onSuccess,
    onError: onError,
  });
};

export default useWithDrwaw;
