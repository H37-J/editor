import React, { createContext, ReactNode, useContext, useState } from 'react';
import { UserType } from '@/types/type';

type UserContextType = {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({
  children,
} : {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<UserType | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType | null => {
  const context = useContext(UserContext);
  if(context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}