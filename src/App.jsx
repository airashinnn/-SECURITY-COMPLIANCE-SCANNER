import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ShieldDefs } from './components/Logo.jsx';
import { AppProvider } from './context/AppContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import Landing from './pages/Landing.jsx';
import Signin from './pages/Signin.jsx';
import Signup from './pages/Signup.jsx';
import AppShell from './pages/AppShell.jsx';
import Overview from './pages/Overview.jsx';
import Applications from './pages/Applications.jsx';
import Assessment from './pages/Assessment.jsx';
import Findings from './pages/Findings.jsx';
import Remediation from './pages/Remediation.jsx';
import Members from './pages/Members.jsx';
import Account from './pages/Account.jsx';

export default function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <ShieldDefs />
        <HashRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/app" element={<AppShell />}>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<Overview />} />
              <Route path="applications" element={<Applications />} />
              <Route path="assessment" element={<Assessment />} />
              <Route path="findings" element={<Findings />} />
              <Route path="remediation" element={<Remediation />} />
              <Route path="members" element={<Members />} />
              <Route path="account" element={<Account />} />
              <Route path="*" element={<Navigate to="overview" replace />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </ToastProvider>
    </AppProvider>
  );
}
