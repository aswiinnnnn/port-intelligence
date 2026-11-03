import React, { useState } from 'react';
import { Lock, Mail, Shield, Anchor, Ship, Navigation, ArrowRight, Layers } from 'lucide-react';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { PortSwitcher } from '../components/PortSwitcher';
import { t } from '../i18n';
import { activePort, portText } from '../ports';
import { BarcelonaLogo } from '../components/BarcelonaLogo';

const isBarcelona = activePort.id === 'barcelona';

export type UserRole = 'port-service-provider' | 'tug-operator' | 'ship-agent' | 'harbour-pilot' | 'crane-operator';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  organization: string;
  avatarBg: string;
}

export const PRESET_USERS: UserProfile[] = [
  {
    id: 'u-1',
    name: 'Fatma Al Balushi',
    email: 'fatma.albalushi@salalahport.com',
    role: 'port-service-provider',
    roleTitle: 'Port Authority Admin',
    organization: 'Salalah Port Services',
    avatarBg: '#2563eb'
  },
  {
    id: 'u-2',
    name: 'Khalid Al Amri',
    email: 'k.alamri@dhofarshipping.om',
    role: 'ship-agent',
    roleTitle: 'Senior Shipping Agent',
    organization: 'Dhofar Shipping Agency',
    avatarBg: '#059669'
  },
  {
    id: 'u-3',
    name: 'Maryam Al Kindi',
    email: 'maryam.alkindi@spsmarine.om',
    role: 'tug-operator',
    roleTitle: 'Tug Fleet Dispatcher',
    organization: 'SPS Marine Towage Services',
    avatarBg: '#d97706'
  },
  {
    id: 'u-4',
    name: 'Capt. Al Rawahi',
    email: 'k.alrawahi@salalahpilots.om',
    role: 'harbour-pilot',
    roleTitle: 'Chief Harbour Pilot',
    organization: 'Salalah Port Pilotage Services',
    avatarBg: '#7c3aed'
  },
  {
    id: 'u-5',
    name: 'Salim Al Mashani',
    email: 's.almashani@salalah-ct.com',
    role: 'crane-operator',
    roleTitle: 'Senior Quay Crane Specialist',
    organization: 'Salalah Container Terminal',
    avatarBg: '#0891b2'
  }
];

// Accounts are shown with the active port's names and email domains, so sign-in matches those.
const getUserEmail = (user: UserProfile) => portText(user.email);

// Checked in order. Besides these role words, each account is recognised by its surname and
// organisation domain (e.g. "rawahi", "spsmarine" on the reference port).
const ROLE_KEYWORDS: [UserRole, string[]][] = [
  ['harbour-pilot', ['pilot']],
  ['tug-operator', ['tug']],
  ['ship-agent', ['agent', 'shipping']],
  ['crane-operator', ['crane']],
  ['port-service-provider', ['admin', 'port']]
];

const accountKeywords = (user: UserProfile): string[] => {
  const [username, domain = ''] = getUserEmail(user).toLowerCase().split('@');
  const surname = (username.split('.').pop() ?? '').replace(/^al-?/, '');
  return [surname, domain.split('.')[0]].filter(Boolean);
};

export const findUserByEmail = (inputEmail: string): UserProfile => {
  const cleanInput = inputEmail.trim().toLowerCase();
  if (!cleanInput) return PRESET_USERS[0];

  const username = cleanInput.split('@')[0];

  // 1. Exact match
  let matched = PRESET_USERS.find(u => getUserEmail(u).toLowerCase() === cleanInput);
  if (matched) return matched;

  // 2. Match by username (e.g. k.alrawahi, fatma.albalushi) regardless of domain TLD (.om, .com)
  if (username) {
    matched = PRESET_USERS.find(u => getUserEmail(u).toLowerCase().split('@')[0] === username);
    if (matched) return matched;
  }

  // 3. Keyword / Role fallbacks
  for (const [role, words] of ROLE_KEYWORDS) {
    const user = PRESET_USERS.find(u => u.role === role);
    if (!user) continue;
    if ([...words, ...accountKeywords(user)].some(word => cleanInput.includes(word))) return user;
  }

  return PRESET_USERS[0];
};

interface LoginPageProps {
  onLogin: (user: UserProfile) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState<string>(getUserEmail(PRESET_USERS[0]));
  const [password, setPassword] = useState<string>('••••••••••••');

  const currentMatchedUser = findUserByEmail(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(currentMatchedUser);
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'port-service-provider': return <Shield size={16} />;
      case 'ship-agent': return <Ship size={16} />;
      case 'tug-operator': return <Anchor size={16} />;
      case 'harbour-pilot': return <Navigation size={16} />;
      case 'crane-operator': return <Layers size={16} />;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Background layer */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: "linear-gradient(135deg, rgba(248, 250, 252, 0.88), rgba(226, 232, 240, 0.94)), url('/ship_bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: -1
      }} />

      {/* Port and language selection are available before sign-in */}
      <div style={{ position: 'absolute', top: '24px', insetInlineEnd: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <PortSwitcher />
        <LanguageSwitcher size="regular" />
      </div>

      {/* Main Card Container */}
      <div style={{
        width: '100%',
        maxWidth: '460px',
        margin: '24px',
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.15), 0 0 1px 1px rgba(0,0,0,0.05)',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        padding: '40px',
        boxSizing: 'border-box'
      }}>
        {/* Logo & Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            backgroundColor: isBarcelona ? '#1e293b' : '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '14px',
            boxShadow: isBarcelona ? '0 8px 20px rgba(15,23,42,0.25)' : '0 8px 20px rgba(37,99,235,0.25)'
          }}>
            {isBarcelona ? <BarcelonaLogo size={34} /> : <Anchor size={26} color="white" />}
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>{t("Port of Oman")}</h1>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t("Smart Maritime Platform")}</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              {t("Email Address")}</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("e.g. fatma.albalushi@salalahport.com")}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  color: '#0f172a',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              {t("Password")}</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  color: '#0f172a',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>
          </div>

          <div style={{
            padding: '12px 14px',
            backgroundColor: '#f8fafc',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            fontSize: '12px',
            color: '#475569',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{ color: currentMatchedUser.avatarBg, display: 'flex', flexShrink: 0 }}>
              {getRoleIcon(currentMatchedUser.role)}
            </div>
            <div>
              <strong>{t(currentMatchedUser.organization)}</strong>
              <div style={{ fontSize: '11px', color: '#64748b' }}>{t("Role: ")}{t(currentMatchedUser.roleTitle)}</div>
            </div>
          </div>

          <button
            type="submit"
            style={{
              marginTop: '8px',
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#2563eb',
              color: 'white',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
              transition: 'background-color 0.2s'
            }}
          >
            <span>{t("Sign In to Operational Portal")}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '24px', textAlign: 'center' }}>
          {t("Oman PCS Maritime Network · Single Sign-On Verified")}</div>
      </div>
    </div>
  );
};

