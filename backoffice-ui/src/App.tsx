import { useState } from 'react'
import { Shield, LogOut } from 'lucide-react'
import Login from './Login'
import Approvals from './Approvals'
import AuditTrail, { AuditLogEntry } from './AuditTrail'

interface LogEntry {
  msg: string;
  type: 'info' | 'success' | 'error' | 'warning';
  time: string;
}

function App() {
  const [token, setToken] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [auditHistory, setAuditHistory] = useState<AuditLogEntry[]>([])

  const addLog = (msg: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    setLogs(prev => [{ msg, type, time: new Date().toLocaleTimeString() }, ...prev])
  }

  const addAuditLog = (log: AuditLogEntry) => {
    setAuditHistory(prev => [log, ...prev])
  }

  const handleLoginSuccess = (newToken: string, username: string) => {
    setToken(newToken)
    setCurrentUser(username)
    addLog(`User '${username}' logged in successfully.`, 'success')
  }

  const handleLogout = () => {
    setToken(null)
    setCurrentUser(null)
    setLogs([])
  }

  // If not authenticated, show Login screen
  if (!token) {
    return <Login onLoginSuccess={handleLoginSuccess} />
  }

  // Determine which page to show based on user role
  // In our mock setup: 'auditor' user sees Audit Trail, everyone else sees Approvals
  const isAuditor = currentUser === 'auditor';

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto bg-gray-50">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-10 h-10 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Backoffice Banking Operations</h1>
            <p className="text-gray-500">Zero-Trust Transaction Approval Portal</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">
            Logged in as: <span className="text-blue-600 font-bold uppercase">{currentUser}</span>
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content: Approvals Table OR Audit Trail */}
        <div className="lg:col-span-3">
          {isAuditor ? (
            <AuditTrail logs={auditHistory} />
          ) : (
            <Approvals
              token={token}
              currentUser={currentUser || 'unknown'}
              onLog={addLog}
              onAudit={addAuditLog}
            />
          )}
        </div>

        {/* Right Panel: System Log (Visible to everyone for demo purposes) */}
        <div className="lg:col-span-1 bg-gray-900 text-gray-100 p-6 rounded-xl shadow-lg font-mono text-sm h-[600px] flex flex-col sticky top-8">
          <h2 className="text-gray-400 font-semibold mb-4 border-b border-gray-700 pb-2 flex justify-between items-center">
            <span>System Audit Log</span>
            <span className="text-xs font-normal text-gray-500">Live Stream</span>
          </h2>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {logs.length === 0 && <span className="text-gray-600 italic">Waiting for events...</span>}
            {logs.map((log, i) => (
              <div key={i} className="flex gap-3 animate-fade-in">
                <span className="text-gray-500 shrink-0">[{log.time}]</span>
                <span className={
                  log.type === 'success' ? 'text-green-400' :
                  log.type === 'error' ? 'text-red-400' :
                  log.type === 'warning' ? 'text-yellow-400' : 'text-blue-300'
                }>
                  {log.msg}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-2 border-t border-gray-700 text-center">
            <span className="text-xs text-gray-500 uppercase tracking-widest">For Demo Only</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
