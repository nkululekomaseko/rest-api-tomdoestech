import axios from "axios";

const fetcher = async <T>(url: string, headers: {}): Promise<T> => {
  const axiosResponse = await axios.get<T>(url, {
    headers,
    withCredentials: true,
  });
  return axiosResponse.data;
};

export default fetcher;
