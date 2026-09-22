import ImageKit from "imagekit";

let imagekitInstance = null;

export function getImageKit() {
  if (!imagekitInstance) {
    const publicKey =
      process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ||
      process.env.IMAGEKIT_PUBLIC_KEY ||
      "";
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || "";
    const urlEndpoint =
      process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ||
      process.env.IMAGEKIT_URL_ENDPOINT ||
      "";

    if (!publicKey || !privateKey || !urlEndpoint) {
      console.warn(
        "ImageKit initialization warning: missing ImageKit environment variables."
      );
    }

    imagekitInstance = new ImageKit({
      publicKey: publicKey || "placeholder_public_key",
      privateKey: privateKey || "placeholder_private_key",
      urlEndpoint: urlEndpoint || "https://ik.imagekit.io/placeholder",
    });
  }
  return imagekitInstance;
}

const imagekit = new Proxy(
  {},
  {
    get(_target, prop) {
      const instance = getImageKit();
      const value = instance[prop];
      if (typeof value === "function") {
        return value.bind(instance);
      }
      return value;
    },
  }
);

export default imagekit;
