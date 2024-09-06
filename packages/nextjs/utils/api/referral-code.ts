import api from ".";

export const fetchReferralCode = async (token: string) => {
  const response = await api.get("/referral_code", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
