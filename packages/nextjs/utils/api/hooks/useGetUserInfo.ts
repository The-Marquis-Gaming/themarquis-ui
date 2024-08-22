import { useQueryClient, useQuery } from "@tanstack/react-query";
import { fetchUserInfo } from "~~/utils/api";
import { userInfo } from "../type";


    const useGetUserInfo = () => {
        const queryClient = useQueryClient();
        const accessToken = queryClient.getQueryData<string>(["accessToken"]) || "";
      
        return useQuery({
          queryKey: ["accessToken"],
          queryFn: async (): Promise<userInfo | undefined> => {
            const res = await fetchUserInfo(accessToken);
            return res;
          },
          enabled: !!accessToken, 
          staleTime: 5000,
        });
      };
      
      export default useGetUserInfo;
      
