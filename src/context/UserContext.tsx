import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserContextType, Employee } from '../types';
import mockEmployees from '../data/mockEmployees.json';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [department, setDepartment] = useState('');

  useEffect(() => {
    // Set default user to first employee
    const defaultUser = (mockEmployees as Employee[])[0];
    setCurrentUser(defaultUser);
    setDepartment(defaultUser.department);
  }, []);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        department,
        setDepartment,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};
