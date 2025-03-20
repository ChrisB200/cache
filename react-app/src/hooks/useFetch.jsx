import { useState, useEffect } from "react";
import { useCache } from "./contexts"
import axios from "axios";

function keyify(key) {
  return key.map((item) => JSON.stringify(item)).join("-")
}

export default function useFetch({ key, initialEnabled=true, cache, ...axiosConfig }) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const { getCache, setCache, deleteCache } = useCache();

  const refetch = (hard = false) => {
    setLoading(true);
    setError(false);
    const cacheKey = keyify(key);
    if (cache?.enabled && getCache(cacheKey) !== undefined && !hard) {
      setResponse(getCache(cacheKey));
      setLoading(false);
      setError(false);
      return;
    }
    axios(axiosConfig)
      .then((response) => {
        setResponse(response);
        if (cache?.enabled) {
          setCache(cacheKey, response);
        }
      })
      .catch((e) => {
        setError(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  function inValidate(invalidationKey) {
    deleteCache(keyify(invalidationKey));
  }

  useEffect(() => {
    if (initialEnabled) {
      refetch();
    }
  }, [])

  useEffect(() => {
    setData(response?.data)
  }, [response])

  return { loading, response, data, error, refetch, inValidate};
}

