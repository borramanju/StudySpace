/**
 * ===============================================
 * AI COLLABORATIVE WORKSPACE FOR STUDENTS
 * ===============================================
 * 
 * WHAT THIS FILE DOES:
 * - This is the MAIN entry point of our application
 * - It sets up routing (navigation between pages)
 * - It wraps everything with our global state providers
 * - Think of it as the "skeleton" that holds everything together
 * 
 * KEY CONCEPTS FOR BEGINNERS:
 * 1. React Router - Allows navigation between different pages without page reload
 * 2. Context Providers - Share data across all components (like user info, workspace data)
 * 3. Layout Component - Consistent structure (sidebar, header) across all pages
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import our custom providers (these share data across the app)
import { AuthProvider } from './contexts/AuthContext';
import { WorkspaceProvider } from './contexts/WorkspaceContext';
import { AIProvider } from './contexts/AIContext';

// Import layout and pages
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Documents from './pages/Documents';
import Tasks from './pages/Tasks';
import Chat from './pages/Chat';
import KnowledgeBase from './pages/KnowledgeBase';
import AIAssistant from './pages/AIAssistant';
import Settings from './pages/Settings';
import Login from './pages/Login';

// Import global styles
import './styles/global.css';

/**
 * PROTECTED ROUTE COMPONENT
 * -------------------------
 * This component checks if user is logged in before showing a page.
 * If not logged in → redirect to login page
 * If logged in → show the requested page
 */
function ProtectedRoute({ children }) {
  // In a real app, this would check actual auth state
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

/**
 * MAIN APP COMPONENT
 * ------------------
 * This is the root component that:
 * 1. Wraps everything in providers (for global state)
 * 2. Sets up all the routes (pages) in our app
 */
function App() {
  return (
    // BrowserRouter enables client-side routing
    <BrowserRouter>
      {/* AuthProvider: Makes user authentication data available everywhere */}
      <AuthProvider>
        {/* WorkspaceProvider: Makes workspace/project data available everywhere */}
        <WorkspaceProvider>
          {/* AIProvider: Makes AI functionality available everywhere */}
          <AIProvider>
            {/* Routes define which component shows for which URL */}
            <Routes>
              {/* Public route - anyone can access */}
              <Route path="/login" element={<Login />} />
              
              {/* Protected routes - only logged in users */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                {/* These are nested routes inside Layout */}
                {/* index means this is the default when visiting "/" */}
                <Route index element={<Dashboard />} />
                <Route path="projects" element={<Projects />} />
                <Route path="documents" element={<Documents />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="chat" element={<Chat />} />
                <Route path="knowledge" element={<KnowledgeBase />} />
                <Route path="ai-assistant" element={<AIAssistant />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </AIProvider>
        </WorkspaceProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
