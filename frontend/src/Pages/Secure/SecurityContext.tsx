import { createContext, useState, type ReactNode } from "react";

interface SecurityContextType {
  authCode: string;
  login: (authCode: string) => void;
  logout: () => void;
}

export default function SecurityContext({ children }: { children: ReactNode }) {
  const [authCode, setAuthCode] = useState("");

  const login = (authCode: string) => setAuthCode(authCode);
  const logout = () => setAuthCode("");

  const authContext = createContext<SecurityContextType | null>(null);

  return (
    <authContext.Provider value={{ authCode, login, logout }}>
      {children}
    </authContext.Provider>
  );
}
