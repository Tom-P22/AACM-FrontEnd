export const DEFAULT_AVATAR = "/img/avatar-default.svg";
export const MAX_AVATAR_BYTES = 300 * 1024;

export function validAvatar(value) {
  if (typeof value === "string" && value.startsWith("https://")) {
    try { const url = new URL(value); return !url.username && !url.password && value.length <= 2048; }
    catch { return false; }
  }
  return value === "" || value === DEFAULT_AVATAR ||
    (typeof value === "string" && value.length <= MAX_AVATAR_BYTES * 4 / 3 + 100 &&
      /^data:image\/(png|jpeg|webp);base64,[a-zA-Z0-9+/]+={0,2}$/.test(value));
}
