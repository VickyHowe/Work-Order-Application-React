import axios from "axios";

const useApi = () => {
  const apiCall = async (url, method = "get", data = {}) => {
    const response = await axios({
      method,
      url: `${import.meta.env.VITE_BACKEND_URL}${url}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data,
    });
    return response.data;
  };

  return { apiCall };
};

export default useApi;