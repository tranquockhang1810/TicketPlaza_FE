export const ApiPath = {
  LOGIN: getDefaultPath("users/login"),
  GOOGLE_LOGIN: getDefaultPath("users/auth/google/callback")
};

function getDefaultPath(path) {
  return `${process.env.NEXT_PUBLIC_API_ENDPOINT}/${path}`;
}
  
export default ApiPath;
  