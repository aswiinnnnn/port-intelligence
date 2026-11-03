import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import type { PageId } from '../types';
import type { UserProfile } from '../pages/LoginPage';
import { t } from '../i18n';

type UserRole = 'port-service-provider' | 'tug-operator' | 'ship-agent' | 'harbour-pilot' | 'crane-operator';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: PageId;
  pageTitle: string;
  onPageChange: (pageId: PageId) => void;
  currentUserRole?: UserRole;
  currentUserProfile?: UserProfile;
  onLogout?: () => void;
  onUserRoleChange?: (role: UserRole) => void;
  onSelectVesselForAllocation?: (vesselName: string | null) => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  currentPage,
  pageTitle,
  onPageChange,
  currentUserRole,
  currentUserProfile,
  onLogout,
  onUserRoleChange,
  onSelectVesselForAllocation
}) => {
  return (
    <div 
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: 'transparent'
      }}
    >
      {/* Background overlay for non-map views to reduce contrast and improve readability */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor:
            currentPage === 'live-map'
              ? 'rgba(255, 255, 255, 0.25)'
              : 'rgba(255, 255, 255, 0.7)',
          backdropFilter: currentPage === 'live-map' ? 'blur(1.5px)' : 'blur(10px)',
          WebkitBackdropFilter: currentPage === 'live-map' ? 'blur(1.5px)' : 'blur(10px)',
          opacity: 1,
          display: 'block',
          transition: 'opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
      {/* Floating Sidebar Navigation */}
      <div style={{ position: 'absolute', insetInlineStart: '12px', top: '24px', bottom: '24px', zIndex: 10000, display: 'flex', alignItems: 'center' }}>
        <Sidebar currentPage={currentPage} onPageChange={onPageChange} currentUserRole={currentUserRole} />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          height: '100%',
          overflow: 'hidden',
          paddingTop: '0px',
          paddingBottom: '16px',
          paddingInlineStart: '80px',
          paddingInlineEnd: '16px',
          gap: '12px',
          position: 'relative',
          zIndex: 1
        }}
      >
        <Header
          pageTitle={pageTitle}
          isLightMode={currentPage !== 'live-map'}
          currentRole={currentUserRole}
          currentUserProfile={currentUserProfile}
          onLogout={onLogout}
          onRoleChange={onUserRoleChange}
          onSelectVesselForAllocation={onSelectVesselForAllocation}
          onPageChange={onPageChange}
          currentPage={currentPage}
        />
        <main 
          style={{
            flex: 1,
            overflow: 'hidden',
            position: 'relative',
            display: 'flex'
          }}
        >
          {t(children)}
        </main>
      </div>
    </div>
  );
};
