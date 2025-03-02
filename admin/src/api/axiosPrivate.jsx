import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL

export const customAxios = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
});

const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true
});

axiosPrivate.interceptors.request.use((config) => {

  const token = localStorage.getItem("token_admin");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor: Handle expired tokens
axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is due to token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Avoid infinite retry loop

      try {

        const refreshResponse = await axios.post(
          `${BASE_URL}/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token_admin")}`,
            },
          }
        );

        const newToken = refreshResponse.data.token_admin;

        localStorage.setItem("token_admin", newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosPrivate(originalRequest);
      } catch (refreshError) {
        console.log(refreshError);
        //localStorage.removeItem("token_admin");
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosPrivate;
