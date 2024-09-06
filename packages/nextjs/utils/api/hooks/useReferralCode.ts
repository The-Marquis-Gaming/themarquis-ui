import { useQueryClient, useQuery } from "@tanstack/react-query";
import { fetchReferralCode } from "../referral-code";
import { referralCode } from "../type";

const useReferralCode = () => {
  const queryClient = useQueryClient();
  const accessToken = queryClient.getQueryData<string>(["accessToken"]) || "";

  return useQuery({
    queryKey: ["accessToken"],
    queryFn: async (): Promise<referralCode | undefined> => {
      const res = await fetchReferralCode(accessToken);
      return res;
    },
    enabled: !!accessToken,
    staleTime: 5000,
  });
};

export default useReferralCode;
