import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicOrClientRoute from './components/PublicOrClientRoute';
import WhatsAppFloat from './components/WhatsAppFloat';

// ─── EAGERLY LOADED (public-facing, must be instant) ────────────────────────
import LandingPage from './components/LandingPage';
import LoginPage from './components/login';
import SignupPage from './components/signup';
import Unauthorized from './components/Unauthorized';

// ─── LAZY LOADED (only downloaded when user navigates to that page) ──────────
const AboutUs            = lazy(() => import('./components/AboutUs'));
const ContactPage        = lazy(() => import('./components/Contact'));
const Careers            = lazy(() => import('./components/Careers'));
const Projects           = lazy(() => import('./components/Projects'));
const PrivacyPolicy      = lazy(() => import('./components/PrivacyPolicy'));
const TermsOfService     = lazy(() => import('./components/TermsOfService'));
const CookiePolicy       = lazy(() => import('./components/CookiePolicy'));

// Services (lazy — only loaded when user clicks a service)
const WebAppDev          = lazy(() => import('./components/services/WebAppDev'));
const MobileAppDev       = lazy(() => import('./components/services/MobileAppDev'));
const ITTalentSupply     = lazy(() => import('./components/services/ITTalentSupply'));
const DigitalMarketing   = lazy(() => import('./components/services/DigitalMarketing'));
const JobSupport         = lazy(() => import('./components/services/JobSupport'));
const CyberSecurity      = lazy(() => import('./components/services/CyberSecurity'));
const JobSupportContactForm = lazy(() => import('./components/services/JobSupportContactForm'));
const ServicesForm       = lazy(() => import('./components/services/ServicesForm'));

// Dashboards (lazy — only downloaded when user logs in and navigates)
const ClientDashboard    = lazy(() => import('./components/Dashboard/ClientDashboard'));
const EmployeeData       = lazy(() => import('./components/Dashboard/EmployeeData'));
const Reports            = lazy(() => import('./components/Reports'));
const WorkGroups         = lazy(() => import('./components/workgroups'));
const AssetsWorksheet    = lazy(() => import('./components/AssetWorksheet'));
const ManagerWorksheet   = lazy(() => import('./components/ManagerWorksheet'));
const EmployeeRegistrationForm = lazy(() => import('./components/employeeRegistrationForm'));
const EmployeeOnboardingWorkSheet = lazy(() => import('./components/employeeOnboardingSheet'));
const AdminPage          = lazy(() => import('./components/AdminWorkSheet/AdminPage'));

// ─── Loading Fallback ────────────────────────────────────────────────────────
const PageLoader = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: '#f9fafb',
    flexDirection: 'column',
    gap: '16px',
  }}>
    <div style={{
      width: '48px',
      height: '48px',
      border: '4px solid #e5e7eb',
      borderTopColor: '#6D28D9',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <p style={{ color: '#6b7280', fontSize: '0.95rem', margin: 0 }}>Loading...</p>
  </div>
);

const App = () => {
  return (
    <div>
      <AuthProvider>
        <ThemeProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>

              {/* ── Public Routes ─────────────────────────────────── */}
              <Route path="/"              element={<LandingPage />} />
              <Route path="/aboutus"       element={<AboutUs />} />
              <Route path="/contactus"     element={<ContactPage />} />
              <Route path="/login"         element={<LoginPage />} />
              <Route path="/signup"        element={<SignupPage />} />
              <Route path="/careers"       element={<Careers />} />
              <Route path="/projects"      element={<Projects />} />
              <Route path="/unauthorized"  element={<Unauthorized />} />
              <Route path="/privacy-policy"   element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/cookie-policy"    element={<CookiePolicy />} />

              {/* ── Service Routes ────────────────────────────────── */}
              <Route path="/services/mobile-app-development" element={
                <PublicOrClientRoute>
                  <MobileAppDev />
                </PublicOrClientRoute>
              } />
              <Route path="/services/web-app-development" element={
                <PublicOrClientRoute>
                  <WebAppDev />
                </PublicOrClientRoute>
              } />
              <Route path="/services/digital-marketing" element={
                <PublicOrClientRoute>
                  <DigitalMarketing />
                </PublicOrClientRoute>
              } />
              <Route path="/services/it-talent-supply" element={
                <PublicOrClientRoute>
                  <ITTalentSupply />
                </PublicOrClientRoute>
              } />
              <Route path="/services/job-support" element={
                <PublicOrClientRoute>
                  <JobSupport />
                </PublicOrClientRoute>
              } />
              <Route path="/services/cyber-security" element={
                <PublicOrClientRoute>
                  <CyberSecurity />
                </PublicOrClientRoute>
              } />
              <Route path="/services/job-contact-form" element={
                <ProtectedRoute allowedRoles={['client']}>
                  <JobSupportContactForm />
                </ProtectedRoute>
              } />
              <Route path="/services/servicesForm" element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ServicesForm />
                </ProtectedRoute>
              } />

              {/* ── Protected Dashboard Routes ────────────────────── */}
              <Route path="/clientdashboard" element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientDashboard />
                </ProtectedRoute>
              } />
              <Route path="/assetworksheet" element={
                <ProtectedRoute allowedRoles={['asset']}>
                  <AssetsWorksheet />
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute allowedRoles={['admin', 'manager']}>
                  <Reports />
                </ProtectedRoute>
              } />
              <Route path="/employees" element={
                <ProtectedRoute allowedRoles={['employee']}>
                  <EmployeeData />
                </ProtectedRoute>
              } />
              <Route path="/workgroups" element={
                <ProtectedRoute allowedRoles={['admin', 'manager']}>
                  <WorkGroups />
                </ProtectedRoute>
              } />
              <Route path="/adminpage" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminPage />
                </ProtectedRoute>
              } />
              <Route path="/managerworksheet" element={
                <ProtectedRoute allowedRoles={['manager']}>
                  <ManagerWorksheet />
                </ProtectedRoute>
              } />
              <Route path="/employee-registration-form" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <EmployeeRegistrationForm />
                </ProtectedRoute>
              } />
              <Route path="/employee-onboarding-sheet" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <EmployeeOnboardingWorkSheet />
                </ProtectedRoute>
              } />

            </Routes>
          </Suspense>

          {/* WhatsApp float shown on all pages */}
          <WhatsAppFloat />

        </ThemeProvider>
      </AuthProvider>
    </div>
  );
};

export default App;