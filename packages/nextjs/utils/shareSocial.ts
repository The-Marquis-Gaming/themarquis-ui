export const shareToTwitter = (url: string) => {
  const shareURL = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
  window.open(shareURL, "_blank", "noopener,noreferrer");
};

export const chooseAppToShare = async (url: string) => {
  if (navigator.share) {
    try {
      await navigator.share({
        url: url,
      });
    } catch (error) {
      console.error("Share failure", error);
    }
  } else {
    window.alert("Your browser do not support this actions");
  }
};
