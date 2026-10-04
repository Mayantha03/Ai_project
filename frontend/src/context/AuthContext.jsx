import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const mockUsers = {
  admin: {
    id: 1,
    name: "Campus Resource Administrator",
    role: "ADMIN",
    email: "admin@kdu.ac.lk",
    username: "admin",
    password: "123"
  },
  lecturer: {
    id: 2,
    name: "Dr. Nimal Perera",
    role: "LECTURER",
    department: "Software Engineering & AI",
    faculty: "Computing",
    email: "perera.n@kdu.ac.lk",
    username: "lecturer",
    password: "123"
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
    username: "student",
    password: "123"
  }
};

export const AuthProvider = ({ children }) => {
  const [usersDB, setUsersDB] = useState(() => {
    const savedDB = localStorage.getItem('smartCampusUsersDB');
    return savedDB ? JSON.parse(savedDB) : mockUsers;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('smartCampusUser');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (username, password) => {
    const user = Object.values(usersDB).find(
      u => u.username === username && u.password === password
    );
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('smartCampusUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const signup = (userData) => {
    // Generate a unique key for the new user based on username
    const userKey = userData.username.toLowerCase();
    
    // Check if username already exists
    if (Object.values(usersDB).some(u => u.username === userData.username)) {
      return { success: false, message: "Username already taken." };
    }

    const newUser = {
      ...userData,
      id: Date.now() // Mock ID
    };

    const updatedDB = {
      ...usersDB,
      [userKey]: newUser
    };

    setUsersDB(updatedDB);
    localStorage.setItem('smartCampusUsersDB', JSON.stringify(updatedDB));

    // Auto login after signup
    setCurrentUser(newUser);
    localStorage.setItem('smartCampusUser', JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('smartCampusUser');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, signup, mockUsers: usersDB }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
