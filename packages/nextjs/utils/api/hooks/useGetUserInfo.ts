import { useQuery } from "@tanstack/react-query";
import { fetchUserInfo } from "~~/utils/api";
import { userInfo } from "../type";
import { getCookie } from "cookies-next";

const useGetUserInfo = () => {
  const accessToken = getCookie("accessToken");

  return useQuery({
    queryKey: ["userInfo"],
    queryFn: async (): Promise<userInfo | undefined> => {
      if (!accessToken) {
        throw new Error("Could not found token");
      }
      const res = await fetchUserInfo();
      return res;
    },
    enabled: !!accessToken,
    staleTime: 5000,
  });
};

export default useGetUserInfo;
