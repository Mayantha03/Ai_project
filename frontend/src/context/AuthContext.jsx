import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const mockUsers = {
  admin: {
    id: 1,
    name: "Campus Resource Administrator",
    role: "ADMIN",
    email: "admin@kdu.ac.lk",
    avatar: "👑"
  },
  lecturer: {
    id: 2,
    name: "Dr. Nimal Perera",
    role: "LECTURER",
    department: "Software Engineering & AI",
    faculty: "Computing",
    email: "perera.n@kdu.ac.lk",
    avatar: "👨‍🏫"
  },
  student: {
    id: 4,
    name: "Kasun Bandara",
    role: "STUDENT",
    regNo: "D-COE-25-0023",
    degree: "BSc (Hons) in Computer Engineering",
    intake: "Intake 42",
    faculty: "Computing",
    email: "d-coe-25-0023@kdu.ac.lk",
    avatar: "🎓"
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(mockUsers.admin);

  const switchRole = (roleKey) => {
    if (mockUsers[roleKey]) {
      setCurrentUser(mockUsers[roleKey]);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, switchRole, mockUsers }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
