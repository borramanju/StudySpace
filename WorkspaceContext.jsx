/**
 * ===============================================
 * WORKSPACE CONTEXT
 * ===============================================
 * 
 * WHAT THIS FILE DOES:
 * - Manages all workspace data: projects, documents, tasks
 * - Handles real-time collaboration state
 * - Provides CRUD operations (Create, Read, Update, Delete)
 * - Manages team members and permissions
 * 
 * DATA STRUCTURE OVERVIEW:
 * ------------------------
 * Workspace
 *   └── Projects (containers for related work)
 *         ├── Documents (files, notes, articles)
 *         ├── Tasks (to-dos, assignments)
 *         └── Team Members (collaborators)
 * 
 * REAL-TIME COLLABORATION:
 * In a production app, you'd use WebSockets or services like:
 * - Socket.io (Node.js)
 * - Firebase Realtime Database
 * - Supabase Realtime
 * - Pusher
 * 
 * For this learning version, we simulate real-time with local state.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

const WorkspaceContext = createContext(null);

/**
 * INITIAL SAMPLE DATA
 * -------------------
 * This represents data that would come from your database.
 * Notice the structure and relationships between entities.
 */
const INITIAL_PROJECTS = [
  {
    id: 'proj-1',
    name: 'Machine Learning Study Group',
    description: 'Collaborative notes and projects for ML course',
    color: '#6366f1', // Indigo
    icon: '🤖',
    createdAt: '2024-01-15',
    updatedAt: '2024-03-20',
    ownerId: '1',
    members: ['1', '2', '3'],
    status: 'active',
    tags: ['machine-learning', 'python', 'course']
  },
  {
    id: 'proj-2',
    name: 'Capstone Project - AI Chatbot',
    description: 'Final year project building an educational chatbot',
    color: '#10b981', // Emerald
    icon: '💬',
    createdAt: '2024-02-01',
    updatedAt: '2024-03-18',
    ownerId: '2',
    members: ['1', '2'],
    status: 'active',
    tags: ['capstone', 'nlp', 'chatbot']
  },
  {
    id: 'proj-3',
    name: 'Research Paper - Deep Learning',
    description: 'Collaborative research paper on transformer architectures',
    color: '#f59e0b', // Amber
    icon: '📝',
    createdAt: '2024-02-15',
    updatedAt: '2024-03-15',
    ownerId: '1',
    members: ['1', '2', '3'],
    status: 'active',
    tags: ['research', 'deep-learning', 'transformers']
  }
];

const INITIAL_DOCUMENTS = [
  {
    id: 'doc-1',
    projectId: 'proj-1',
    title: 'Week 1 - Introduction to Neural Networks',
    content: '# Neural Networks Fundamentals\n\n## What is a Neural Network?\n\nA neural network is a computational model inspired by biological neurons...\n\n## Key Components\n- Input Layer\n- Hidden Layers\n- Output Layer\n- Activation Functions',
    type: 'markdown',
    createdAt: '2024-01-16',
    updatedAt: '2024-03-10',
    createdBy: '1',
    lastEditedBy: '2',
    tags: ['notes', 'neural-networks'],
    comments: [
      { id: 'c1', userId: '2', text: 'Great summary! Could we add more about backpropagation?', createdAt: '2024-03-11' }
    ],
    version: 5,
    collaborators: ['1', '2']
  },
  {
    id: 'doc-2',
    projectId: 'proj-1',
    title: 'Week 2 - Convolutional Neural Networks',
    content: '# CNNs Explained\n\n## Overview\nConvolutional Neural Networks are specialized for processing grid-like data...\n\n## Architecture\n1. Convolutional Layers\n2. Pooling Layers\n3. Fully Connected Layers',
    type: 'markdown',
    createdAt: '2024-01-23',
    updatedAt: '2024-03-05',
    createdBy: '2',
    lastEditedBy: '1',
    tags: ['notes', 'cnn', 'computer-vision'],
    comments: [],
    version: 3,
    collaborators: ['1', '2', '3']
  },
  {
    id: 'doc-3',
    projectId: 'proj-2',
    title: 'Chatbot Architecture Design',
    content: '# AI Chatbot Architecture\n\n## System Components\n- Frontend (React)\n- Backend (Python FastAPI)\n- AI Model (GPT-based)\n- Vector Database (Pinecone)\n\n## Data Flow\nUser Input → NLP Processing → Intent Recognition → Response Generation → Output',
    type: 'markdown',
    createdAt: '2024-02-05',
    updatedAt: '2024-03-18',
    createdBy: '1',
    lastEditedBy: '1',
    tags: ['architecture', 'design', 'technical'],
    comments: [],
    version: 8,
    collaborators: ['1', '2']
  }
];

const INITIAL_TASKS = [
  {
    id: 'task-1',
    projectId: 'proj-1',
    title: 'Complete Week 3 Notes',
    description: 'Finish summarizing the RNN and LSTM lecture materials',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2024-03-25',
    assigneeId: '2',
    createdBy: '1',
    createdAt: '2024-03-15',
    tags: ['notes', 'rnn'],
    subtasks: [
      { id: 'st-1', title: 'Watch lecture videos', completed: true },
      { id: 'st-2', title: 'Take initial notes', completed: true },
      { id: 'st-3', title: 'Add code examples', completed: false },
      { id: 'st-4', title: 'Create summary diagram', completed: false }
    ],
    comments: []
  },
  {
    id: 'task-2',
    projectId: 'proj-2',
    title: 'Implement User Authentication',
    description: 'Add login/signup functionality with JWT tokens',
    status: 'todo',
    priority: 'high',
    dueDate: '2024-03-28',
    assigneeId: '1',
    createdBy: '2',
    createdAt: '2024-03-10',
    tags: ['backend', 'security'],
    subtasks: [
      { id: 'st-5', title: 'Setup JWT library', completed: false },
      { id: 'st-6', title: 'Create auth endpoints', completed: false },
      { id: 'st-7', title: 'Add password hashing', completed: false }
    ],
    comments: []
  },
  {
    id: 'task-3',
    projectId: 'proj-3',
    title: 'Literature Review - Attention Mechanisms',
    description: 'Research and summarize 10 papers on attention in transformers',
    status: 'todo',
    priority: 'medium',
    dueDate: '2024-04-01',
    assigneeId: '3',
    createdBy: '1',
    createdAt: '2024-03-12',
    tags: ['research', 'reading'],
    subtasks: [],
    comments: []
  },
  {
    id: 'task-4',
    projectId: 'proj-1',
    title: 'Setup Python Environment',
    description: 'Create virtual environment with all required ML libraries',
    status: 'completed',
    priority: 'low',
    dueDate: '2024-03-20',
    assigneeId: '1',
    createdBy: '1',
    createdAt: '2024-03-01',
    tags: ['setup', 'python'],
    subtasks: [],
    comments: []
  }
];

const INITIAL_MESSAGES = [
  {
    id: 'msg-1',
    projectId: 'proj-1',
    channelId: 'general',
    userId: '1',
    content: 'Hey team! I just uploaded the Week 2 notes. Let me know if anything needs clarification.',
    createdAt: '2024-03-15T10:30:00Z',
    reactions: [{ emoji: '👍', userIds: ['2', '3'] }]
  },
  {
    id: 'msg-2',
    projectId: 'proj-1',
    channelId: 'general',
    userId: '2',
    content: 'Thanks! The CNN explanation is really clear. Should we add some practice problems?',
    createdAt: '2024-03-15T10:45:00Z',
    reactions: []
  },
  {
    id: 'msg-3',
    projectId: 'proj-1',
    channelId: 'general',
    userId: '3',
    content: 'Great idea! I can create a quiz based on the material.',
    createdAt: '2024-03-15T11:00:00Z',
    reactions: [{ emoji: '🎉', userIds: ['1', '2'] }]
  }
];

/**
 * WORKSPACE PROVIDER COMPONENT
 * ----------------------------
 * Provides all workspace functionality to the app.
 */
export function WorkspaceProvider({ children }) {
  // State for all workspace data
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  
  // Active/selected items
  const [activeProject, setActiveProject] = useState(null);
  const [activeDocument, setActiveDocument] = useState(null);
  
  // Real-time collaboration state (simulated)
  const [activeCollaborators, setActiveCollaborators] = useState({});
  const [documentLocks, setDocumentLocks] = useState({});

  // ===================
  // PROJECT OPERATIONS
  // ===================
  
  /**
   * CREATE PROJECT
   * Creates a new project with the given data.
   */
  const createProject = useCallback((projectData) => {
    const newProject = {
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
      members: [projectData.ownerId],
      ...projectData
    };
    
    setProjects(prev => [...prev, newProject]);
    return newProject;
  }, []);

  /**
   * UPDATE PROJECT
   * Updates an existing project.
   */
  const updateProject = useCallback((projectId, updates) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, ...updates, updatedAt: new Date().toISOString() }
        : project
    ));
  }, []);

  /**
   * DELETE PROJECT
   * Removes a project and all its contents.
   */
  const deleteProject = useCallback((projectId) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setDocuments(prev => prev.filter(d => d.projectId !== projectId));
    setTasks(prev => prev.filter(t => t.projectId !== projectId));
    setMessages(prev => prev.filter(m => m.projectId !== projectId));
  }, []);

  /**
   * GET PROJECT BY ID
   */
  const getProject = useCallback((projectId) => {
    return projects.find(p => p.id === projectId);
  }, [projects]);

  // ====================
  // DOCUMENT OPERATIONS
  // ====================
  
  /**
   * CREATE DOCUMENT
   */
  const createDocument = useCallback((docData) => {
    const newDoc = {
      id: `doc-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      comments: [],
      collaborators: [docData.createdBy],
      ...docData
    };
    
    setDocuments(prev => [...prev, newDoc]);
    return newDoc;
  }, []);

  /**
   * UPDATE DOCUMENT
   * Also handles version tracking.
   */
  const updateDocument = useCallback((docId, updates, userId) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === docId) {
        return {
          ...doc,
          ...updates,
          updatedAt: new Date().toISOString(),
          lastEditedBy: userId,
          version: doc.version + 1
        };
      }
      return doc;
    }));
  }, []);

  /**
   * DELETE DOCUMENT
   */
  const deleteDocument = useCallback((docId) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
  }, []);

  /**
   * GET DOCUMENTS FOR PROJECT
   */
  const getProjectDocuments = useCallback((projectId) => {
    return documents.filter(d => d.projectId === projectId);
  }, [documents]);

  /**
   * ADD COMMENT TO DOCUMENT
   */
  const addDocumentComment = useCallback((docId, comment) => {
    const newComment = {
      id: `c-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...comment
    };
    
    setDocuments(prev => prev.map(doc => {
      if (doc.id === docId) {
        return {
          ...doc,
          comments: [...doc.comments, newComment]
        };
      }
      return doc;
    }));
    
    return newComment;
  }, []);

  // =================
  // TASK OPERATIONS
  // =================
  
  /**
   * CREATE TASK
   */
  const createTask = useCallback((taskData) => {
    const newTask = {
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'todo',
      subtasks: [],
      comments: [],
      ...taskData
    };
    
    setTasks(prev => [...prev, newTask]);
    return newTask;
  }, []);

  /**
   * UPDATE TASK
   */
  const updateTask = useCallback((taskId, updates) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    ));
  }, []);

  /**
   * DELETE TASK
   */
  const deleteTask = useCallback((taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  }, []);

  /**
   * GET TASKS FOR PROJECT
   */
  const getProjectTasks = useCallback((projectId) => {
    return tasks.filter(t => t.projectId === projectId);
  }, [tasks]);

  /**
   * UPDATE SUBTASK
   */
  const updateSubtask = useCallback((taskId, subtaskId, completed) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          subtasks: task.subtasks.map(st =>
            st.id === subtaskId ? { ...st, completed } : st
          )
        };
      }
      return task;
    }));
  }, []);

  // ====================
  // MESSAGE OPERATIONS
  // ====================
  
  /**
   * SEND MESSAGE
   */
  const sendMessage = useCallback((messageData) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      reactions: [],
      ...messageData
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  /**
   * GET MESSAGES FOR PROJECT/CHANNEL
   */
  const getChannelMessages = useCallback((projectId, channelId) => {
    return messages.filter(m => 
      m.projectId === projectId && m.channelId === channelId
    );
  }, [messages]);

  /**
   * ADD REACTION TO MESSAGE
   */
  const addReaction = useCallback((messageId, emoji, userId) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          return {
            ...msg,
            reactions: msg.reactions.map(r =>
              r.emoji === emoji
                ? { ...r, userIds: [...r.userIds, userId] }
                : r
            )
          };
        } else {
          return {
            ...msg,
            reactions: [...msg.reactions, { emoji, userIds: [userId] }]
          };
        }
      }
      return msg;
    }));
  }, []);

  // ============================
  // REAL-TIME COLLABORATION
  // ============================
  
  /**
   * SIMULATE USER JOINING DOCUMENT
   */
  const joinDocument = useCallback((docId, userId) => {
    setActiveCollaborators(prev => ({
      ...prev,
      [docId]: [...(prev[docId] || []), userId]
    }));
  }, []);

  /**
   * SIMULATE USER LEAVING DOCUMENT
   */
  const leaveDocument = useCallback((docId, userId) => {
    setActiveCollaborators(prev => ({
      ...prev,
      [docId]: (prev[docId] || []).filter(id => id !== userId)
    }));
  }, []);

  /**
   * LOCK DOCUMENT FOR EDITING
   */
  const lockDocument = useCallback((docId, userId) => {
    setDocumentLocks(prev => ({ ...prev, [docId]: userId }));
  }, []);

  /**
   * UNLOCK DOCUMENT
   */
  const unlockDocument = useCallback((docId) => {
    setDocumentLocks(prev => {
      const newLocks = { ...prev };
      delete newLocks[docId];
      return newLocks;
    });
  }, []);

  // =================
  // SEARCH FUNCTION
  // =================
  
  /**
   * SEARCH WORKSPACE
   * Searches across projects, documents, and tasks.
   */
  const searchWorkspace = useCallback((query) => {
    const lowerQuery = query.toLowerCase();
    
    const matchedProjects = projects.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.tags.some(t => t.toLowerCase().includes(lowerQuery))
    );
    
    const matchedDocuments = documents.filter(d =>
      d.title.toLowerCase().includes(lowerQuery) ||
      d.content.toLowerCase().includes(lowerQuery) ||
      d.tags.some(t => t.toLowerCase().includes(lowerQuery))
    );
    
    const matchedTasks = tasks.filter(t =>
      t.title.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
    
    return {
      projects: matchedProjects,
      documents: matchedDocuments,
      tasks: matchedTasks,
      totalResults: matchedProjects.length + matchedDocuments.length + matchedTasks.length
    };
  }, [projects, documents, tasks]);

  // Prepare the value object
  const value = {
    // Data
    projects,
    documents,
    tasks,
    messages,
    activeProject,
    activeDocument,
    activeCollaborators,
    documentLocks,
    
    // Setters
    setActiveProject,
    setActiveDocument,
    
    // Project operations
    createProject,
    updateProject,
    deleteProject,
    getProject,
    
    // Document operations
    createDocument,
    updateDocument,
    deleteDocument,
    getProjectDocuments,
    addDocumentComment,
    
    // Task operations
    createTask,
    updateTask,
    deleteTask,
    getProjectTasks,
    updateSubtask,
    
    // Message operations
    sendMessage,
    getChannelMessages,
    addReaction,
    
    // Collaboration
    joinDocument,
    leaveDocument,
    lockDocument,
    unlockDocument,
    
    // Search
    searchWorkspace
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

/**
 * CUSTOM HOOK: useWorkspace
 */
export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  
  return context;
}

export default WorkspaceContext;
