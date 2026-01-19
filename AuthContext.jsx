/**
 * ===============================================
 * AUTHENTICATION CONTEXT
 * ===============================================
 * 
 * WHAT THIS FILE DOES:
 * - Manages user login/logout state
 * - Stores current user information
 * - Handles role-based access (Admin, Editor, Viewer)
 * 
 * WHAT IS CONTEXT?
 * ----------------
 * Think of Context like a "global variable" in React.
 * Instead of passing data through every component (prop drilling),
 * Context lets any component access the data directly.
 * 
 * Example without Context:
 *   App → Header → UserMenu → UserName (pass user through each!)
 * 
 * With Context:
 *   App (provides user) ... UserName (uses user directly!)
 * 
 * ROLES EXPLAINED:
 * - Admin: Full access - can manage users, delete projects, change settings
 * - Editor: Can create/edit content, but can't manage users or settings
 * - Viewer: Read-only access - can view but not modify anything
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

// Step 1: Create the context (like creating an empty container)
const AuthContext = createContext(null);

/**
 * SAMPLE USERS DATABASE
 * ---------------------
 * In a real app, this would be in your backend database.
 * For learning purposes, we're using a simple array.
 */
const SAMPLE_USERS = [
  {
    id: '1',
    email: 'admin@student.edu',
    password: 'admin123', // In real app: NEVER store plain text passwords!
    name: 'Alex Admin',
    role: 'admin',
    avatar: '👩‍💼',
    department: 'Computer Science',
    joinedAt: '2024-01-15'
  },
  {
    id: '2',
    email: 'editor@student.edu',
    password: 'editor123',
    name: 'Emma Editor',
    role: 'editor',
    avatar: '👨‍🎓',
    department: 'Data Science',
    joinedAt: '2024-02-20'
  },
  {
    id: '3',
    email: 'viewer@student.edu',
    password: 'viewer123',
    name: 'Victor Viewer',
    role: 'viewer',
    avatar: '👩‍🎓',
    department: 'Business',
    joinedAt: '2024-03-10'
  }
];

/**
 * AUTH PROVIDER COMPONENT
 * -----------------------
 * This component wraps our entire app and provides authentication data.
 * Any component inside can access user info, login/logout functions, etc.
 */
export function AuthProvider({ children }) {
  // State to track current user (null = not logged in)
  const [user, setUser] = useState(null);
  
  // State to track if we're checking authentication (loading)
  const [loading, setLoading] = useState(true);
  
  // State for error messages
  const [error, setError] = useState(null);

  /**
   * CHECK EXISTING SESSION
   * ----------------------
   * When app loads, check if user was previously logged in.
   * useEffect with empty array [] runs once when component mounts.
   */
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check localStorage for saved user session
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (err) {
        console.error('Error checking auth:', err);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  /**
   * LOGIN FUNCTION
   * --------------
   * Validates credentials and sets user state.
   * Returns true if successful, false if failed.
   */
  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    
    try {
      // Simulate API delay (remove in real app)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find user with matching credentials
      const foundUser = SAMPLE_USERS.find(
        u => u.email === email && u.password === password
      );
      
      if (foundUser) {
        // Remove password before storing (security!)
        const userWithoutPassword = { ...foundUser };
        delete userWithoutPassword.password;
        
        // Save to state and localStorage
        setUser(userWithoutPassword);
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        localStorage.setItem('isAuthenticated', 'true');
        
        return { success: true };
      } else {
        setError('Invalid email or password');
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * LOGOUT FUNCTION
   * ---------------
   * Clears user state and localStorage.
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
  };

  /**
   * PERMISSION CHECK HELPERS
   * ------------------------
   * These functions check if current user has certain permissions.
   * Makes it easy to show/hide features based on role.
   */
  
  // Check if user is admin
  const isAdmin = () => user?.role === 'admin';
  
  // Check if user can edit (admin or editor)
  const canEdit = () => ['admin', 'editor'].includes(user?.role);
  
  // Check if user can only view
  const isViewer = () => user?.role === 'viewer';
  
  // Check specific permission
  const hasPermission = (permission) => {
    const permissions = {
      admin: ['manage_users', 'delete_projects', 'edit_settings', 'create', 'edit', 'view', 'delete'],
      editor: ['create', 'edit', 'view'],
      viewer: ['view']
    };
    
    return permissions[user?.role]?.includes(permission) || false;
  };

  /**
   * UPDATE USER PROFILE
   * -------------------
   * Allows users to update their own profile information.
   */
  const updateProfile = async (updates) => {
    try {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Prepare the value object that will be shared with all components
  const value = {
    // Data
    user,
    loading,
    error,
    
    // Actions
    login,
    logout,
    updateProfile,
    
    // Permission helpers
    isAdmin,
    canEdit,
    isViewer,
    hasPermission,
    
    // Auth state check
    isAuthenticated: !!user
  };

  // Provide the value to all children components
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * CUSTOM HOOK: useAuth
 * --------------------
 * This is a shortcut to access the AuthContext.
 * Instead of: const auth = useContext(AuthContext)
 * We can do: const { user, login } = useAuth()
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

export default AuthContext;
