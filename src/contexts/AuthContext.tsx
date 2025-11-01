import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "reporter" | "solver" | null;
export type OrganizationType = "government" | "municipality" | "ngo" | "volunteer" | "other" | null;

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  points?: number;
  organizationType?: OrganizationType;
  organizationName?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole, organizationType?: OrganizationType) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  updateUserPoints: (pointsToAdd: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem("civic-hub-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole, organizationType?: OrganizationType) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data - in real app, this would come from API
    const mockUser: User = {
      id: "1",
      email,
      name: email.split("@")[0],
      role,
      points: 100, // Initial points
      organizationType: organizationType || null,
      organizationName: organizationType ? `${organizationType.charAt(0).toUpperCase() + organizationType.slice(1)} Organization` : undefined,
    };
    
    setUser(mockUser);
    localStorage.setItem("civic-hub-user", JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("civic-hub-user");
  };

  const updateUserPoints = (pointsToAdd: number) => {
    if (user) {
      const currentPoints = user.points || 0;
      const updatedUser = {
        ...user,
        points: currentPoints + pointsToAdd
      };
      setUser(updatedUser);
      localStorage.setItem("civic-hub-user", JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    updateUserPoints,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
