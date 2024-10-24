"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";

// Define the types for user data, context, and provider props
interface User {
  id: number;
  name: string;
  email: string;
  // Add more fields as needed
}

interface UserContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (userData: User) => void;
}

interface UserProviderProps {
  children: ReactNode;
}

// Create the context
export const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  // Only access localStorage in useEffect to avoid SSR issues
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
      }
    }
  }, []);

  // Save user data to localStorage when `user` state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
