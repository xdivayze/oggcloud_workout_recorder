import { createContext, useState, type ReactNode } from "react";
import type { REQUEST_FIELDNAMES } from "../../Tools/constants";

export type SecurityContextType = {
  [REQUEST_FIELDNAMES.AUTH_CODE]: string;
  [REQUEST_FIELDNAMES.EXPIRES_AT]: Date;
  [REQUEST_FIELDNAMES.ID]: string;

  login: (authCode: string, expiresAt: Date, id: string) => void;
  logout: () => void;
};
export const authContext = createContext<SecurityContextType | null>(null);
export default function SecurityContext({ children }: { children: ReactNode }) {
  const [authCode, setAuthCode] = useState("");
  const [expiresAt, setExpiresAt] = useState(new Date());
  const [loginID, setId] = useState("");

  const login = (authCode: string, expiresAt: Date, id: string) => {
    setAuthCode(authCode);
    setExpiresAt(expiresAt);
    setId(id);
  };
  const logout = () => setAuthCode("");

  return (
    <authContext.Provider value={{ authCode, expiresAt, login, logout,  loginID }}>
      {children}
    </authContext.Provider>
  );
}
