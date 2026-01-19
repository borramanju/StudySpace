/**
 * ===============================================
 * LAYOUT COMPONENT
 * ===============================================
 * 
 * WHAT THIS FILE DOES:
 * - Provides consistent page structure across the app
 * - Contains the sidebar navigation
 * - Contains the header with search and user menu
 * - Uses Outlet to render child routes
 * 
 * LAYOUT STRUCTURE:
 * ┌─────────────────────────────────────────────┐
 * │  Header (Search, Notifications, User Menu)  │
 * ├─────────┬───────────────────────────────────┤
 * │         │                                   │
 * │ Sidebar │      Main Content Area            │
 * │  (Nav)  │      (Pages render here)          │
 * │         │                                   │
 * └─────────┴───────────────────────────────────┘
 * 
 * OUTLET EXPLAINED:
 * <Outlet /> is a React Router component that renders
 * the matched child route. Think of it as a "slot" where
 * the page content goes.
 */

import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWorkspace } from '../contexts/WorkspaceContext';

/**
 * NAVIGATION ITEMS
 * ----------------
 * Define all navigation links in one place for easy management.
 */
const NAV_ITEMS = [
  { path: '/', icon: '📊', label: 'Dashboard', exact: true },
  { path: '/projects', icon: '📁', label: 'Projects' },
  { path: '/documents', icon: '📄', label: 'Documents' },
  { path: '/tasks', icon: '✅', label: 'Tasks' },
  { path: '/chat', icon: '💬', label: 'Team Chat' },
  { path: '/knowledge', icon: '📚', label: 'Knowledge Base' },
  { path: '/ai-assistant', icon: '🤖', label: 'AI Assistant' },
];

const BOTTOM_NAV_ITEMS = [
  { path: '/settings', icon: '⚙️', label: 'Settings' },
];

function Layout() {
  // Get auth context for user info and logout
  const { user, logout } = useAuth();
  const { searchWorkspace } = useWorkspace();
  const navigate = useNavigate();
  
  // Local state for UI
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Sample notifications (would come from backend in production)
  const notifications = [
    { id: 1, text: 'Emma mentioned you in a comment', time: '5 min ago', unread: true },
    { id: 2, text: 'Task "Complete Week 3 Notes" is due tomorrow', time: '1 hour ago', unread: true },
    { id: 3, text: 'New document shared: "CNN Architecture"', time: '3 hours ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  /**
   * HANDLE SEARCH
   * -------------
   * Performs search when user submits the search form.
   */
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const results = searchWorkspace(searchQuery);
      setSearchResults(results);
    }
  };

  /**
   * HANDLE LOGOUT
   * -------------
   * Logs out user and redirects to login page.
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  /**
   * CLOSE SEARCH RESULTS
   * --------------------
   * Clears search and closes results dropdown.
   */
  const closeSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
  };

  return (
    <div className="layout">
      {/* ==================== SIDEBAR ==================== */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Logo / Brand */}
        <div className="sidebar-header">
          <div className="logo">
            {!sidebarCollapsed && (
              <>
                <span className="logo-icon">🎓</span>
                <span className="logo-text">StudySpace</span>
              </>
            )}
            {sidebarCollapsed && <span className="logo-icon">🎓</span>}
          </div>
          <button 
            className="collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {NAV_ITEMS.map(item => (
              <li key={item.path}>
                {/* NavLink automatically adds 'active' class when route matches */}
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  end={item.exact}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Bottom Navigation */}
          <ul className="nav-list nav-bottom">
            {BOTTOM_NAV_ITEMS.map(item => (
              <li key={item.path}>
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Card (at bottom of sidebar) */}
        {!sidebarCollapsed && (
          <div className="sidebar-user">
            <div className="user-avatar">{user?.avatar || '👤'}</div>
            <div className="user-info">
              <span className="user-name">{user?.name || 'User'}</span>
              <span className="user-role">{user?.role || 'viewer'}</span>
            </div>
          </div>
        )}
      </aside>

      {/* ==================== MAIN AREA ==================== */}
      <div className="main-area">
        {/* Header */}
        <header className="header">
          {/* Search Bar */}
          <form className="search-form" onSubmit={handleSearch}>
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search documents, tasks, projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button type="button" className="search-clear" onClick={closeSearch}>
                ✕
              </button>
            )}
            
            {/* Search Results Dropdown */}
            {searchResults && (
              <div className="search-results">
                <div className="search-results-header">
                  <span>Found {searchResults.totalResults} results</span>
                  <button onClick={closeSearch}>Close</button>
                </div>
                
                {searchResults.projects.length > 0 && (
                  <div className="result-section">
                    <h4>Projects</h4>
                    {searchResults.projects.map(p => (
                      <div key={p.id} className="result-item" onClick={() => {
                        navigate('/projects');
                        closeSearch();
                      }}>
                        <span className="result-icon">{p.icon}</span>
                        <span className="result-text">{p.name}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {searchResults.documents.length > 0 && (
                  <div className="result-section">
                    <h4>Documents</h4>
                    {searchResults.documents.map(d => (
                      <div key={d.id} className="result-item" onClick={() => {
                        navigate('/documents');
                        closeSearch();
                      }}>
                        <span className="result-icon">📄</span>
                        <span className="result-text">{d.title}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {searchResults.tasks.length > 0 && (
                  <div className="result-section">
                    <h4>Tasks</h4>
                    {searchResults.tasks.map(t => (
                      <div key={t.id} className="result-item" onClick={() => {
                        navigate('/tasks');
                        closeSearch();
                      }}>
                        <span className="result-icon">✅</span>
                        <span className="result-text">{t.title}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {searchResults.totalResults === 0 && (
                  <div className="no-results">No results found for "{searchQuery}"</div>
                )}
              </div>
            )}
          </form>

          {/* Header Actions */}
          <div className="header-actions">
            {/* Notifications */}
            <div className="notification-wrapper">
              <button 
                className="header-btn notification-btn"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                🔔
                {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
              </button>
              
              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="dropdown-header">
                    <h4>Notifications</h4>
                    <button className="mark-read-btn">Mark all read</button>
                  </div>
                  <ul className="notification-list">
                    {notifications.map(n => (
                      <li key={n.id} className={`notification-item ${n.unread ? 'unread' : ''}`}>
                        <p>{n.text}</p>
                        <span className="notification-time">{n.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="user-menu-wrapper">
              <button 
                className="header-btn user-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <span className="user-avatar-small">{user?.avatar || '👤'}</span>
                <span className="user-name-small">{user?.name || 'User'}</span>
                <span className="dropdown-arrow">▼</span>
              </button>
              
              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="dropdown-user-info">
                    <span className="dropdown-avatar">{user?.avatar || '👤'}</span>
                    <div>
                      <p className="dropdown-name">{user?.name}</p>
                      <p className="dropdown-email">{user?.email}</p>
                    </div>
                  </div>
                  <hr />
                  <button onClick={() => { navigate('/settings'); setShowUserMenu(false); }}>
                    ⚙️ Settings
                  </button>
                  <button onClick={() => { navigate('/ai-assistant'); setShowUserMenu(false); }}>
                    🤖 AI Assistant
                  </button>
                  <hr />
                  <button onClick={handleLogout} className="logout-btn">
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content - Child routes render here */}
        <main className="main-content">
          {/* Outlet renders the matched child route component */}
          <Outlet />
        </main>
      </div>

      {/* Click outside to close dropdowns */}
      {(showUserMenu || showNotifications) && (
        <div 
          className="dropdown-overlay"
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </div>
  );
}

export default Layout;
