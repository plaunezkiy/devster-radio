import { useState, useCallback } from "react";

export const useRefreshTokenFetch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (url, authData, applyData) => {
    setLoading(true);
    try {
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authData.access_token,
        },
      });
      if (res.status === 401) {
        window.location.href = `http://${window.location.host}/apps/radio/refresh/${authData.refresh_token}/`;
      }
      const data = await res.json();
      applyData(data);
    } catch (error) {
      setError(error.message);
      console.log(error);
    }
    setLoading(false);
  }, []);

  const putData = useCallback(async (url, authData, body, applyData) => {
    setLoading(true);
    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authData.access_token,
        },
        body: body,
      });
      if (res.status === 401) {
        window.location.href = `http://${window.location.host}/apps/radio/refresh/${authData.refresh_token}/`;
      }
      const data = await res.json();
      applyData(data);
    } catch (error) {
      setError(error.message);
      console.log(error);
    }
    setLoading(false);
  }, []);

  const postData = useCallback(async (url, authData, body, applyData) => {
    setLoading(true);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authData.access_token,
        },
        body: body,
      });
      if (res.status === 401) {
        window.location.href = `http://${window.location.host}/apps/radio/refresh/${authData.refresh_token}/`;
      }
      const data = await res.json();
      applyData(data);
    } catch (error) {
      setError(error.message);
      console.log(error);
    }
    setLoading(false);
  }, []);

  return { loading, error, fetchData, putData, postData };
};
