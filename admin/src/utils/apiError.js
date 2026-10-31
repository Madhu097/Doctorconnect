export const getFriendlyApiError = (error, fallback) => {
  const status = error?.response?.status;
  if (status === 401 || status === 403) {
    return "Your session has expired. Please sign in again.";
  }
  if (!error?.response) {
    return "Unable to connect to the server. Please try again.";
  }
  return error?.response?.data?.message || fallback;
};
