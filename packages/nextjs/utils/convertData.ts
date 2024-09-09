export function makePrivateEmail(email: string): string {
  if (email) {
    const [localPart, domain] = email.split("@");
    const visiblePart = localPart.slice(0, 2);
    return `${visiblePart}***@${domain}`;
  } else {
    return "";
  }
}
