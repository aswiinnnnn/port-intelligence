import React, { useState } from 'react';
import { Users, Bell, Shield, Languages, Plus, Search, MoreVertical, Send, X, Check, Trash2, Edit2, ChevronDown } from 'lucide-react';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { t } from '../i18n';
import { activePort } from '../ports';

type Role = 'Port Service Provider' | 'Tug Operator' | 'Ship Agent' | 'Harbour Pilot' | 'Administrator';
type AccountStatus = 'Active' | 'Suspended' | 'Pending Invite';

interface PortUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: AccountStatus;
  lastActive: string;
  avatar?: string;
  permissions: {
    manageVessels: boolean;
    manageResources: boolean;
    approveAllocations: boolean;
    viewAnalytics: boolean;
    manageUsers: boolean;
  };
}

const ROLE_COLOR: Record<Role, string> = {
  'Administrator': '#7c3aed',
  'Port Service Provider': '#2563eb',
  'Tug Operator': '#f59e0b',
  'Ship Agent': '#10b981',
  'Harbour Pilot': '#0891b2'
};

const STATUS_COLOR: Record<AccountStatus, string> = {
  Active: '#10b981',
  Suspended: '#ef4444',
  'Pending Invite': '#f59e0b'
};

const INITIAL_USERS: PortUser[] = [
  { id: 'u-1', name: 'Fatma Al Balushi', email: 'fatma.albalushi@salalahport.com', role: 'Administrator', status: 'Active', lastActive: 'Just now', avatar: '/users/user-elena.png', permissions: { manageVessels: true, manageResources: true, approveAllocations: true, viewAnalytics: true, manageUsers: true } },
  { id: 'u-2', name: 'Ahmed Al Hinai', email: 'ahmed.alhinai@salalahport.com', role: 'Port Service Provider', status: 'Active', lastActive: '12 min ago', avatar: '/users/user-marc.png', permissions: { manageVessels: true, manageResources: true, approveAllocations: true, viewAnalytics: true, manageUsers: false } },
  { id: 'u-3', name: 'Capt. Al Rawahi', email: 'k.alrawahi@salalahpilots.om', role: 'Harbour Pilot', status: 'Active', lastActive: '1h ago', avatar: '/users/user-rodriguez.png', permissions: { manageVessels: false, manageResources: false, approveAllocations: false, viewAnalytics: true, manageUsers: false } },
  { id: 'u-4', name: 'Maryam Al Kindi', email: 'maryam.alkindi@spsmarine.om', role: 'Tug Operator', status: 'Active', lastActive: '3h ago', avatar: '/users/user-laia.png', permissions: { manageVessels: false, manageResources: true, approveAllocations: false, viewAnalytics: true, manageUsers: false } },
  { id: 'u-5', name: 'Khalid Al Amri', email: 'k.alamri@dhofarshipping.om', role: 'Ship Agent', status: 'Pending Invite', lastActive: 'Never', avatar: '/users/user-tomas.png', permissions: { manageVessels: false, manageResources: false, approveAllocations: false, viewAnalytics: false, manageUsers: false } },
  { id: 'u-6', name: 'Aisha Al Shanfari', email: 'a.alshanfari@salalahpilots.om', role: 'Harbour Pilot', status: 'Suspended', lastActive: '14d ago', avatar: '/users/user-nuria.png', permissions: { manageVessels: false, manageResources: false, approveAllocations: false, viewAnalytics: true, manageUsers: false } }
];

interface NotificationRule {
  id: string;
  label: string;
  description: string;
  channels: { email: boolean; sms: boolean; push: boolean };
}

const INITIAL_RULES: NotificationRule[] = [
  { id: 'n-1', label: 'Vessel arrivals & departures', description: 'ETA changes, berthing confirmations, departure clearance', channels: { email: true, sms: false, push: true } },
  { id: 'n-2', label: 'Resource allocation updates', description: 'Tug, pilot, and berth assignment changes', channels: { email: true, sms: true, push: true } },
  { id: 'n-3', label: 'High-risk vessel alerts', description: 'Vessels flagged HIGH or CRITICAL risk approaching port', channels: { email: true, sms: true, push: true } },
  { id: 'n-4', label: 'Weather & sea conditions', description: 'Wind, visibility, and sea-state warnings', channels: { email: false, sms: false, push: true } },
  { id: 'n-5', label: 'Documentation & compliance', description: 'FAL forms, customs holds, ISSC expiry reminders', channels: { email: true, sms: false, push: false } },
  { id: 'n-6', label: 'System & maintenance', description: 'Platform updates, scheduled maintenance windows', channels: { email: false, sms: false, push: false } }
];

const cardStyle: React.CSSProperties = {
  backgroundColor: 'rgba(255,255,255,0.5)',
  border: '1px solid rgba(0,0,0,0.06)',
  borderRadius: '12px',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)'
};

const eyebrowStyle: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 700,
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.6px'
};

const emptyPermissions = { manageVessels: false, manageResources: false, approveAllocations: false, viewAnalytics: true, manageUsers: false };

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'notifications' | 'security' | 'language'>('users');
  const [users, setUsers] = useState<PortUser[]>(INITIAL_USERS);
  const [rules, setRules] = useState<NotificationRule[]>(INITIAL_RULES);
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState<PortUser | null>(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState<{ name: string; email: string; role: Role }>({ name: '', email: '', role: 'Ship Agent' });
  const [openRoleDropdown, setOpenRoleDropdown] = useState(false);
  const [openEditRoleDropdown, setOpenEditRoleDropdown] = useState(false);
  const [broadcast, setBroadcast] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const filteredUsers = users.filter(u =>
    t(u.name).toLowerCase().includes(search.toLowerCase()) || t(u.email).toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = users.filter(u => u.status === 'Active').length;
  const pendingCount = users.filter(u => u.status === 'Pending Invite').length;

  const handleAddUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim()) return;
    const user: PortUser = {
      id: `u-${Date.now()}`,
      name: newUser.name.trim(),
      email: newUser.email.trim(),
      role: newUser.role,
      status: 'Pending Invite',
      lastActive: 'Never',
      permissions: emptyPermissions
    };
    setUsers(prev => [user, ...prev]);
    setNewUser({ name: '', email: '', role: 'Ship Agent' });
    setShowAddUser(false);
  };

  const handleRemoveUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    setMenuOpenId(null);
  };

  const handleToggleStatus = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u));
    setMenuOpenId(null);
  };

  const handleSavePermissions = () => {
    if (!editingUser) return;
    setUsers(prev => prev.map(u => u.id === editingUser.id ? editingUser : u));
    setEditingUser(null);
  };

  const toggleChannel = (ruleId: string, channel: keyof NotificationRule['channels']) => {
    setRules(prev => prev.map(r => r.id === ruleId ? { ...r, channels: { ...r.channels, [channel]: !r.channels[channel] } } : r));
  };

  const handleSendBroadcast = () => {
    if (!broadcast.trim()) return;
    setBroadcastSent(true);
    setBroadcast('');
    setTimeout(() => setBroadcastSent(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', flex: 1, minWidth: 0, height: '100%', gap: '16px', overflow: 'auto', paddingRight: '8px' }}>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '2px' }}>
        {[
          { id: 'users', label: 'Users & Permissions', icon: Users },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'security', label: 'Security', icon: Shield },
          ...(activePort.englishOnly ? [] : [{ id: 'language', label: 'Language & Region', icon: Languages }])
        ].map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 4px', marginRight: '16px',
                border: 'none', background: 'transparent',
                color: active ? '#2563eb' : '#64748b',
                fontWeight: active ? 700 : 500,
                fontSize: '13px', cursor: 'pointer',
                borderBottom: active ? '2px solid #2563eb' : '2px solid transparent'
              }}
            >
              <Icon size={14} /> {t(tab.label)}
            </button>
          );
        })}
      </div>

      {/* ============ USERS & PERMISSIONS ============ */}
      {activeTab === 'users' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            <div style={{ ...cardStyle, padding: '16px' }}>
              <div style={eyebrowStyle}>{t("Total Users")}</div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: '#1e293b', marginTop: '8px' }}>{users.length}</div>
            </div>
            <div style={{ ...cardStyle, padding: '16px' }}>
              <div style={eyebrowStyle}>{t("Active")}</div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: '#10b981', marginTop: '8px' }}>{activeCount}</div>
            </div>
            <div style={{ ...cardStyle, padding: '16px' }}>
              <div style={eyebrowStyle}>{t("Pending Invites")}</div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: '#f59e0b', marginTop: '8px' }}>{pendingCount}</div>
            </div>
            <div style={{ ...cardStyle, padding: '16px' }}>
              <div style={eyebrowStyle}>{t("Roles Configured")}</div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: '#1e293b', marginTop: '8px' }}>5</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
            <div style={{ ...cardStyle, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '360px', flex: 1 }}>
              <Search size={15} color="#64748b" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t("Search users by name or email...")}
                style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '12px', color: '#1e293b', flex: 1 }}
              />
            </div>
            <button
              onClick={() => setShowAddUser(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#2563eb', color: 'white', fontWeight: 600, fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              <Plus size={14} /> {t(" Add New User")}</button>
          </div>

          {/* Add user inline form */}
          {showAddUser && (
            <div style={{ ...cardStyle, padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto auto', gap: '10px', alignItems: 'end' }}>
              <div>
                <div style={eyebrowStyle}>{t("Full Name")}</div>
                <input
                  value={newUser.name}
                  onChange={e => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={t("e.g. Saeed Al Hajri")}
                  style={{ marginTop: '6px', width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '12px', outline: 'none' }}
                />
              </div>
              <div>
                <div style={eyebrowStyle}>{t("Email")}</div>
                <input
                  value={newUser.email}
                  onChange={e => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  placeholder={t("name@company.com")}
                  style={{ marginTop: '6px', width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '12px', outline: 'none' }}
                />
              </div>
              <div style={{ position: 'relative' }}>
                <div style={eyebrowStyle}>{t("Role")}</div>
                <button
                  type="button"
                  onClick={() => setOpenRoleDropdown(!openRoleDropdown)}
                  style={{
                    marginTop: '6px',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#0f172a',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span>{t(newUser.role)}</span>
                  <ChevronDown size={14} color="#64748b" style={{ transform: openRoleDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>

                {openRoleDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    right: 0,
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    zIndex: 200,
                    padding: '4px'
                  }}>
                    {(['Administrator', 'Port Service Provider', 'Tug Operator', 'Ship Agent', 'Harbour Pilot'] as Role[]).map(r => (
                      <div
                        key={r}
                        onClick={() => {
                          setNewUser(prev => ({ ...prev, role: r }));
                          setOpenRoleDropdown(false);
                        }}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: r === newUser.role ? 700 : 500,
                          backgroundColor: r === newUser.role ? '#f1f5f9' : 'transparent',
                          color: '#1e293b',
                          cursor: 'pointer'
                        }}
                      >
                        {t(r)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={handleAddUser}
                style={{ padding: '9px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#2563eb', color: 'white', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}
              >
                {t("Send Invite")}</button>
              <button
                onClick={() => setShowAddUser(false)}
                style={{ padding: '9px 12px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', backgroundColor: 'white', color: '#64748b', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}
              >
                {t("Cancel")}</button>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredUsers.map(user => (
              <div 
                key={user.id} 
                style={{ 
                  ...cardStyle, 
                  padding: '14px 16px', 
                  display: 'grid', 
                  gridTemplateColumns: '1fr auto auto auto', 
                  gap: '16px', 
                  alignItems: 'center', 
                  position: 'relative',
                  zIndex: menuOpenId === user.id ? 100 : 1
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {user.avatar ? (
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', flexShrink: 0 }}>
                      <img src={user.avatar} alt={t(user.name)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: ROLE_COLOR[user.role], color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>
                      {t(user.name.split(' ').map(n => n[0]).join('').slice(0, 2))}
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>{t(user.name)}</div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>{t(user.email)}</div>
                  </div>
                </div>

                <span style={{ fontSize: '10px', fontWeight: 700, color: '#475569', backgroundColor: '#f1f5f9', border: '1px solid rgba(0,0,0,0.06)', padding: '4px 10px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                  {t(user.role)}
                </span>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: STATUS_COLOR[user.status], backgroundColor: `${STATUS_COLOR[user.status]}15`, padding: '4px 10px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                    {t(user.status)}
                  </span>
                  <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '4px' }}>{t("Last active: ")}{t(user.lastActive)}</div>
                </div>

                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setMenuOpenId(menuOpenId === user.id ? null : user.id)}
                    style={{ width: '30px', height: '30px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.08)', backgroundColor: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <MoreVertical size={14} color="#64748b" />
                  </button>
                  {menuOpenId === user.id && (
                    <div style={{ position: 'absolute', top: '36px', right: 0, backgroundColor: 'white', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', zIndex: 100, minWidth: '180px', overflow: 'hidden' }}>
                      <button
                        onClick={() => { setEditingUser(user); setMenuOpenId(null); }}
                        style={{ width: '100%', padding: '10px 12px', border: 'none', background: 'none', textAlign: 'left', fontSize: '12px', color: '#1e293b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                      >
                        <Edit2 size={12} /> {t(" Edit permissions")}</button>
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        style={{ width: '100%', padding: '10px 12px', border: 'none', background: 'none', textAlign: 'left', fontSize: '12px', color: '#1e293b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid rgba(0,0,0,0.05)' }}
                      >
                        {user.status === 'Active' ? <X size={12} /> : <Check size={12} />}
                        {t(user.status === 'Active' ? 'Suspend account' : 'Reactivate account')}
                      </button>
                      <button
                        onClick={() => handleRemoveUser(user.id)}
                        style={{ width: '100%', padding: '10px 12px', border: 'none', background: 'none', textAlign: 'left', fontSize: '12px', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid rgba(0,0,0,0.05)' }}
                      >
                        <Trash2 size={12} /> {t(" Remove user")}</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <div style={{ ...cardStyle, padding: '24px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>
                {t("No users match \"")}{t(search)}"
              </div>
            )}
          </div>

          {/* Edit permissions modal */}
          {editingUser && (
            <div
              onClick={() => setEditingUser(null)}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50000, padding: '20px' }}
            >
              <div
                onClick={e => e.stopPropagation()}
                style={{ backgroundColor: '#EAF1F3', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', maxWidth: '440px', width: '100%', overflow: 'hidden' }}
              >
                <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>{t(editingUser.name)}</div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{t(editingUser.email)}</div>
                  </div>
                  <button onClick={() => setEditingUser(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <X size={18} color="#475569" />
                  </button>
                </div>
                <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ position: 'relative' }}>
                    <div style={eyebrowStyle}>{t("Role")}</div>
                    <button
                      type="button"
                      onClick={() => setOpenEditRoleDropdown(!openEditRoleDropdown)}
                      style={{
                        marginTop: '8px',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '9px 10px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#0f172a',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <span>{t(editingUser.role)}</span>
                      <ChevronDown size={14} color="#64748b" style={{ transform: openEditRoleDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </button>

                    {openEditRoleDropdown && (
                      <div style={{
                        position: 'absolute',
                        top: 'calc(100% + 4px)',
                        left: 0,
                        right: 0,
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                        zIndex: 200,
                        padding: '4px'
                      }}>
                        {(['Administrator', 'Port Service Provider', 'Tug Operator', 'Ship Agent', 'Harbour Pilot'] as Role[]).map(r => (
                          <div
                            key={r}
                            onClick={() => {
                              setEditingUser(prev => prev ? { ...prev, role: r } : prev);
                              setOpenEditRoleDropdown(false);
                            }}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: r === editingUser.role ? 700 : 500,
                              backgroundColor: r === editingUser.role ? '#f1f5f9' : 'transparent',
                              color: '#1e293b',
                              cursor: 'pointer'
                            }}
                          >
                            {t(r)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <div style={{ ...eyebrowStyle, marginBottom: '10px' }}>{t("Permissions")}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {([
                        { key: 'manageVessels', label: 'Manage vessels & port calls' },
                        { key: 'manageResources', label: 'Manage tugs, pilots & berths' },
                        { key: 'approveAllocations', label: 'Approve resource allocations' },
                        { key: 'viewAnalytics', label: 'View analytics & reports' },
                        { key: 'manageUsers', label: 'Manage users & permissions' }
                      ] as { key: keyof PortUser['permissions']; label: string }[]).map(perm => (
                        <label key={perm.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: '#1e293b', cursor: 'pointer' }}>
                          {t(perm.label)}
                          <input
                            type="checkbox"
                            checked={editingUser.permissions[perm.key]}
                            onChange={() => setEditingUser(prev => prev ? { ...prev, permissions: { ...prev.permissions, [perm.key]: !prev.permissions[perm.key] } } : prev)}
                            style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(0,0,0,0.08)', display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => setEditingUser(null)}
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', backgroundColor: 'transparent', color: '#475569', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}
                  >
                    {t("Cancel")}</button>
                  <button
                    onClick={handleSavePermissions}
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#2563eb', color: 'white', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}
                  >
                    {t("Save Changes")}</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ============ NOTIFICATIONS ============ */}
      {activeTab === 'notifications' && (
        <>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', margin: '0 0 4px 0' }}>{t("Notification Preferences")}</h3>
            <div style={{ fontSize: '12px', color: '#64748b' }}>{t("Choose how the platform notifies your team for each event category.")}</div>
          </div>

          <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr repeat(3, 70px)', gap: '8px', padding: '10px 16px', backgroundColor: 'rgba(0,0,0,0.02)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <span style={eyebrowStyle}>{t("Event")}</span>
              <span style={{ ...eyebrowStyle, textAlign: 'center' }}>{t("Email")}</span>
              <span style={{ ...eyebrowStyle, textAlign: 'center' }}>{t("SMS")}</span>
              <span style={{ ...eyebrowStyle, textAlign: 'center' }}>{t("Push")}</span>
            </div>
            {rules.map((rule, i) => (
              <div key={rule.id} style={{ display: 'grid', gridTemplateColumns: '1fr repeat(3, 70px)', gap: '8px', padding: '14px 16px', alignItems: 'center', borderBottom: i < rules.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{t(rule.label)}</div>
                  <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>{t(rule.description)}</div>
                </div>
                {(['email', 'sms', 'push'] as const).map(channel => (
                  <div key={channel} style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                      onClick={() => toggleChannel(rule.id, channel)}
                      style={{
                        width: '38px', height: '22px', borderRadius: '11px', border: 'none', cursor: 'pointer',
                        backgroundColor: rule.channels[channel] ? '#2563eb' : 'rgba(0,0,0,0.12)',
                        position: 'relative', transition: 'background-color 0.15s ease'
                      }}
                    >
                      <span style={{
                        position: 'absolute', top: '2px', left: rule.channels[channel] ? '18px' : '2px',
                        width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'white',
                        transition: 'left 0.15s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                      }} />
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Broadcast notification */}
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', margin: '0 0 4px 0' }}>{t("Send Broadcast Notification")}</h3>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>{t("Push a message to all active users on the platform right now.")}</div>
            <div style={{ ...cardStyle, padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <textarea
                value={broadcast}
                onChange={e => setBroadcast(e.target.value)}
                placeholder={t("e.g. Berth SCT-B05 will be temporarily closed for maintenance from 22:00–06:00 tonight.")}
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '12px', fontFamily: 'inherit', resize: 'vertical', minHeight: '70px', outline: 'none' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: broadcastSent ? '#10b981' : '#94a3b8', fontWeight: 600 }}>
                  {t(broadcastSent ? `✓ Sent to ${activeCount} active users` : `Will notify ${activeCount} active users`)}
                </span>
                <button
                  onClick={handleSendBroadcast}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '6px', border: 'none', backgroundColor: '#2563eb', color: 'white', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}
                >
                  <Send size={13} /> {t(" Send Notification")}</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ============ SECURITY ============ */}
      {activeTab === 'language' && (
        <div style={{ ...cardStyle, padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '640px' }}>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', margin: 0 }}>{t('Display Language')}</h4>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
              {t('Choose the language used across the platform. Arabic switches the layout to right-to-left. Your choice is saved on this device.')}
            </p>
          </div>
          <LanguageSwitcher size="regular" />
          <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>
            {t('Vessel names, IMO/MMSI numbers, berth codes and original radio or email messages are shown as received.')}
          </p>
        </div>
      )}

      {activeTab === 'security' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ ...cardStyle, padding: '16px' }}>
              <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', margin: '0 0 12px 0' }}>{t("Authentication")}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px', color: '#000000' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                  {t("Require two-factor authentication")}<input type="checkbox" defaultChecked style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                </label>
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                  {t("Enforce SSO for administrators")}<input type="checkbox" defaultChecked style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                </label>
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                  {t("Auto-suspend after 90 days inactive")}<input type="checkbox" style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                </label>
              </div>
            </div>
            <div style={{ ...cardStyle, padding: '16px' }}>
              <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', margin: '0 0 12px 0' }}>{t("Session Policy")}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>{t("Session timeout")}</span>
                  <span style={{ fontWeight: 700, color: '#1e293b' }}>{t("8 hours")}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>{t("Max concurrent sessions")}</span>
                  <span style={{ fontWeight: 700, color: '#1e293b' }}>{t("3 devices")}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>{t("Password expiry")}</span>
                  <span style={{ fontWeight: 700, color: '#1e293b' }}>{t("90 days")}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 12px 0' }}>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', margin: 0 }}>{t("System Audit & Bulk Activity Log")}</h4>
                <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0 0' }}>{t("Comprehensive security audit log of all console and administrative actions.")}</p>
              </div>
              <button
                onClick={() => {
                  const csvHeaders = 'Timestamp,User,Role,Action,IP Address,Device/Browser\n';
                  const csvRows = [
                    { user: 'Fatma Al Balushi', role: 'Administrator', action: 'Signed in', time: 'Just now', ip: '5.36.12.4', device: 'Chrome / macOS' },
                    { user: 'Fatma Al Balushi', role: 'Administrator', action: 'Approve SSO policy configuration', time: '5 min ago', ip: '5.36.12.4', device: 'Chrome / macOS' },
                    { user: 'Ahmed Al Hinai', role: 'Port Service Provider', action: 'Approved resource allocation — MAERSK DHOFAR', time: '12 min ago', ip: '5.36.9.201', device: 'Safari / iPadOS' },
                    { user: 'Ahmed Al Hinai', role: 'Port Service Provider', action: 'Assigned pilot-3 Capt. Chen to SCT-P1', time: '18 min ago', ip: '5.36.9.201', device: 'Safari / iPadOS' },
                    { user: 'Capt. Al Rawahi', role: 'Harbour Pilot', action: 'Signed in', time: '1h ago', ip: '5.36.44.18', device: 'Firefox / Windows' },
                    { user: 'Maryam Al Kindi', role: 'Tug Operator', action: 'Updated tug fleet status for tug-3 TAQAH', time: '3h ago', ip: '5.36.9.201', device: 'Chrome / Windows' },
                    { user: 'Maryam Al Kindi', role: 'Tug Operator', action: 'Assigned tug-1 Poseidon to RAYSUT TRADER', time: '3h ago', ip: '5.36.9.201', device: 'Chrome / Windows' },
                    { user: 'Fatma Al Balushi', role: 'Administrator', action: 'Invited Khalid Al Amri to the platform', time: '1d ago', ip: '5.36.12.4', device: 'Chrome / macOS' },
                    { user: 'System (AI)', role: 'System', action: 'Triggered automated allocation optimization engine', time: '1d ago', ip: '127.0.0.1', device: 'System Service' },
                    { user: 'Ahmed Al Hinai', role: 'Port Service Provider', action: 'Completed vessel clearance for GULF ZENITH', time: '2d ago', ip: '5.36.9.201', device: 'Safari / iPadOS' },
                    { user: 'Aisha Al Shanfari', role: 'Harbour Pilot', action: 'Suspended account status update', time: '14d ago', ip: '5.36.44.22', device: 'Chrome / Android' }
                  ].map(log => `"${log.time}","${log.user}","${log.role}","${log.action}","${log.ip}","${log.device}"`).join('\n');
                  
                  const blob = new Blob([csvHeaders + csvRows], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.setAttribute('href', url);
                  link.setAttribute('download', `port_audit_trail_${new Date().toISOString().slice(0, 10)}.csv`);
                  link.style.visibility = 'hidden';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid rgba(37, 99, 235, 0.25)',
                  backgroundColor: 'rgba(37, 99, 235, 0.05)',
                  color: '#2563eb',
                  fontWeight: 600,
                  fontSize: '11px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.05)')}
              >
                {t("Export Audit Trail (CSV)")}</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
              {[
                { user: 'Fatma Al Balushi', role: 'Administrator', action: 'Signed in', time: 'Just now', ip: '5.36.12.4', device: 'Chrome / macOS' },
                { user: 'Fatma Al Balushi', role: 'Administrator', action: 'Approved SSO policy configuration', time: '5 min ago', ip: '5.36.12.4', device: 'Chrome / macOS' },
                { user: 'Ahmed Al Hinai', role: 'Port Service Provider', action: 'Approved resource allocation — MAERSK DHOFAR', time: '12 min ago', ip: '5.36.9.201', device: 'Safari / iPadOS' },
                { user: 'Ahmed Al Hinai', role: 'Port Service Provider', action: 'Assigned pilot-3 Capt. Chen to SCT-P1', time: '18 min ago', ip: '5.36.9.201', device: 'Safari / iPadOS' },
                { user: 'Capt. Al Rawahi', role: 'Harbour Pilot', action: 'Signed in', time: '1h ago', ip: '5.36.44.18', device: 'Firefox / Windows' },
                { user: 'Maryam Al Kindi', role: 'Tug Operator', action: 'Updated tug fleet status for tug-3 TAQAH', time: '3h ago', ip: '5.36.9.201', device: 'Chrome / Windows' },
                { user: 'Maryam Al Kindi', role: 'Tug Operator', action: 'Assigned tug-1 Poseidon to RAYSUT TRADER', time: '3h ago', ip: '5.36.9.201', device: 'Chrome / Windows' },
                { user: 'Fatma Al Balushi', role: 'Administrator', action: 'Invited Khalid Al Amri to the platform', time: '1d ago', ip: '5.36.12.4', device: 'Chrome / macOS' },
                { user: 'System (AI)', role: 'System', action: 'Triggered automated allocation optimization engine', time: '1d ago', ip: '127.0.0.1', device: 'System Service' },
                { user: 'Ahmed Al Hinai', role: 'Port Service Provider', action: 'Completed vessel clearance for GULF ZENITH', time: '2d ago', ip: '5.36.9.201', device: 'Safari / iPadOS' },
                { user: 'Aisha Al Shanfari', role: 'Harbour Pilot', action: 'Suspended account status update', time: '14d ago', ip: '5.36.44.22', device: 'Chrome / Android' }
              ].map((log, i) => (
                <div key={i} style={{ ...cardStyle, padding: '12px 14px', display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 1fr 1fr', gap: '12px', alignItems: 'center', fontSize: '11px' }}>
                  <div>
                    <span style={{ fontWeight: 700, color: '#1e293b' }}>{t(log.user)}</span>
                    <div style={{ fontSize: '9px', color: '#64748b', marginTop: '2px' }}>{t(log.role)}</div>
                  </div>
                  <div>
                    <span style={{ color: '#334155', fontWeight: 500 }}>{t(log.action)}</span>
                  </div>
                  <div style={{ color: '#64748b' }}>
                    <div>{t(log.ip)}</div>
                    <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '2px' }}>{t(log.device)}</div>
                  </div>
                  <span style={{ color: '#94a3b8', textAlign: 'right', whiteSpace: 'nowrap' }}>{t(log.time)}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
