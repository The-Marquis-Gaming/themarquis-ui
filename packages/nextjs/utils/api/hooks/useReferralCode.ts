import { useQuery } from "@tanstack/react-query";
import { fetchReferralCode } from "../referral-code";
import { getCookie } from "cookies-next";
import { IReferralCode } from "../type";

const useReferralCode = () => {
  const accessToken = getCookie("accessToken");
  return useQuery({
    queryKey: ["accessToken"],
    queryFn: async (): Promise<IReferralCode | undefined> => {
      if (!accessToken) {
        throw new Error("Could not found token");
      }
      const res = await fetchReferralCode();
      return res;
    },
    enabled: !!accessToken,
    staleTime: 5000,
  });
};

export default useReferralCode;
