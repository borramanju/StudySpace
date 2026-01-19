#  StudySpace - AI Collaborative Workspace for Students

A comprehensive AI-powered collaborative workspace designed specifically for students. This application provides real-time collaboration, AI assistance, project management, and knowledge organization features.

---

##  Table of Contents

1. [Features Overview](#features-overview)
2. [Project Architecture](#project-architecture)
3. [File Structure](#file-structure)
4. [Setup Instructions](#setup-instructions)
5. [Understanding the Code](#understanding-the-code)
6. [How Each Feature Works](#how-each-feature-works)
7. [Extending the Application](#extending-the-application)
8. [Production Deployment](#production-deployment)

---

##  Features Overview

###  Core Collaboration Features
- **Multi-user workspace** with role-based access (Admin, Editor, Viewer)
- **Real-time collaboration** on documents/projects (simulated)
- **Shared dashboards** for team visibility
- **Commenting, mentions, and discussion threads**
- **Version history** and change tracking

###  AI-Powered Features
- **AI-assisted content generation** (text, summaries, ideas)
- **Context-aware AI chat** within the workspace
- **Automatic document summarization**
- **Smart suggestions** for tasks, edits, or improvements
- **Natural language search** across workspace content

###  Project & Task Management
- **Task creation, assignment, and tracking**
- **AI-based task prioritization** or recommendations
- **Kanban / list-style task boards**
- **Deadlines, reminders, and status tracking**

###  Knowledge Management
- **Centralized knowledge base** / document repository
- **AI-powered semantic search**
- **Tagging and categorization** of files
- **Auto-linking** related documents or tasks

###  Communication
- **Built-in team chat** or discussion channels
- **File uploads and shared assets**
- **Notification system** (in-app)

###  Security & Access Control
- **Authentication and authorization**
- **Workspace-level permissions**
- **Activity logs**

---

##  Project Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   CONTEXT PROVIDERS                   │    │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐    │    │
│  │  │ AuthContext │ │ Workspace   │ │  AIContext  │    │    │
│  │  │             │ │  Context    │ │             │    │    │
│  │  │ - User auth │ │ - Projects  │ │ - Chat      │    │    │
│  │  │ - Roles     │ │ - Documents │ │ - Generate  │    │    │
│  │  │ - Perms     │ │ - Tasks     │ │ - Summarize │    │    │
│  │  └─────────────┘ └─────────────┘ └─────────────┘    │    │
│  └─────────────────────────────────────────────────────┘    │
│                              │                               │
│                              ▼                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                      PAGES                            │    │
│  │  ┌─────────┐ ┌──────────┐ ┌─────────┐ ┌─────────┐   │    │
│  │  │Dashboard│ │ Projects │ │Documents│ │  Tasks  │   │    │
│  │  └─────────┘ └──────────┘ └─────────┘ └─────────┘   │    │
│  │  ┌─────────┐ ┌──────────┐ ┌─────────┐ ┌─────────┐   │    │
│  │  │  Chat   │ │Knowledge │ │   AI    │ │Settings │   │    │
│  │  │         │ │   Base   │ │Assistant│ │         │   │    │
│  │  └─────────┘ └──────────┘ └─────────┘ └─────────┘   │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Future)                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐    │
│  │   REST API  │ │  Database   │ │    AI Integration   │    │
│  │  (Express/  │ │ (PostgreSQL/│ │   (OpenAI/Claude/   │    │
│  │   FastAPI)  │ │   MongoDB)  │ │      Gemini)        │    │
│  └─────────────┘ └─────────────┘ └─────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

##  File Structure

```
ai-workspace/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── index.js            # Entry point
│   ├── App.jsx             # Main app with routing
│   ├── contexts/           # Global state management
│   │   ├── AuthContext.jsx     # Authentication state
│   │   ├── WorkspaceContext.jsx # Projects/docs/tasks state
│   │   └── AIContext.jsx       # AI features state
│   ├── components/
│   │   └── Layout.jsx      # Sidebar + Header layout
│   ├── pages/
│   │   ├── Login.jsx       # Login page
│   │   ├── Dashboard.jsx   # Main dashboard
│   │   ├── Projects.jsx    # Project management
│   │   ├── Documents.jsx   # Document editor
│   │   ├── Tasks.jsx       # Task kanban board
│   │   ├── Chat.jsx        # Team chat
│   │   ├── KnowledgeBase.jsx # Knowledge repository
│   │   ├── AIAssistant.jsx # AI chat interface
│   │   └── Settings.jsx    # User settings
│   └── styles/
│       └── global.css      # All styles
├── package.json            # Dependencies
└── README.md               # This file
```

---

##  Setup Instructions

### Prerequisites
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- A code editor (VS Code recommended)

### Step-by-Step Setup

#### Step 1: Create Project Folder
```bash
# Create and navigate to your project folder
mkdir ai-workspace
cd ai-workspace
```

#### Step 2: Copy All Files
Copy all the files from this project into your folder, maintaining the structure shown above.

#### Step 3: Install Dependencies
```bash
# Install all required packages
npm install
```

#### Step 4: Start Development Server
```bash
# Start the app
npm start
```

#### Step 5: Open in Browser
The app will automatically open at `http://localhost:3000`

### Demo Accounts
Use these credentials to test different roles:

| Role   | Email                  | Password   |
|--------|------------------------|------------|
| Admin  | admin@student.edu      | admin123   |
| Editor | editor@student.edu     | editor123  |
| Viewer | viewer@student.edu     | viewer123  |

---

##  Understanding the Code

### Key Concepts Explained

#### 1. React Context (Global State)
Context is like a "global variable" that any component can access. We use three contexts:

```jsx
// AuthContext - Who is logged in?
const { user, login, logout } = useAuth();

// WorkspaceContext - What data do we have?
const { projects, documents, tasks } = useWorkspace();

// AIContext - AI functionality
const { chatWithAI, summarizeDocument } = useAI();
```

#### 2. React Router (Navigation)
React Router handles navigation between pages without page reloads:

```jsx
<Routes>
  <Route path="/" element={<Dashboard />} />
  <Route path="/projects" element={<Projects />} />
  <Route path="/tasks" element={<Tasks />} />
</Routes>
```

#### 3. useState (Component State)
useState manages data that changes within a component:

```jsx
const [searchQuery, setSearchQuery] = useState('');
// searchQuery = current value
// setSearchQuery = function to update it
```

#### 4. useEffect (Side Effects)
useEffect runs code when something changes:

```jsx
useEffect(() => {
  // This runs when the component first loads
  loadData();
}, []); // Empty array = run once

useEffect(() => {
  // This runs whenever searchQuery changes
  filterResults(searchQuery);
}, [searchQuery]); // Run when searchQuery changes
```

---

##  How Each Feature Works

###  Authentication System
**File:** `contexts/AuthContext.jsx`

```
User enters credentials → login() validates → 
User data saved to state + localStorage → 
App shows authenticated UI
```

**Key functions:**
- `login(email, password)` - Validates and logs in user
- `logout()` - Clears user session
- `isAdmin()`, `canEdit()` - Permission checks

###  Project Management
**File:** `contexts/WorkspaceContext.jsx` + `pages/Projects.jsx`

```
Create project → saved to state → 
displayed in grid → 
click to view details
```

**Key functions:**
- `createProject(data)` - Creates new project
- `updateProject(id, updates)` - Modifies project
- `deleteProject(id)` - Removes project and associated data

###  Document System
**File:** `pages/Documents.jsx`

```
Select document → show in viewer → 
edit content → save creates new version → 
add comments
```

**Key functions:**
- `createDocument(data)` - Creates new document
- `updateDocument(id, updates)` - Saves changes with version increment
- `addDocumentComment(docId, comment)` - Adds comment

###  Task Management
**File:** `pages/Tasks.jsx`

```
Create task → appears in Kanban column → 
drag/change status → 
mark subtasks complete
```

**Key functions:**
- `createTask(data)` - Creates new task
- `updateTask(id, updates)` - Updates task properties
- `updateSubtask(taskId, subtaskId, completed)` - Toggles subtask

###  AI Features
**File:** `contexts/AIContext.jsx`

```
User sends message → context added → 
AI generates response → 
displayed in chat
```

**Key functions:**
- `chatWithAI(message, context)` - Conversational AI
- `summarizeDocument(text, length)` - Creates summaries
- `getSmartSuggestions(context, data)` - Provides suggestions
- `semanticSearch(query)` - AI-powered search

###  Team Chat
**File:** `pages/Chat.jsx`

```
Select project/channel → 
type message → send → 
appears in thread → 
add reactions
```

**Key functions:**
- `sendMessage(data)` - Sends a message
- `addReaction(messageId, emoji, userId)` - Adds emoji reaction
