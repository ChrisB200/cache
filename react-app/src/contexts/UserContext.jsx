import { useState, useEffect } from "react";
import { createContext } from "react";
import httpClient from "../utils/httpClient";
import { BASE_API_URL } from "../utils/constants";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUser = () => {
    httpClient
      .get(`${BASE_API_URL}/profile`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{user, setUser}}>
      {children}
    </UserContext.Provider>
  );
};
