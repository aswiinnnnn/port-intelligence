import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Mic, Send, ChevronDown, Check, X, Sliders, MessageSquare, ClipboardList, Map, Anchor, LogOut, ThumbsUp, ThumbsDown } from 'lucide-react';
import { answerQuestion, findVesselByFuzzyName } from '../lib/aiAssistant';
import type { PageId } from '../types';
import type { UserProfile } from '../pages/LoginPage';
import { LanguageSwitcher } from './LanguageSwitcher';
import { PortSwitcher } from './PortSwitcher';
import { BarcelonaLogo } from './BarcelonaLogo';
import { activePort } from '../ports';
import { t } from '../i18n';

type UserRole = 'port-service-provider' | 'tug-operator' | 'ship-agent' | 'harbour-pilot' | 'crane-operator';

interface ChatAction {
  label: string;
  type: 'approve_allocation' | 'modify_allocation' | 'decline_allocation' | 'contact_vessel' | 'view_checklist' | 'view_live_map' | 'check_tugs';
  primary?: boolean;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  isStreaming?: boolean;
  isThinking?: boolean;
  thinkingText?: string;
  vesselName?: string;
  suggestedQuestions?: string[];
  actions?: ChatAction[];
  actionStatus?: 'Approved' | 'Declined';
  feedback?: 'up' | 'down';
}

const SUGGESTED_PROMPTS = [
  'Why is the tug boat allocation done for GULF ZENITH?',
  "What's the status of MAERSK DHOFAR?",
  'Which pilots are available right now?'
];

interface HeaderProps {
  pageTitle?: string;
  isLightMode?: boolean;
  currentRole?: UserRole;
  currentUserProfile?: UserProfile;
  onLogout?: () => void;
  onRoleChange?: (role: UserRole) => void;
  onSelectVesselForAllocation?: (vesselName: string | null) => void;
  onPageChange?: (pageId: PageId) => void;
  currentPage?: PageId;
}

const getThinkingStepsForQuestion = (question: string, vesselName?: string): string[] => {
  const qLower = question.toLowerCase();
  const v = vesselName || "requested vessel";
  
  if (qLower.includes('why') || qLower.includes('allocat') || qLower.includes('assign')) {
    return [
      `Searching port database logs for ${v}...`,
      `Retrieving deterministic resource assignment matrix...`,
      `Checking harbor regulations and wind safety parameters...`,
      `Verifying harbor pilot credentials and tug crew rosters...`
    ];
  }
  if (qLower.includes('status') || qLower.includes('where') || qLower.includes('eta')) {
    return [
      `Contacting real-time AIS transponder feed for ${v}...`,
      `Scanning dock occupancy and scheduled berth updates...`,
      `Evaluating risk profile index and current draft safety margins...`
    ];
  }
  if (qLower.includes('pilot') || qLower.includes('tug') || qLower.includes('berth')) {
    return [
      `Accessing real-time resource registry...`,
      `Filtering active duty logs for available units...`,
      `Structuring availability records...`
    ];
  }
  return [
    `Parsing query token metadata...`,
    `Querying port intelligence databases...`,
    `Formulating optimal collaborative advice...`
  ];
};

const getSuggestedQuestionsForAnswer = (question: string, answer: any): string[] => {
  const qLower = question.toLowerCase();
  const vName = answer.vessel?.name;

  if (vName) {
    if (qLower.includes('why') || qLower.includes('allocat')) {
      return [
        `What is the risk level of ${vName}?`,
        `When is ${vName} expected to arrive (ETA)?`,
        `Are there other pilots certified for ${vName}?`
      ];
    } else {
      return [
        `Why is this allocation done for ${vName}?`,
        `Who is the ship operator for ${vName}?`,
        `Show me available berths for ${vName}`
      ];
    }
  }

  if (qLower.includes('pilot')) {
    return [
      `Which pilots are available right now?`,
      `Show me deep draft certified pilots`
    ];
  }
  if (qLower.includes('tug')) {
    return [
      `Which tugs are available right now?`,
      `Show me the status of Tug Poseidon`
    ];
  }
  if (qLower.includes('berth')) {
    return [
      `Which berths are vacant right now?`,
      `Show me Container Terminal Berth 4 status`
    ];
  }

  return [
    `Why is the tug boat allocation done for GULF ZENITH?`,
    `What's the status of MAERSK DHOFAR?`,
    `Which pilots are available right now?`
  ];
};

const getActionsForAnswer = (question: string, answer: any): ChatAction[] => {
  const vName = answer.vessel?.name;
  const qLower = question.toLowerCase();

  if (vName) {
    if (qLower.includes('why') || qLower.includes('allocat') || qLower.includes('status')) {
      return [
        { label: 'Approve Allocation', type: 'approve_allocation', primary: true },
        { label: 'Modify Allocation', type: 'modify_allocation', primary: false },
        { label: 'Decline Allocation', type: 'decline_allocation', primary: false }
      ];
    } else {
      return [
        { label: 'Contact Agent', type: 'contact_vessel', primary: true },
        { label: 'View Checklist', type: 'view_checklist', primary: false }
      ];
    }
  }

  return [
    { label: 'View Live Map', type: 'view_live_map', primary: true },
    { label: 'Check Tugs', type: 'check_tugs', primary: false }
  ];
};

export const Header: React.FC<HeaderProps> = ({ 
  pageTitle: _pageTitle = 'Operations Platform',
  isLightMode = false,
  currentRole: _currentRole = 'port-service-provider',
  currentUserProfile,
  onLogout,
  onRoleChange: _onRoleChange,
  onSelectVesselForAllocation,
  onPageChange,
  currentPage
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const displayName = currentUserProfile?.name || 'Fatma Al Balushi';
  const displayRoleTitle = currentUserProfile?.roleTitle || 'Port Authority Admin';
  const displayEmail = currentUserProfile?.email || 'fatma.albalushi@salalahport.com';
  const displayAvatarBg = currentUserProfile?.avatarBg || '#2563eb';

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, showChat]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target as Node)) {
        setShowChat(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowRoleDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAsk = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || isStreaming) return;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', text: trimmed };
    setChatInput('');
    setShowChat(true);

    const answer = answerQuestion(trimmed);
    const vessel = findVesselByFuzzyName(trimmed);
    const assistantMsgId = `a-${Date.now()}`;

    const rawThoughts = getThinkingStepsForQuestion(trimmed, vessel?.name);

    const assistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      text: '',
      isThinking: true,
      thinkingText: rawThoughts[0] || 'Analyzing request...',
      vesselName: answer.vessel?.name
    };

    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setIsStreaming(true);

    let thoughtIdx = 0;
    const runThoughts = () => {
      thoughtIdx++;
      if (thoughtIdx < rawThoughts.length) {
        setMessages(prev =>
          prev.map(msg => {
            if (msg.id === assistantMsgId) {
              return {
                ...msg,
                thinkingText: rawThoughts[thoughtIdx]
              };
            }
            return msg;
          })
        );
        const organicDelay = 800 + Math.random() * 600;
        setTimeout(runThoughts, organicDelay);
      } else {
        setMessages(prev =>
          prev.map(msg => {
            if (msg.id === assistantMsgId) {
              return {
                ...msg,
                isThinking: false,
                isStreaming: true
              };
            }
            return msg;
          })
        );

        let charIndex = 0;
        const fullText = t(answer.text);
        const step = 4;
        const streamInterval = setInterval(() => {
          charIndex += step;
          const isDone = charIndex >= fullText.length;
          const nextText = isDone ? fullText : fullText.slice(0, charIndex);

          setMessages(prev =>
            prev.map(msg => {
              if (msg.id === assistantMsgId) {
                return {
                  ...msg,
                  text: nextText
                };
              }
              return msg;
            })
          );

          if (isDone) {
            clearInterval(streamInterval);
            setIsStreaming(false);
            setMessages(prev =>
              prev.map(msg => {
                if (msg.id === assistantMsgId) {
                  return {
                    ...msg,
                    isStreaming: false,
                    suggestedQuestions: getSuggestedQuestionsForAnswer(trimmed, answer),
                    actions: getActionsForAnswer(trimmed, answer)
                  };
                }
                return msg;
              })
            );
          }
        }, 10);
      }
    };

    const initialDelay = 1000 + Math.random() * 400;
    setTimeout(runThoughts, initialDelay);
  };

  const handleActionClick = (messageId: string, action: ChatAction, vesselName?: string) => {
    setMessages(prev =>
      prev.map(msg => {
        if (msg.id === messageId) {
          return {
            ...msg,
            actionStatus: action.type === 'approve_allocation' ? 'Approved' : action.type === 'decline_allocation' ? 'Declined' : undefined
          };
        }
        return msg;
      })
    );

    if (action.type === 'modify_allocation' && vesselName) {
      onSelectVesselForAllocation?.(vesselName);
    } else if (action.type === 'approve_allocation' && vesselName) {
      const sysMsg: ChatMessage = {
        id: `s-${Date.now()}`,
        role: 'assistant',
        text: `✓ Collaboration Agent: Resource allocation for ${vesselName} has been approved and locked in the master database. Tug and Pilot crews have been dispatched.`
      };
      setMessages(prev => [...prev, sysMsg]);
    } else if (action.type === 'decline_allocation' && vesselName) {
      const sysMsg: ChatMessage = {
        id: `s-${Date.now()}`,
        role: 'assistant',
        text: `❌ Collaboration Agent: Allocation declined for ${vesselName}. Opening manual configuration or click 'Modify Allocation' below.`
      };
      setMessages(prev => [...prev, sysMsg]);
    } else if (action.type === 'contact_vessel') {
      onPageChange?.('communications');
    } else if (action.type === 'view_checklist') {
      onPageChange?.('vessels');
    } else if (action.type === 'view_live_map') {
      onPageChange?.('live-map');
    } else if (action.type === 'check_tugs') {
      onPageChange?.('resources');
    }
  };

  const handleFeedback = (messageId: string, rating: 'up' | 'down') => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          feedback: msg.feedback === rating ? undefined : rating
        };
      }
      return msg;
    }));
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'approve_allocation':
        return <Check size={13} style={{ flexShrink: 0 }} />;
      case 'modify_allocation':
        return <Sliders size={13} style={{ flexShrink: 0 }} />;
      case 'decline_allocation':
        return <X size={13} style={{ flexShrink: 0 }} />;
      case 'contact_vessel':
        return <MessageSquare size={13} style={{ flexShrink: 0 }} />;
      case 'view_checklist':
        return <ClipboardList size={13} style={{ flexShrink: 0 }} />;
      case 'view_live_map':
        return <Map size={13} style={{ flexShrink: 0 }} />;
      case 'check_tugs':
        return <Anchor size={13} style={{ flexShrink: 0 }} />;
      default:
        return null;
    }
  };

  const STYLE_SHEET = `
    @keyframes slideDownFadeIn {
      from {
        opacity: 0;
        transform: translateY(-16px) scale(0.98);
        filter: blur(4px);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: blur(0);
      }
    }

    @keyframes staggeredFadeIn {
      from {
        opacity: 0;
        transform: translateY(4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes pulse {
      0% { transform: scale(0.85); opacity: 0.5; }
      50% { transform: scale(1.15); opacity: 1; }
      100% { transform: scale(0.85); opacity: 0.5; }
    }

    @keyframes dot-tri-1 {
      0%, 100% { transform: translate(-5px, -3px) scale(0.8); opacity: 0.4; }
      50% { transform: translate(0px, 0px) scale(1.2); opacity: 1; }
    }
    @keyframes dot-tri-2 {
      0%, 100% { transform: translate(0px, 5px) scale(1.2); opacity: 1; }
      50% { transform: translate(5px, -3px) scale(0.8); opacity: 0.4; }
    }
    @keyframes dot-tri-3 {
      0%, 100% { transform: translate(5px, -3px) scale(0.8); opacity: 0.4; }
      50% { transform: translate(-5px, -3px) scale(1.2); opacity: 1; }
    }
    .animate-dt-1 { animation: dot-tri-1 2s infinite ease-in-out; }
    .animate-dt-2 { animation: dot-tri-2 2s infinite ease-in-out; }
    .animate-dt-3 { animation: dot-tri-3 2s infinite ease-in-out; }

    .chat-panel-animate {
      animation: slideDownFadeIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      transform-origin: top center;
    }

    .staggered-item {
      opacity: 0;
      animation: staggeredFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
  `;

  return (
    <header 
      style={{
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px 0 0',
        userSelect: 'none',
        flexShrink: 0,
        backgroundColor: 'transparent'
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: STYLE_SHEET }} />
      {/* Left side: Logo */}
      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        {activePort.id === 'barcelona' ? (
          <BarcelonaLogo size={30} barColor={isLightMode ? '#1e293b' : '#ffffff'} />
        ) : (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            height="28" 
            viewBox="92 28 32 33"
            style={{ overflow: 'visible' }}
          >
            <defs>
              <style>{`.a{fill:${isLightMode ? '#1e293b' : '#ffffff'};}.b{fill:#3b82f6;}`}</style>
            </defs>
            <path className="a" d="M106.5,29L106.5,51L93.5,51ZM109.5,35L109.5,51L120,51Z"/>
            <path className="b" d="M92,54L124,54L118.5,61L97.5,61Z"/>
          </svg>
        )}
        <PortSwitcher
          variant="brand"
          isLightMode={isLightMode}
          getHandoff={() => currentUserProfile && currentPage ? { role: currentUserProfile.role, page: currentPage } : undefined}
        />
        <span style={{ 
          marginLeft: '8px', 
          fontSize: '11px', 
          fontWeight: 600, 
          color: isLightMode ? '#64748b' : '#94a3b8', 
          backgroundColor: isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)', 
          padding: '2px 8px', 
          borderRadius: '4px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {t("Operations")}</span>
      </div>

      {/* Middle: AI Assistant Search Bar */}
      <div 
        ref={searchWrapperRef}
        style={{ 
          flex: showChat ? '1 1 480px' : '1 1 320px',
          maxWidth: '560px',
          minWidth: '220px',
          margin: '0 16px',
          position: 'relative',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ flex: 1, borderRadius: '12px', display: 'flex', alignItems: 'center', padding: '0 12px', height: '42px', border: isLightMode ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.15)', backgroundColor: isLightMode ? 'rgba(255,255,255,0.6)' : 'var(--glass-dark-bg)', minWidth: 0 }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: 'linear-gradient(135deg, #3b82f6 0%, var(--accent-cyan) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Sparkles size={13} color="white" />
            </div>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onFocus={() => setShowChat(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAsk(chatInput);
              }}
              disabled={isStreaming}
              placeholder={t(isStreaming ? "Agent is typing..." : "Ask why an allocation was made...")}
              className={isLightMode ? "dark-placeholder" : "light-placeholder"}
              style={{
                flex: 1,
                minWidth: 0,
                backgroundColor: 'transparent',
                border: 'none',
                padding: '6px 10px',
                color: isLightMode ? '#1e293b' : 'var(--text-primary)',
                fontSize: '12px',
                outline: 'none',
                fontFamily: 'var(--font-sans)',
                cursor: isStreaming ? 'not-allowed' : 'text'
              }}
            />
          </div>

          <button
            onClick={() => handleAsk(chatInput)}
            disabled={isStreaming || !chatInput.trim()}
            style={{ 
              width: '42px', 
              height: '42px', 
              borderRadius: '10px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              flexShrink: 0,
              cursor: (isStreaming || !chatInput.trim()) ? 'not-allowed' : 'pointer',
              border: isLightMode ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.15)',
              backgroundColor: isLightMode ? 'rgba(255,255,255,0.6)' : 'var(--glass-dark-bg)',
              opacity: (isStreaming || !chatInput.trim()) ? 0.6 : 1,
              outline: 'none'
            }}
          >
            <Send size={16} color={isLightMode ? '#475569' : "var(--text-secondary)"} />
          </button>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer', border: isLightMode ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.15)', backgroundColor: isLightMode ? 'rgba(255,255,255,0.6)' : 'var(--glass-dark-bg)' }}>
            <Mic size={16} color={isLightMode ? '#475569' : "var(--text-secondary)"} />
          </div>
        </div>

        {/* AI Assistant Chat Panel */}
        {showChat && (
          <div 
            className="chat-panel-animate"
            style={{
              position: 'absolute',
              top: 'calc(100% + 10px)',
              left: 0,
              right: 0,
              backgroundColor: '#ffffff',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: '14px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
              zIndex: 2000,
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '520px',
              overflow: 'hidden'
            }}
          >
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: 'linear-gradient(135deg, #3b82f6 0%, var(--accent-cyan) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={12} color="white" />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{t("Port Operations Collaboration Agent")}</span>
              {messages.length > 0 && (
                <button
                  onClick={() => setMessages([])}
                  style={{ marginLeft: 'auto', fontSize: '10px', fontWeight: 600, color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {t("Clear Thread")}</button>
              )}
            </div>

            <div ref={chatContainerRef} style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '150px' }}>
              {messages.length === 0 && (
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '10px' }}>
                    {t("Select a collaboration topic to begin:")}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {SUGGESTED_PROMPTS.map((prompt, index) => (
                      <button
                        key={prompt}
                        onClick={() => handleAsk(prompt)}
                        className="staggered-item"
                        style={{
                          textAlign: 'left',
                          fontSize: '11px',
                          color: '#2563eb',
                          backgroundColor: 'rgba(37,99,235,0.06)',
                          border: '1px solid rgba(37,99,235,0.15)',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s',
                          animationDelay: `${index * 0.05}s`
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(37,99,235,0.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(37,99,235,0.06)'; }}
                      >
                        {t(prompt)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    gap: '4px'
                  }}
                >
                  <div 
                    style={{
                      maxWidth: '88%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      lineHeight: '1.5',
                      whiteSpace: 'pre-wrap',
                      backgroundColor: msg.role === 'user' ? '#2563eb' : '#f8fafc',
                      color: msg.role === 'user' ? '#ffffff' : '#1e293b',
                      border: msg.role === 'user' ? 'none' : '1px solid #e2e8f0',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}
                  >
                    {t(msg.isThinking && msg.thinkingText && (
                      <div style={{
                        marginBottom: msg.text ? '8px' : '0',
                        fontSize: '11.5px',
                        color: '#475569',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <div style={{ position: 'relative', width: '20px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginRight: '4px' }}>
                          <div className="animate-dt-1" style={{ position: 'absolute', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#2563eb' }} />
                          <div className="animate-dt-2" style={{ position: 'absolute', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#3b82f6' }} />
                          <div className="animate-dt-3" style={{ position: 'absolute', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#60a5fa' }} />
                        </div>
                        <span style={{ fontStyle: 'italic' }}>{t(msg.thinkingText)}</span>
                      </div>
                    ))}
                    {t(msg.text)}

                    {/* Collaborative actions inside the agent response box */}
                    {!msg.isStreaming && msg.actions && msg.actions.length > 0 && (
                      <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px', borderTop: '1px dashed rgba(0,0,0,0.08)', paddingTop: '10px' }}>
                        {msg.actionStatus ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: msg.actionStatus === 'Approved' ? '#16a34a' : '#dc2626', fontWeight: 600, fontSize: '11px' }}>
                            <Check size={12} />
                            <span>{t(msg.actionStatus === 'Approved' ? 'Action Confirmed / Approved' : 'Action Declined')}</span>
                          </div>
                        ) : (
                          msg.actions.map((action, actionIdx) => (
                            <button
                              key={action.label}
                              className="staggered-item"
                              onClick={() => handleActionClick(msg.id, action, msg.vesselName)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '11px',
                                fontWeight: 600,
                                padding: '6px 12px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                border: action.primary ? 'none' : '1px solid rgba(0,0,0,0.15)',
                                backgroundColor: action.primary ? '#2563eb' : '#ffffff',
                                color: action.primary ? '#ffffff' : '#334155',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                transition: 'all 0.2s',
                                animationDelay: `${actionIdx * 60}ms`
                              }}
                              onMouseEnter={(e) => {
                                if (action.primary) {
                                  e.currentTarget.style.backgroundColor = '#1d4ed8';
                                } else {
                                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (action.primary) {
                                  e.currentTarget.style.backgroundColor = '#2563eb';
                                } else {
                                  e.currentTarget.style.backgroundColor = '#ffffff';
                                }
                              }}
                            >
                              {getActionIcon(action.type)}
                              <span>{t(action.label)}</span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* Feedback options (Thumbs Up / Down) outside of bubble */}
                  {msg.role === 'assistant' && !msg.isStreaming && !msg.isThinking && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px', paddingLeft: '8px', opacity: 0.7 }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFeedback(msg.id, 'up');
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '2px',
                          color: msg.feedback === 'up' ? '#2563eb' : '#94a3b8',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'color 0.2s'
                        }}
                        title={t("Thumbs Up")}
                      >
                        <ThumbsUp size={12} fill={msg.feedback === 'up' ? '#2563eb' : 'none'} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFeedback(msg.id, 'down');
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '2px',
                          color: msg.feedback === 'down' ? '#ef4444' : '#94a3b8',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'color 0.2s'
                        }}
                        title={t("Thumbs Down")}
                      >
                        <ThumbsDown size={12} fill={msg.feedback === 'down' ? '#ef4444' : 'none'} />
                      </button>
                    </div>
                  )}

                  {/* Suggested questions rendered directly under the AI response */}
                  {!msg.isStreaming && msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px', width: '85%' }}>
                      <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600, paddingLeft: '4px' }}>{t("Suggested Next Steps:")}</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {msg.suggestedQuestions.map((q, qIdx) => (
                          <button
                            key={q}
                            className="staggered-item"
                            onClick={() => handleAsk(q)}
                            disabled={isStreaming}
                            style={{
                              textAlign: 'left',
                              fontSize: '11px',
                              color: '#2563eb',
                              backgroundColor: 'rgba(37,99,235,0.06)',
                              border: '1px solid rgba(37,99,235,0.15)',
                              borderRadius: '8px',
                              padding: '6px 10px',
                              cursor: isStreaming ? 'not-allowed' : 'pointer',
                              transition: 'all 0.2s',
                              animationDelay: `${qIdx * 60}ms`
                            }}
                            onMouseEnter={(e) => { if (!isStreaming) e.currentTarget.style.backgroundColor = 'rgba(37,99,235,0.12)'; }}
                            onMouseLeave={(e) => { if (!isStreaming) e.currentTarget.style.backgroundColor = 'rgba(37,99,235,0.06)'; }}
                          >
                            {t(q)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAsk(chatInput);
                }}
                disabled={isStreaming}
                placeholder={t(isStreaming ? "Waiting for agent output..." : "Collaborate or type a query...")}
                style={{ flex: 1, border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', padding: '8px 10px', fontSize: '12px', outline: 'none', color: '#1e293b' }}
              />
              <button
                onClick={() => handleAsk(chatInput)}
                disabled={isStreaming || !chatInput.trim()}
                style={{ 
                  padding: '0 14px', 
                  borderRadius: '8px', 
                  border: 'none', 
                  backgroundColor: '#2563eb', 
                  color: 'white', 
                  fontWeight: 600, 
                  fontSize: '11px', 
                  cursor: (isStreaming || !chatInput.trim()) ? 'not-allowed' : 'pointer',
                  opacity: (isStreaming || !chatInput.trim()) ? 0.6 : 1
                }}
              >
                {t("Send")}</button>
            </div>
          </div>
        )}
      </div>

      {/* Right Controls: Weather & Status Panel + User Profile Dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Weather & Status Panel */}
        <div style={{
          display: 'flex',
          gap: '10px',
          padding: '6px 10px',
          borderRadius: '10px',
          fontSize: '10px',
          color: isLightMode ? '#1e293b' : '#ffffff',
          border: isLightMode ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.15)',
          backgroundColor: isLightMode ? 'rgba(255,255,255,0.6)' : 'var(--glass-dark-bg)',
          alignItems: 'center',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: isLightMode ? '#64748b' : 'var(--text-muted)', fontSize: '8px', textTransform: 'uppercase', fontWeight: 600 }}>{t("Time")}</span>
            <span style={{ fontWeight: 600, color: isLightMode ? '#0f172a' : '#ffffff' }}>17:31</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: isLightMode ? '#64748b' : 'var(--text-muted)', fontSize: '8px', textTransform: 'uppercase', fontWeight: 600 }}>{t("Wind")}</span>
            <span style={{ fontWeight: 600, color: isLightMode ? '#0f172a' : '#ffffff' }}>{t("SW 14kt")}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: isLightMode ? '#64748b' : 'var(--text-muted)', fontSize: '8px', textTransform: 'uppercase', fontWeight: 600 }}>{t("Vis")}</span>
            <span style={{ fontWeight: 600, color: isLightMode ? '#0f172a' : '#ffffff' }}>{t("12 NM")}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: isLightMode ? '#64748b' : 'var(--text-muted)', fontSize: '8px', textTransform: 'uppercase', fontWeight: 600 }}>{t("Temp")}</span>
            <span style={{ fontWeight: 600, color: isLightMode ? '#0f172a' : '#ffffff' }}>24°C</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: isLightMode ? '#64748b' : 'var(--text-muted)', fontSize: '8px', textTransform: 'uppercase', fontWeight: 600 }}>{t("State")}</span>
            <span style={{ fontWeight: 700, color: '#16a34a' }}>{t("Good")}</span>
          </div>
        </div>

        <LanguageSwitcher isLightMode={isLightMode} />

        {/* User Profile & Dropdown */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              borderRadius: '10px',
              border: isLightMode ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.15)',
              backgroundColor: isLightMode ? 'rgba(255,255,255,0.7)' : 'rgba(15, 23, 42, 0.6)',
              color: isLightMode ? '#1e293b' : '#ffffff',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: displayAvatarBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 700,
              color: 'white',
              flexShrink: 0
            }}>
              {t(displayName).charAt(0)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, lineHeight: 1.2 }}>{t(displayName)}</span>
              <span style={{ fontSize: '9px', color: isLightMode ? '#64748b' : '#94a3b8', textTransform: 'uppercase', fontWeight: 600, lineHeight: 1 }}>{t(displayRoleTitle)}</span>
            </div>
            <ChevronDown size={14} style={{ marginLeft: '4px', transition: 'transform 0.2s ease', transform: showRoleDropdown ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }} />
          </button>

          {/* User Profile Dropdown Menu */}
          {showRoleDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              backgroundColor: '#ffffff',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              zIndex: 1000,
              minWidth: '220px',
              overflow: 'hidden'
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{t(displayName)}</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{t(displayEmail)}</div>
                <div style={{ fontSize: '10px', color: '#2563eb', fontWeight: 700, marginTop: '4px', textTransform: 'uppercase' }}>{t(displayRoleTitle)}</div>
              </div>

              <button
                onClick={() => {
                  setShowRoleDropdown(false);
                  onLogout?.();
                }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#ef4444',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#fef2f2'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
              >
                <LogOut size={14} color="#ef4444" />
                <span>{t("Log Out")}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
