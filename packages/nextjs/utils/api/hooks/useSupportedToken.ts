import { useQuery } from "@tanstack/react-query";
import api from "..";

async function fetchSupportedTokens(): Promise<any> {
  return await api.get("game/supported-tokens");
}

const useSupportedToken = () => {
  return useQuery({
    queryKey: ["supportedTokens"],
    queryFn: fetchSupportedTokens,
  });
};

export default useSupportedToken;
