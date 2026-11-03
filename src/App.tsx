import { useState, useEffect, useRef } from 'react';
import type { PageId } from './types';
import { Layout } from './components/Layout';
import { SplashScreen } from './components/SplashScreen';
import { UnifiedDashboard } from './pages/UnifiedDashboard';
import { ResourceAllocationModal } from './pages/ResourceAllocation';
import { ShipAgent } from './pages/ShipAgent';
import { TugOperator } from './pages/TugOperator';
import { HarbourPilot } from './pages/HarbourPilot';
import { CraneOperator } from './pages/CraneOperator';
import { Resources } from './pages/Resources';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { LoginPage, PRESET_USERS, type UserProfile } from './pages/LoginPage';
import { MscBarcelonaToaster } from './components/MscBarcelonaToaster';
import { t, useLanguage } from './i18n';
import { takePortSwitchHandoff } from './ports';

// A user who switched ports while signed in continues as the same role on the same page.
// Read once per page load (outside render, so StrictMode's double render can't consume it twice).
const restoredSession = (() => {
  const handoff = takePortSwitchHandoff();
  const user = handoff && PRESET_USERS.find(u => u.role === handoff.role);
  return user ? { user, page: handoff.page as PageId } : null;
})();

function App() {
  // Subscribing here re-renders the whole tree when the user switches language.
  useLanguage();
  const isAutoAcceptedEnv = import.meta.env.VITE_MSC_BARCELONA_AUTO_ACCEPTED === 'true';

  const [showSplash, setShowSplash] = useState(!restoredSession);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!restoredSession);
  const [currentUser, setCurrentUser] = useState<UserProfile>(restoredSession?.user ?? PRESET_USERS[0]);
  const [currentPage, setCurrentPage] = useState<PageId>(restoredSession?.page ?? 'live-map');
  const restoredSessionRef = useRef(restoredSession);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [selectedVesselForAllocation, setSelectedVesselForAllocation] = useState<string | null>(null);

  const [isMscBarcelonaAccepted, setIsMscBarcelonaAccepted] = useState<boolean>(isAutoAcceptedEnv);
  const [showMscToaster, setShowMscToaster] = useState<boolean>(false);
  const [mscChecklistResetSignal, setMscChecklistResetSignal] = useState<number>(0);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    restoredSessionRef.current = null;
    setIsAuthenticated(false);
    setShowMscToaster(false);
  };

  const handleAcceptMscBarcelona = () => {
    setIsMscBarcelonaAccepted(true);
    setShowMscToaster(false);
  };

  // Sets the role's landing page on login/role switch only — must not depend on
  // isMscBarcelonaAccepted, or accepting MAERSK DHOFAR from any page (e.g. Berth
  // Reservations & Pilotage) would bounce the user back to their default tab.
  useEffect(() => {
    if (!isAuthenticated) return;
    const restored = restoredSessionRef.current;
    if (restored && restored.user === currentUser) {
      setCurrentPage(restored.page);
      return;
    }
    restoredSessionRef.current = null;
    if (currentUser.role === 'ship-agent') {
      setCurrentPage('notifications');
    } else if (currentUser.role === 'tug-operator') {
      setCurrentPage('tug-dashboard');
    } else if (currentUser.role === 'harbour-pilot') {
      setCurrentPage('pilot-dashboard');
    } else if (currentUser.role === 'crane-operator') {
      setCurrentPage('crane-dashboard');
    } else {
      setCurrentPage('live-map');
    }
  }, [currentUser, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowMscToaster(false);
      return;
    }

    // Trigger toaster notification on login after 2s delay if VITE_MSC_BARCELONA_AUTO_ACCEPTED is false (disabled for port authority admin)
    if (!isAutoAcceptedEnv && !isMscBarcelonaAccepted && currentUser.role !== 'port-service-provider') {
      const timer = setTimeout(() => {
        setShowMscToaster(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setShowMscToaster(false);
    }
  }, [currentUser, isAuthenticated, isAutoAcceptedEnv, isMscBarcelonaAccepted]);

  const getPageTitle = (page: PageId) => {
    switch (page) {
      case 'dashboard':
        return 'Operations Dashboard';
      case 'live-map':
        return 'Live Port Map';
      case 'communications':
        return 'Multilingual Communication Center';
      case 'analytics':
        return 'Vessel Analytics';
      case 'notifications':
        return 'Port Call Notifications';
      case 'documents':
        return 'Vessel Documentation';
      case 'berth':
        return 'Berth Reservation Requests';
      case 'departure':
        return 'Vessel Departure Clearance';
      case 'tug-dashboard':
        return 'Tug Operations Dashboard';
      case 'tug-assignments':
        return 'Active Tug Assignments';
      case 'tug-fleet':
        return 'Tug Fleet Overview';
      case 'tug-communications':
        return 'Vessel Communications (Tug)';
      case 'pilot-dashboard':
        return 'Harbour Pilot Dashboard';
      case 'pilot-assignments':
        return 'Active Pilotage Assignments';
      case 'pilot-vessel-data':
        return 'Vessel Data & Specifications';
      case 'pilot-conditions':
        return 'Port & Weather Conditions';
      case 'crane-dashboard':
        return 'Quay Crane Operations Dashboard';
      case 'crane-assignments':
        return 'Active Crane Shift Assignments';
      case 'crane-roster':
        return 'Terminal Crane Equipment Roster';
      case 'crane-sla-timeline':
        return 'AI Operation SLA & Move Timelines';
      case 'settings':
        return 'Platform Settings';
      default:
        return 'Operations Platform';
    }
  };

  const handleSelectVesselForAllocation = (vesselName: string | null, withDelay?: boolean) => {
    if (vesselName && withDelay) {
      setTimeout(() => {
        setSelectedVesselForAllocation(vesselName);
      }, 300);
    } else {
      setSelectedVesselForAllocation(vesselName);
    }
  };

  // Toaster's "View Details" button: the tug dispatcher jumps straight to her Active
  // Assignments checklist with the protocol reset, the ship agent jumps straight to
  // her Berth Reservations & Pilotage tab; every other role sees the details popup.
  const handleToasterViewDetails = () => {
    setShowMscToaster(false);
    if (currentUser.role === 'tug-operator' && currentUser.email === 'maryam.alkindi@spsmarine.om') {
      setCurrentPage('tug-assignments');
      setMscChecklistResetSignal(prev => prev + 1);
    } else if (currentUser.role === 'ship-agent') {
      setCurrentPage('berth');
    } else {
      handleSelectVesselForAllocation('MAERSK DHOFAR');
    }
  };

  return (
    <>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}

      {!isAuthenticated ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: -1,
              backgroundImage: "linear-gradient(to right, rgba(15, 23, 42, 0.5), rgba(15, 23, 42, 0.2)), url('/ship_bg.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: '#1e293b',
            }}
          />
          <Layout
            currentPage={currentPage}
            pageTitle={getPageTitle(currentPage)}
            onPageChange={setCurrentPage}
            currentUserRole={currentUser.role}
            currentUserProfile={currentUser}
            onLogout={handleLogout}
            onSelectVesselForAllocation={handleSelectVesselForAllocation}
          >
            {/* Role-based content rendering */}
            {currentUser.role === 'port-service-provider' && ['live-map', 'vessels', 'communications'].includes(currentPage) && (
              <UnifiedDashboard
                viewMode={currentPage}
                onPageChange={setCurrentPage}
                selectedMessageId={selectedMessageId}
                onSelectMessageId={setSelectedMessageId}
                onSelectVesselForAllocation={handleSelectVesselForAllocation}
              />
            )}
            {currentPage === 'resources' && (
              <Resources />
            )}
            {currentUser.role === 'port-service-provider' && currentPage === 'analytics' && (
              <Analytics />
            )}
            {currentPage === 'settings' && (
              <Settings />
            )}
            {currentUser.role === 'ship-agent' && (
              <ShipAgent
                activeTab={currentPage as any}
                isMscBarcelonaAccepted={isMscBarcelonaAccepted}
                onAcceptMscBarcelona={handleAcceptMscBarcelona}
              />
            )}
            {currentUser.role === 'tug-operator' && (
              <TugOperator
                activeTab={currentPage.replace('tug-', '') as any}
                isMscBarcelonaAccepted={isMscBarcelonaAccepted}
                onAcceptMscBarcelona={handleAcceptMscBarcelona}
                resetChecklistSignal={mscChecklistResetSignal}
              />
            )}
            {currentUser.role === 'harbour-pilot' && (
              <HarbourPilot activeTab={currentPage.replace('pilot-', '') as any} />
            )}
            {currentUser.role === 'crane-operator' && (
              <CraneOperator
                viewSubMode={currentPage}
                onPageChange={setCurrentPage}
                isMscBarcelonaAccepted={isMscBarcelonaAccepted}
                onAcceptMscBarcelona={handleAcceptMscBarcelona}
              />
            )}
          </Layout>

          {/* Bottom-Right Toaster Notification for MAERSK DHOFAR */}
          {showMscToaster && !isMscBarcelonaAccepted && currentUser.role !== 'port-service-provider' && (
            <MscBarcelonaToaster
              onAccept={handleAcceptMscBarcelona}
              onClose={() => setShowMscToaster(false)}
              onViewDetails={handleToasterViewDetails}
            />
          )}

          {/* Resource Allocation Modal */}
          {t(selectedVesselForAllocation && (
            <ResourceAllocationModal
              vesselName={selectedVesselForAllocation}
              isMscBarcelonaAccepted={isMscBarcelonaAccepted}
              onClose={() => {
                setSelectedVesselForAllocation(null);
                // Only the port authority dashboard has a 'vessels' tab to land on;
                // other roles must stay on their own current page or it renders blank.
                if (currentUser.role === 'port-service-provider') {
                  setCurrentPage('vessels');
                }
              }}
              onAccept={() => {
                handleAcceptMscBarcelona();
              }}
            />
          ))}
        </>
      )}
    </>
  );
}

export default App;

