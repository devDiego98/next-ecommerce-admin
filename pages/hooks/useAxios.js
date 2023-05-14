import { useState, useEffect } from "react";
import axios from "axios";

export default function useAxios(url, method = "get", body = null) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shouldFetch, setShouldFetch] = useState(false);
  const fetchData = async () => {
    try {
      const config = { method, url };
      if (["post", "put"].includes(method)) {
        config.data = body;
      }
      const response = await axios(config);
      setData(response.data);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchData();

    if (shouldFetch) {
      setLoading(true);
      setError(null);
      setData(null);
      fetchData();
      setShouldFetch(false);
    }
  }, [url, method, body, shouldFetch]);

  const refetch = () => {
    setShouldFetch(true);
  };

  return { data, loading, error, refetch };
}
