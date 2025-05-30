import { createContext, useState, type ReactNode } from "react";
import type { REQUEST_FIELDNAMES } from "../../Tools/constants";

export type SecurityContextType = {
  [REQUEST_FIELDNAMES.AUTH_CODE]: string;
  [REQUEST_FIELDNAMES.EXPIRES_AT]: Date;

  login: (authCode: string, expiresAt: Date) => void;
  logout: () => void;
};
export const authContext = createContext<SecurityContextType | null>(null);
export default function SecurityContext({ children }: { children: ReactNode }) {
  const [authCode, setAuthCode] = useState("");
  const [expiresAt, setExpiresAt] = useState(new Date());

  const login = (authCode: string, expiresAt: Date) => {
    setAuthCode(authCode);
    setExpiresAt(expiresAt);
  };
  const logout = () => setAuthCode("");

  return (
    <authContext.Provider value={{ authCode, expiresAt, login, logout }}>
      {children}
    </authContext.Provider>
  );
}
