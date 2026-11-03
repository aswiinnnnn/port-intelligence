import React from 'react';
import {
  LayoutDashboard,
  Ship,
  Anchor,
  Cloud,
  Activity,
  MessageSquare,
  FileText,
  Clipboard,
  Settings,
  Clock
} from 'lucide-react';
import type { PageId } from '../types';
import { t } from '../i18n';

// Tooltip / screen-reader labels for the icon-only navigation buttons
const NAV_LABELS: Partial<Record<PageId, string>> = {
  'live-map': 'Operations Dashboard',
  vessels: 'Vessels',
  communications: 'Communications',
  resources: 'Resources',
  analytics: 'Analytics',
  settings: 'Platform Settings',
  notifications: 'Port Call Notifications',
  documents: 'Vessel Documentation',
  berth: 'Berth Reservation Requests',
  departure: 'Vessel Departure Clearance',
  'tug-dashboard': 'Tug Operations Dashboard',
  'tug-assignments': 'Active Tug Assignments',
  'tug-fleet': 'Tug Fleet Overview',
  'tug-communications': 'Communications',
  'pilot-dashboard': 'Harbour Pilot Dashboard',
  'pilot-assignments': 'Active Pilotage Assignments',
  'pilot-vessel-data': 'Vessel Data & Specifications',
  'pilot-conditions': 'Port & Weather Conditions',
  'crane-dashboard': 'Quay Crane Operations Dashboard',
  'crane-assignments': 'Active Crane Shift Assignments',
  'crane-roster': 'Terminal Crane Equipment Roster',
  'crane-sla-timeline': 'AI Operation SLA & Move Timelines'
};

const CraneIcon: React.FC<{ size?: number; strokeWidth?: number }> = ({ size = 20, strokeWidth = 1.8 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={strokeWidth} 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M3 22h18" />
    <path d="M6 22V4c0-.6.4-1 1-1h3c.6 0 1 .4 1 1v18" />
    <path d="m6 8 5-4" />
    <path d="m11 12-5-4" />
    <path d="m6 16 5-4" />
    <path d="m11 20-5-4" />
    <path d="M11 5h10l-3 4H11" />
    <path d="M18 9v6" />
    <path d="M18 15h-2" />
  </svg>
);

interface SidebarProps {
  currentPage: PageId;
  onPageChange: (pageId: PageId) => void;
  currentUserRole?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange, currentUserRole }) => {
  const isLightMode = currentPage !== 'live-map';

  const topItems: { id: PageId; icon: typeof LayoutDashboard }[] = 
    currentUserRole === 'ship-agent'
      ? [
          { id: 'notifications', icon: Clipboard },
          { id: 'documents', icon: FileText },
          { id: 'berth', icon: Anchor },
          { id: 'communications', icon: MessageSquare },
          { id: 'departure', icon: Ship }
        ]
      : currentUserRole === 'tug-operator'
      ? [
          { id: 'tug-dashboard', icon: LayoutDashboard },
          { id: 'tug-assignments', icon: Clipboard },
          { id: 'tug-fleet', icon: Ship },
          { id: 'tug-communications', icon: MessageSquare }
        ]
      : currentUserRole === 'harbour-pilot'
      ? [
          { id: 'pilot-dashboard', icon: LayoutDashboard },
          { id: 'pilot-assignments', icon: Clipboard },
          { id: 'pilot-vessel-data', icon: FileText },
          { id: 'pilot-conditions', icon: Cloud }
        ]
      : currentUserRole === 'crane-operator'
      ? [
          { id: 'crane-dashboard', icon: LayoutDashboard },
          { id: 'crane-assignments', icon: Clipboard },
          { id: 'crane-roster', icon: CraneIcon as any },
          { id: 'crane-sla-timeline', icon: Clock }
        ]
      : [
          { id: 'live-map', icon: LayoutDashboard },
          { id: 'vessels', icon: Ship },
          { id: 'communications', icon: MessageSquare },
          { id: 'resources', icon: CraneIcon as any },
          { id: 'analytics', icon: Activity },
          { id: 'settings', icon: Settings },
        ];

  const renderIcon = (item: { id: PageId; icon: typeof LayoutDashboard }) => {
    const isActive = currentPage === item.id;
    const IconComponent = item.icon;
    
    return (
      <button
        key={item.id}
        title={t(NAV_LABELS[item.id] ?? '')}
        aria-label={t(NAV_LABELS[item.id] ?? '')}
        data-page={item.id}
        onClick={() => onPageChange(item.id)}
        style={{
          width: '46px',
          height: '46px',
          borderRadius: '16px',
          backgroundColor: isActive 
            ? (isLightMode ? '#1e293b' : '#ffffff') 
            : (isLightMode ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.12)'),
          border: isLightMode 
            ? '1px solid rgba(0, 0, 0, 0.08)' 
            : '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: isActive 
            ? (isLightMode ? '#ffffff' : '#1a202c') 
            : (isLightMode ? '#475569' : '#ffffff'),
          transition: 'all 0.2s ease',
          marginBottom: '10px',
          boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = isLightMode 
              ? 'rgba(0, 0, 0, 0.12)' 
              : 'rgba(255, 255, 255, 0.25)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = isLightMode 
              ? 'rgba(0, 0, 0, 0.05)' 
              : 'rgba(255, 255, 255, 0.12)';
          }
        }}
      >
        <IconComponent size={20} strokeWidth={1.8} />
      </button>
    );
  };

  return (
    <div 
      style={{
        userSelect: 'none',
        backgroundColor: 'transparent'
      }}
    >
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {topItems.map(renderIcon)}
      </div>
    </div>
  );
};
