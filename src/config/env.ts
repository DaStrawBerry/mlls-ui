export const ENV = {
  API_URL: process.env.EXPO_PUBLIC_API_URL,
};

if (!ENV.API_URL) {
  throw new Error("Missing EXPO_PUBLIC_API_URL");
}
