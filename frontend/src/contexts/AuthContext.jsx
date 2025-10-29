// import React, { createContext, useState, useContext, useEffect } from 'react';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const userData = localStorage.getItem('user');
    
//     if (token && userData) {
//       setUser(JSON.parse(userData));
//       // Verify token with backend
//       verifyToken(token);
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const verifyToken = async (token) => {
//     try {
//       const response = await fetch('http://localhost:5000/api/user/profile', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       if (!response.ok) {
//         throw new Error('Token invalid');
//       }
      
//       const data = await response.json();
//       setUser(data.user);
//     } catch (error) {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const signUp = async (userData) => {
//     const response = await fetch('http://localhost:5000/api/auth/signup', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(userData),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.error);
//     }

//     localStorage.setItem('token', data.token);
//     localStorage.setItem('user', JSON.stringify(data.user));
//     setUser(data.user);

//     return data;
//   };

//   const signIn = async (credentials) => {
//     const response = await fetch('http://localhost:5000/api/auth/signin', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(credentials),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.error);
//     }

//     localStorage.setItem('token', data.token);
//     localStorage.setItem('user', JSON.stringify(data.user));
//     setUser(data.user);

//     return data;
//   };

//   const demoLogin = async () => {
//     const response = await fetch('http://localhost:5000/api/auth/demo', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.error);
//     }

//     localStorage.setItem('token', data.token);
//     localStorage.setItem('user', JSON.stringify(data.user));
//     setUser(data.user);

//     return data;
//   };

//   const signOut = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setUser(null);
//   };

//   const value = {
//     user,
//     signUp,
//     signIn,
//     demoLogin,
//     signOut,
//     loading
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Token invalid');
      }
      
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (userData) => {
    const response = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);

    return data;
  };

  const signIn = async (credentials) => {
    const response = await fetch('http://localhost:5000/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);

    return data;
  };

  const demoLogin = async () => {
    const response = await fetch('http://localhost:5000/api/auth/demo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);

    return data;
  };

  const signOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    signUp,
    signIn,
    demoLogin,
    signOut,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};