import api from ".";

export const fetchReferralCode = async () => {
  try {
    const response = await api.get("/referral-code");
    return response.data;
  } catch (err) {
    throw new Error("Failed to fetch referral code info");
  }
};
