/**
 * ===============================================
 * DASHBOARD PAGE
 * ===============================================
 * 
 * WHAT THIS FILE DOES:
 * - Shows overview of workspace activity
 * - Displays recent projects, tasks, and documents
 * - Shows quick stats and metrics
 * - Provides quick actions for common tasks
 * - Integrates AI suggestions and insights
 * 
 * DASHBOARD BEST PRACTICES:
 * ------------------------
 * 1. Show most important information first
 * 2. Use visual hierarchy (larger = more important)
 * 3. Include actionable items (not just data)
 * 4. Keep it scannable (users glance, not read)
 * 5. Personalize where possible
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { useAI } from '../contexts/AIContext';

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { projects, documents, tasks } = useWorkspace();
  const { getSmartSuggestions, isProcessing } = useAI();
  
  // Local state
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [greeting, setGreeting] = useState('');

  /**
   * SET GREETING BASED ON TIME
   * --------------------------
   * Personalizes the experience with time-appropriate greeting.
   */
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  /**
   * LOAD AI SUGGESTIONS
   * -------------------
   * Fetches personalized suggestions on mount.
   */
  useEffect(() => {
    const loadSuggestions = async () => {
      const result = await getSmartSuggestions('project', { projects, tasks });
      if (result.success) {
        setAiSuggestions(result.suggestions);
      }
    };
    loadSuggestions();
  }, [getSmartSuggestions, projects, tasks]);

  // ===============
  // CALCULATE STATS
  // ===============
  
  const stats = {
    totalProjects: projects.length,
    totalDocuments: documents.length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    pendingTasks: tasks.filter(t => t.status !== 'completed').length,
    highPriorityTasks: tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length
  };

  const completionRate = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
    : 0;

  // Get recent items
  const recentDocuments = [...documents]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 3);

  const upcomingTasks = [...tasks]
    .filter(t => t.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 4);

  // =================
  // HELPER FUNCTIONS
  // =================

  /**
   * FORMAT DATE
   * Converts date to human-readable format.
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  /**
   * GET PRIORITY COLOR
   */
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'var(--color-danger)';
      case 'medium': return 'var(--color-warning)';
      case 'low': return 'var(--color-success)';
      default: return 'var(--color-muted)';
    }
  };

  /**
   * GET STATUS ICON
   */
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in-progress': return '🔄';
      case 'todo': return '📋';
      default: return '📌';
    }
  };

  return (
    <div className="dashboard">
      {/* ==================== WELCOME SECTION ==================== */}
      <section className="welcome-section">
        <div className="welcome-content">
          <h1>{greeting}, {user?.name?.split(' ')[0] || 'there'}! 👋</h1>
          <p>Here's what's happening in your workspace today.</p>
        </div>
        <div className="quick-actions">
          <button className="action-btn primary" onClick={() => navigate('/documents')}>
            <span>📄</span> New Document
          </button>
          <button className="action-btn" onClick={() => navigate('/tasks')}>
            <span>✅</span> Add Task
          </button>
          <button className="action-btn" onClick={() => navigate('/ai-assistant')}>
            <span>🤖</span> Ask AI
          </button>
        </div>
      </section>

      {/* ==================== STATS CARDS ==================== */}
      <section className="stats-section">
        <div className="stat-card">
          <div className="stat-icon">📁</div>
          <div className="stat-content">
            <span className="stat-value">{stats.totalProjects}</span>
            <span className="stat-label">Active Projects</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📄</div>
          <div className="stat-content">
            <span className="stat-value">{stats.totalDocuments}</span>
            <span className="stat-label">Documents</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <span className="stat-value">{stats.completedTasks}/{stats.totalTasks}</span>
            <span className="stat-label">Tasks Completed</span>
          </div>
          <div className="stat-progress">
            <div 
              className="progress-fill" 
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>
        
        <div className="stat-card highlight">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <span className="stat-value">{stats.highPriorityTasks}</span>
            <span className="stat-label">High Priority</span>
          </div>
        </div>
      </section>

      {/* ==================== MAIN GRID ==================== */}
      <div className="dashboard-grid">
        {/* Left Column */}
        <div className="dashboard-main">
          {/* Recent Documents */}
          <section className="dashboard-card">
            <div className="card-header">
              <h2>📄 Recent Documents</h2>
              <button className="see-all-btn" onClick={() => navigate('/documents')}>
                See all →
              </button>
            </div>
            <div className="documents-list">
              {recentDocuments.map(doc => {
                const project = projects.find(p => p.id === doc.projectId);
                return (
                  <div key={doc.id} className="document-item">
                    <div className="doc-icon">📝</div>
                    <div className="doc-content">
                      <h3>{doc.title}</h3>
                      <p>
                        <span className="project-tag" style={{ backgroundColor: project?.color + '20', color: project?.color }}>
                          {project?.name || 'Unknown Project'}
                        </span>
                        <span className="doc-meta">Updated {formatDate(doc.updatedAt)}</span>
                      </p>
                    </div>
                    <span className="doc-version">v{doc.version}</span>
                  </div>
                );
              })}
              {recentDocuments.length === 0 && (
                <p className="empty-state">No documents yet. Create your first document!</p>
              )}
            </div>
          </section>

          {/* Project Overview */}
          <section className="dashboard-card">
            <div className="card-header">
              <h2>📁 Your Projects</h2>
              <button className="see-all-btn" onClick={() => navigate('/projects')}>
                Manage →
              </button>
            </div>
            <div className="projects-grid">
              {projects.slice(0, 3).map(project => {
                const projectTasks = tasks.filter(t => t.projectId === project.id);
                const completedCount = projectTasks.filter(t => t.status === 'completed').length;
                const progress = projectTasks.length > 0 
                  ? Math.round((completedCount / projectTasks.length) * 100)
                  : 0;
                
                return (
                  <div 
                    key={project.id} 
                    className="project-card"
                    style={{ borderLeftColor: project.color }}
                    onClick={() => navigate('/projects')}
                  >
                    <div className="project-header">
                      <span className="project-icon">{project.icon}</span>
                      <span className="project-status">{project.status}</span>
                    </div>
                    <h3>{project.name}</h3>
                    <p className="project-desc">{project.description}</p>
                    <div className="project-footer">
                      <div className="project-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${progress}%`, backgroundColor: project.color }}
                          ></div>
                        </div>
                        <span>{progress}% complete</span>
                      </div>
                      <div className="project-members">
                        {project.members.slice(0, 3).map((_, i) => (
                          <span key={i} className="member-dot"></span>
                        ))}
                        {project.members.length > 3 && (
                          <span className="member-more">+{project.members.length - 3}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="dashboard-sidebar">
          {/* Upcoming Tasks */}
          <section className="dashboard-card">
            <div className="card-header">
              <h2>📋 Upcoming Tasks</h2>
              <button className="see-all-btn" onClick={() => navigate('/tasks')}>
                View all →
              </button>
            </div>
            <div className="tasks-list">
              {upcomingTasks.map(task => (
                <div key={task.id} className="task-item">
                  <span className="task-status">{getStatusIcon(task.status)}</span>
                  <div className="task-content">
                    <h4>{task.title}</h4>
                    <div className="task-meta">
                      <span 
                        className="priority-badge"
                        style={{ backgroundColor: getPriorityColor(task.priority) + '20', color: getPriorityColor(task.priority) }}
                      >
                        {task.priority}
                      </span>
                      <span className="due-date">Due: {formatDate(task.dueDate)}</span>
                    </div>
                  </div>
                </div>
              ))}
              {upcomingTasks.length === 0 && (
                <p className="empty-state">No pending tasks. Great job! 🎉</p>
              )}
            </div>
          </section>

          {/* AI Insights */}
          <section className="dashboard-card ai-insights">
            <div className="card-header">
              <h2>🤖 AI Insights</h2>
              <span className="ai-badge">Powered by AI</span>
            </div>
            <div className="insights-list">
              {isProcessing ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Analyzing your workspace...</p>
                </div>
              ) : (
                aiSuggestions.map((suggestion, index) => (
                  <div key={index} className="insight-item">
                    <span className="insight-icon">💡</span>
                    <p>{suggestion}</p>
                  </div>
                ))
              )}
            </div>
            <button 
              className="ask-ai-btn"
              onClick={() => navigate('/ai-assistant')}
            >
              Ask AI for Help →
            </button>
          </section>

          {/* Activity Feed */}
          <section className="dashboard-card">
            <div className="card-header">
              <h2>📢 Recent Activity</h2>
            </div>
            <div className="activity-feed">
              <div className="activity-item">
                <span className="activity-icon">📝</span>
                <div className="activity-content">
                  <p><strong>Emma</strong> edited "CNNs Explained"</p>
                  <span className="activity-time">2 hours ago</span>
                </div>
              </div>
              <div className="activity-item">
                <span className="activity-icon">✅</span>
                <div className="activity-content">
                  <p><strong>Alex</strong> completed "Setup Python Environment"</p>
                  <span className="activity-time">5 hours ago</span>
                </div>
              </div>
              <div className="activity-item">
                <span className="activity-icon">💬</span>
                <div className="activity-content">
                  <p><strong>Victor</strong> commented on "Week 1 Notes"</p>
                  <span className="activity-time">Yesterday</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
