export function makePrivateEmail(email: string): string {
  if (email) {
    const [localPart, domain] = email.split("@");
    const visiblePart = localPart.slice(0, 2);
    return `${visiblePart}***@${domain}`;
  } else {
    return "";
  }
}

export function makeStringPrivate(str: string) {
  if (str.length <= 9) {
    return str;
  }
  const start = str.substring(0, 5);
  const end = str.substring(str.length - 4);
  return `${start}...${end}`;
}
