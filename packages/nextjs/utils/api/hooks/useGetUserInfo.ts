import { useQuery } from "@tanstack/react-query";
import { fetchUserInfo } from "~~/utils/api";
import { deleteCookie, getCookie } from "cookies-next";
import { IUserInfo } from "../type";

const useGetUserInfo = () => {
  const accessToken = getCookie("accessToken");

  return useQuery({
    queryKey: ["userInfo"],
    queryFn: async (): Promise<IUserInfo | undefined> => {
      if (!accessToken) {
        throw new Error("Could not found token");
      }
      try {
        const res = await fetchUserInfo();
        return res;
      } catch (err) {
        console.log(err);
        localStorage.clear();
        deleteCookie("accessToken", { path: "/" });
        if (typeof window !== "undefined") {
          window.location.replace("/login");
        } else {
          throw new Error("Redirect to login");
        }
        throw err;
      }
    },
    enabled: !!accessToken,
    staleTime: 5000,
  });
};

export default useGetUserInfo;
