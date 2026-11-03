import React, { useState } from 'react';
import { Search, Sparkles, CheckSquare, Check, Clock, Globe, Anchor, Database, ArrowRight, Mic, Mail, Radio, Send, History, X, MessageSquare } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { getLanguage, t } from '../i18n';

type SupportedLanguage = 'English' | 'Arabic' | 'Hindi' | 'French' | 'Chinese';

const LANGUAGES: SupportedLanguage[] = ['English', 'Arabic', 'Hindi', 'French', 'Chinese'];

interface DbFieldChange {
  field: string;
  from: string;
  to: string;
}

interface DbUpdateProposal {
  vessel: string;
  summary: string;
  changes: DbFieldChange[];
}

interface ChatReply {
  id: string;
  sender: string;
  text: string;
  time: string;
  isMe?: boolean;
}

interface CommunicationMessage {
  id: string;
  sender: string;
  role: string;
  flag: string;
  originalText: string;
  originalLanguage: string;
  translations: Record<SupportedLanguage, string>;
  sentiment: 'URGENT' | 'NEUTRAL' | 'WARNING';
  channel: 'WhatsApp' | 'Mail' | 'Radio' | 'VHF Ch 16' | 'VHF Ch 12';
  time: string;
  isAiProcessed: boolean;
  actions: string[];
  dbUpdate?: DbUpdateProposal;
  audioUrl?: string;
  history?: ChatReply[];
}

interface CommunicationsProps {
  selectedMessageId?: string | null;
  onSelectMessageId?: (id: string | null) => void;
}

export const Communications: React.FC<CommunicationsProps> = ({
  selectedMessageId,
  onSelectMessageId
}) => {

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'WhatsApp':
        return <FaWhatsapp size={14} color="#25D366" />;
      case 'Mail':
        return <Mail size={14} color="#ea4335" />;
      case 'Radio':
        return <Radio size={14} color="#3b82f6" />;
      default:
        return <Anchor size={14} color="#0284c7" />;
    }
  };

  const getChannelBadgeStyle = (channel: string) => {
    switch (channel) {
      case 'WhatsApp':
        return { bg: 'rgba(37, 211, 102, 0.12)', border: 'rgba(37, 211, 102, 0.3)', color: '#15803d', label: 'WhatsApp' };
      case 'Mail':
        return { bg: 'rgba(234, 67, 53, 0.12)', border: 'rgba(234, 67, 53, 0.3)', color: '#b91c1c', label: 'Email' };
      case 'Radio':
        return { bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.3)', color: '#1d4ed8', label: 'Radio' };
      default:
        return { bg: 'rgba(2, 132, 199, 0.12)', border: 'rgba(2, 132, 199, 0.3)', color: '#0369a1', label: channel };
    }
  };

  const [messages, setMessages] = useState<CommunicationMessage[]>([
    {
      id: '4',
      sender: 'GULF ZENITH',
      role: 'Master',
      flag: '🇲🇹',
      originalText: 'مراقبة الميناء المحترمة، السفينة GULF ZENITH تحتاج إلى تغيير الرصيف. الرصيف الحالي GCT-B31 غير متاح.',
      originalLanguage: 'Arabic',
      translations: {
        English: 'Dear port control, GULF ZENITH needs berth change. Current berth GCT-B31 unavailable.',
        Arabic: 'مراقبة الميناء المحترمة، السفينة GULF ZENITH تحتاج إلى تغيير الرصيف. الرصيف الحالي GCT-B31 غير متاح.',
        Hindi: 'आदरणीय पोर्ट कंट्रोल, GULF ZENITH को बर्थ बदलने की आवश्यकता है। वर्तमान बर्थ GCT-B31 उपलब्ध नहीं है।',
        French: "Cher contrôle portuaire, GULF ZENITH a besoin d'un changement de poste. Le poste actuel GCT-B31 est indisponible.",
        Chinese: '尊敬的港口管制，GULF ZENITH需要更换泊位。当前泊位GCT-B31不可用。'
      },
      sentiment: 'NEUTRAL',
      channel: 'Radio',
      time: '02:24 PM',
      isAiProcessed: true,
      audioUrl: '/generated-audio.mp3',
      actions: [
        'Find alternative berth for GULF ZENITH',
        'Update berthing schedule',
        'Notify vessel agent'
      ],
      dbUpdate: {
        vessel: 'GULF ZENITH',
        summary: 'Berth reassignment requested — GCT-B31 unavailable',
        changes: [
          { field: 'Assigned Berth', from: 'GCT-B31', to: 'GCT Berth 28 (pending confirmation)' }
        ]
      },
      history: [
        { id: 'h4-1', sender: 'GULF ZENITH (VHF Ch 12)', text: 'Port Control, GULF ZENITH requesting inbound harbor clearance.', time: '02:10 PM', isMe: false },
        { id: 'h4-2', sender: 'Port Control', text: 'GULF ZENITH, Port Control. Cleared to approach breakwater at 8 knots.', time: '02:14 PM', isMe: true },
        { id: 'h4-3', sender: 'GULF ZENITH (VHF Ch 12)', text: 'Control, berth GCT-B31 is blocked by heavy crane barge.', time: '02:20 PM', isMe: false },
        { id: 'h4-4', sender: 'Port Control', text: 'Acknowledged. Hold position 1.2 NM east of outer buoy.', time: '02:22 PM', isMe: true },
        { id: 'h4-5', sender: 'GULF ZENITH (VHF Ch 12)', text: 'مراقبة الميناء المحترمة، السفينة GULF ZENITH تحتاج إلى تغيير الرصيف. الرصيف الحالي GCT-B31 غير متاح.', time: '02:24 PM', isMe: false }
      ]
    },
    {
      id: '6',
      sender: 'DHOFAR SPIRIT',
      role: 'Master',
      flag: '🇲🇭',
      originalText: 'Port Control, DHOFAR SPIRIT. Confirming tug assist request. We are approaching the breakwater, winds are picking up. Requesting extra tug support.',
      originalLanguage: 'English',
      translations: {
        English: 'Port Control, DHOFAR SPIRIT. Confirming tug assist request. We are approaching the breakwater, winds are picking up. Requesting extra tug support.',
        Arabic: 'مراقبة الميناء، هنا DHOFAR SPIRIT. نؤكد طلب المساعدة بالقاطرات. نقترب من حاجز الأمواج والرياح تشتد. نطلب دعماً إضافياً بالقاطرات.',
        Hindi: 'पोर्ट कंट्रोल, यह DHOFAR SPIRIT है। टग सहायता अनुरोध की पुष्टि करते हैं। हम ब्रेकवाटर के पास पहुँच रहे हैं, हवाएँ तेज़ हो रही हैं। अतिरिक्त टग सहायता का अनुरोध है।',
        French: "Port Control, DHOFAR SPIRIT. Confirmant la demande d'assistance de remorqueur. Nous approchons de la digue, les vents se renforcent. Demande de soutien de remorqueur supplémentaire.",
        Chinese: '港口管制，这里是DHOFAR SPIRIT。确认拖船协助请求。我们正在接近防波堤，风力正在增强。请求额外的拖船支持。'
      },
      sentiment: 'WARNING',
      channel: 'VHF Ch 12',
      time: '02:16 PM',
      isAiProcessed: true,
      actions: [
        'Coordinate extra tug support with Tug Poseidon',
        'Monitor wind speeds'
      ],
      dbUpdate: {
        vessel: 'DHOFAR SPIRIT',
        summary: 'Extra tug support requested due to high winds',
        changes: [
          { field: 'Required Tugs', from: '2', to: '3' }
        ]
      },
      history: [
        { id: 'h6-1', sender: 'DHOFAR SPIRIT (VHF)', text: 'Port Control, entering channel south sector.', time: '01:55 PM', isMe: false },
        { id: 'h6-2', sender: 'Port Control', text: 'Maintain speed below 6 knots. Wind gusting 24 knots SSE.', time: '02:00 PM', isMe: true },
        { id: 'h6-3', sender: 'DHOFAR SPIRIT (VHF)', text: 'Noted Control. Bow thruster active.', time: '02:05 PM', isMe: false },
        { id: 'h6-4', sender: 'Port Control', text: 'Tug Poseidon on standby at berth entrance.', time: '02:10 PM', isMe: true },
        { id: 'h6-5', sender: 'DHOFAR SPIRIT (VHF)', text: 'Requesting second tug for starboard quarter tie-up.', time: '02:16 PM', isMe: false }
      ]
    },
    {
      id: '7',
      sender: 'CMA CGM SOHAR',
      role: 'Shipping Agent',
      flag: '🇫🇷',
      originalText: 'Bonjour control. Envoyé via WhatsApp: Nous confirmons l\'arrivée de 420 TEU frigorifiques. Le navire est prêt pour le déchargement immédiat à Salalah Container Terminal.',
      originalLanguage: 'French',
      translations: {
        English: 'Hello control. Sent via WhatsApp: We confirm arrival of 420 reefer TEUs. Ship is ready for immediate discharge at Salalah Container Terminal.',
        Arabic: 'مرحباً بالمراقبة. مرسل عبر واتساب: نؤكد وصول 420 حاوية مبردة. السفينة جاهزة للتفريغ الفوري في محطة حاويات صلالة.',
        Hindi: 'नमस्ते कंट्रोल। व्हाट्सऐप द्वारा भेजा गया: हम 420 रीफर TEU के आगमन की पुष्टि करते हैं। जहाज़ सलालाह कंटेनर टर्मिनल पर तत्काल अनलोडिंग के लिए तैयार है।',
        French: 'Bonjour control. Envoyé via WhatsApp: Nous confirmons l\'arrivée de 420 TEU frigorifiques. Le navire est prêt pour le déchargement immédiat à Salalah Container Terminal.',
        Chinese: '你好控制中心。通过WhatsApp发送：我们确认420个冷藏箱到港。船舶已准备好在塞拉莱集装箱码头立即卸货。'
      },
      sentiment: 'NEUTRAL',
      channel: 'WhatsApp',
      time: '02:45 PM',
      isAiProcessed: true,
      actions: ['Schedule reefer plug-in units', 'Assign stevedore gantry team'],
      dbUpdate: {
        vessel: 'CMA CGM SOHAR',
        summary: 'Reefer container manifest confirmed via WhatsApp',
        changes: [
          { field: 'Reefer TEU Count', from: '350', to: '420' }
        ]
      },
      history: [
        { id: 'h7-1', sender: 'CMA CGM Agent (WhatsApp)', text: 'Good morning Port Control! CMA CGM SOHAR manifest pre-check.', time: '01:30 PM', isMe: false },
        { id: 'h7-2', sender: 'Port Control', text: 'Hello! Send over reefer container counts for SCT berth.', time: '01:40 PM', isMe: true },
        { id: 'h7-3', sender: 'CMA CGM Agent (WhatsApp)', text: 'Updating tally sheet now. Previous estimate was 350 TEU.', time: '02:00 PM', isMe: false },
        { id: 'h7-4', sender: 'Port Control', text: 'Standing by for final reefer count to reserve plug slots.', time: '02:25 PM', isMe: true },
        { id: 'h7-5', sender: 'CMA CGM Agent (WhatsApp)', text: 'Bonjour control. Envoyé via WhatsApp: Nous confirmons l\'arrivée de 420 TEU frigorifiques. Le navire est prêt pour le déchargement immédiat à Salalah Container Terminal.', time: '02:45 PM', isMe: false }
      ]
    },
    {
      id: '8',
      sender: 'MAERSK RAYSUT',
      role: 'Port Logistics Manager',
      flag: '🇩🇰',
      originalText: 'WhatsApp message: Urgent request for pilotage extension. Customs clearance for hazardous cargo batch #9921 finalized.',
      originalLanguage: 'English',
      translations: {
        English: 'WhatsApp message: Urgent request for pilotage extension. Customs clearance for hazardous cargo batch #9921 finalized.',
        Arabic: 'رسالة واتساب: طلب عاجل لتمديد الإرشاد البحري. تم إنهاء التخليص الجمركي لدفعة البضائع الخطرة رقم 9921.',
        Hindi: 'व्हाट्सऐप संदेश: पायलटेज विस्तार के लिए तत्काल अनुरोध। खतरनाक कार्गो बैच #9921 की सीमा शुल्क मंज़ूरी पूरी हो गई है।',
        French: 'Message WhatsApp: Demande urgente de prolongation de pilotage. Dédouanement finalisé pour le lot de marchandises dangereuses n°9921.',
        Chinese: 'WhatsApp消息：紧急请求扩展引航时间。危险货物批次#9921的海关通关已完成。'
      },
      sentiment: 'URGENT',
      channel: 'WhatsApp',
      time: '02:50 PM',
      isAiProcessed: true,
      actions: ['Extend pilotage slot', 'Verify Hazmat batch #9921 clearance'],
      history: [
        { id: 'h8-1', sender: 'Maersk Logistics (WhatsApp)', text: 'Port Control, Hazmat batch #9921 documentation submitted to Customs.', time: '01:10 PM', isMe: false },
        { id: 'h8-2', sender: 'Port Control', text: 'Customs review pending. Pilot window currently set for 15:00.', time: '01:35 PM', isMe: true },
        { id: 'h8-3', sender: 'Maersk Logistics (WhatsApp)', text: 'Inspector delayed on quay 4. Requesting 30 min buffer.', time: '02:05 PM', isMe: false },
        { id: 'h8-4', sender: 'Port Control', text: 'Please send clearance confirmation as soon as stamped.', time: '02:30 PM', isMe: true },
        { id: 'h8-5', sender: 'Maersk Logistics (WhatsApp)', text: 'WhatsApp message: Urgent request for pilotage extension. Customs clearance for hazardous cargo batch #9921 finalized.', time: '02:50 PM', isMe: false }
      ]
    },
    {
      id: '9',
      sender: 'DHOFAR SHIPPING AGENCY',
      role: 'Shipping Line Rep',
      flag: '🇴🇲',
      originalText: `Subject: RE: Official Berth Slot & Bunkering Confirmation — MAERSK DHOFAR
From: ops@dhofarshipping.om
To: portcontrol@salalahport.com
Date: Tue, 21 Jul 2026 13:15:20 +0400

Dear Port Operations Team,

Please accept this official email notification regarding the berth slot confirmation for vessel MAERSK DHOFAR (IMO 9786528).

- Confirmed Berth: Salalah Container Terminal Berth 5
- Fuel Bunkering Barge: Bunkering Vessel 'Dhofar Bunker I'
- Scheduled Window: Tomorrow, 22 Jul 2026, 06:00 - 10:00 GST

Kindly confirm receipt and issue necessary clearance permits into the Oman PCS Port Community System.

Best regards,
Dhofar Shipping Agency Operations Dept.`,
      originalLanguage: 'English',
      translations: {
        English: 'Email received: Official notification regarding berth slot confirmation for MAERSK DHOFAR. Fuel bunkering scheduled tomorrow morning 06:00.',
        Arabic: 'تم استلام بريد إلكتروني: إشعار رسمي بشأن تأكيد موعد الرصيف للسفينة MAERSK DHOFAR. التزود بالوقود مجدول صباح الغد الساعة 06:00.',
        Hindi: 'ईमेल प्राप्त हुआ: MAERSK DHOFAR के लिए बर्थ स्लॉट पुष्टि के संबंध में आधिकारिक सूचना। ईंधन बंकरिंग कल सुबह 06:00 बजे निर्धारित है।',
        French: 'E-mail reçu: Notification officielle concernant la confirmation de poste pour MAERSK DHOFAR. Ravitaillement programmé demain 06:00.',
        Chinese: '收到邮件：关于MAERSK DHOFAR泊位确认的官方通知。燃油加注计划于明天上午06:00进行。'
      },
      sentiment: 'NEUTRAL',
      channel: 'Mail',
      time: '01:15 PM',
      isAiProcessed: true,
      actions: ['Confirm bunkering barge permit', 'Log fuel schedule into Oman PCS'],
      history: [
        { id: 'h9-1', sender: 'ops@dhofarshipping.om', text: 'Subject: Pre-Arrival Inquiry — MAERSK DHOFAR bunkering requirements.', time: '09:30 AM', isMe: false },
        { id: 'h9-2', sender: 'portcontrol@salalahport.com', text: 'RE: Pre-Arrival Inquiry — Please submit formal request with bunker barge registration numbers.', time: '10:15 AM', isMe: true },
        { id: 'h9-3', sender: 'ops@dhofarshipping.om', text: 'RE: Pre-Arrival Inquiry — Registration numbers provided for Bunkering Vessel Dhofar Bunker I.', time: '11:40 AM', isMe: false },
        { id: 'h9-4', sender: 'portcontrol@salalahport.com', text: 'RE: Pre-Arrival Inquiry — Information validated. Awaiting final scheduling email.', time: '12:20 PM', isMe: true },
        { id: 'h9-5', sender: 'ops@dhofarshipping.om', text: `Subject: RE: Official Berth Slot & Bunkering Confirmation — MAERSK DHOFAR\nFrom: ops@dhofarshipping.om\n\nDear Port Operations Team,\n\nPlease accept this official email notification regarding berth slot confirmation for MAERSK DHOFAR. Bunkering scheduled 06:00 tomorrow morning.`, time: '01:15 PM', isMe: false }
      ]
    }
  ]);




  const [localSelectedId, setLocalSelectedId] = useState<string>('4');
  const selectedId = selectedMessageId || localSelectedId;
  const setSelectedId = onSelectMessageId || setLocalSelectedId;
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actionStates, setActionStates] = useState<Record<string, boolean>>({});
  const [displayLanguage, setDisplayLanguage] = useState<SupportedLanguage>(getLanguage() === 'ar' ? 'Arabic' : 'English');
  const [dbUpdateApplied, setDbUpdateApplied] = useState<Record<string, boolean>>({});
  const [replyText, setReplyText] = useState<string>('');
  const [showReplyToast, setShowReplyToast] = useState<boolean>(false);
  const [channelFilter, setChannelFilter] = useState<'ALL' | 'WhatsApp' | 'Mail' | 'Radio'>('ALL');
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);

  const toggleAction = (key: string) => {
    setActionStates(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const applyDbUpdate = (id: string) => {
    setDbUpdateApplied(prev => ({ ...prev, [id]: true }));
  };

  const handleSendReply = (sender: string, channel: string) => {
    if (!replyText.trim()) return;

    const newReply: ChatReply = {
      id: Date.now().toString(),
      sender: `Port Control → ${sender} (${channel})`,
      text: replyText.trim(),
      time: 'Just now',
      isMe: true
    };

    setMessages(prev => prev.map(m => {
      if (m.id === selectedId) {
        return {
          ...m,
          history: [...(m.history || []), newReply]
        };
      }
      return m;
    }));

    setShowReplyToast(true);
    setReplyText('');
    setTimeout(() => {
      setShowReplyToast(false);
    }, 4000);
  };

  const selectedMsg = messages.find(m => m.id === selectedId) || messages[0];

  const filteredMessages = messages.filter(m => {
    const matchesSearch = t(m.sender).toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t(m.originalText).toLowerCase().includes(searchQuery.toLowerCase());
    
    if (channelFilter === 'ALL') return matchesSearch;
    if (channelFilter === 'WhatsApp') return matchesSearch && m.channel === 'WhatsApp';
    if (channelFilter === 'Mail') return matchesSearch && m.channel === 'Mail';
    if (channelFilter === 'Radio') return matchesSearch && (m.channel === 'Radio' || m.channel.startsWith('VHF'));
    return matchesSearch;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', width: '100%', height: 'calc(100vh - 85px)', gap: '16px', padding: '24px 32px 0 32px', overflow: 'hidden' }}>

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', flexShrink: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', margin: 0, letterSpacing: '-0.3px' }}>
              {t("Multilingual Communication Center")}</h1>
            <span style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              fontSize: '11px', 
              backgroundColor: 'rgba(16, 185, 129, 0.08)', 
              color: '#16a34a', 
              border: '1px solid rgba(16, 185, 129, 0.15)', 
              padding: '3px 10px', 
              borderRadius: '6px',
              fontWeight: 600
            }}>
              <span style={{ 
                width: '6px', 
                height: '6px', 
                backgroundColor: '#16a34a', 
                borderRadius: '50%', 
                display: 'inline-block'
              }} />
              {t("AI Active")}</span>
          </div>
          <p style={{ color: '#475569', fontSize: '13px', marginTop: '4px' }}>
            {t("Whisper + GPT-4o · Real-time translation, multi-channel dispatch & full chat history")}</p>
        </div>
      </div>

      {/* Search Bar & Channel Filter Chips */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', flexShrink: 0 }}>
        <div style={{ flex: 1, minWidth: '260px', maxWidth: '400px', display: 'flex', alignItems: 'center', padding: '0 16px', height: '44px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)', backgroundColor: 'rgba(255,255,255,0.7)' }}>
          <Search size={16} color="#64748b" style={{ marginRight: '10px' }} />
          <input
            type="text"
            placeholder={t("Search communication logs...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              color: '#1e293b',
              fontSize: '13px',
              outline: 'none'
            }}
          />
        </div>

        {/* Channel Filter Chips */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'All Channels', icon: Globe },
            { id: 'WhatsApp', label: 'WhatsApp', icon: FaWhatsapp },
            { id: 'Mail', label: 'Email', icon: Mail },
            { id: 'Radio', label: 'VHF / Radio', icon: Radio }
          ].map((chip) => {
            const isActive = channelFilter === chip.id;
            const Icon = chip.icon;
            return (
              <button
                key={chip.id}
                onClick={() => setChannelFilter(chip.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '20px',
                  border: isActive ? '1px solid #2563eb' : '1px solid rgba(0,0,0,0.08)',
                  backgroundColor: isActive ? '#2563eb' : 'rgba(255,255,255,0.6)',
                  color: isActive ? 'white' : '#475569',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={13} color={isActive ? 'white' : (chip.id === 'WhatsApp' ? '#25D366' : chip.id === 'Mail' ? '#ea4335' : '#475569')} />
                {t(chip.label)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Workspace Split */}
      <div style={{ display: 'flex', flex: 1, gap: '24px', minHeight: 0, paddingBottom: '24px', overflow: 'hidden' }}>

        {/* Left Column: Recent Messages List (Expanded Width & Separate Scroll) */}
        <div style={{ flex: '1.2 1 420px', minWidth: '360px', display: 'flex', flexDirection: 'column', gap: '12px', height: '100%', minHeight: 0 }}>
          <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '1.5px', margin: '0 0 4px 0', flexShrink: 0 }}>
            {t("Live Feed (")}{filteredMessages.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', flex: 1, minHeight: 0, paddingRight: '6px' }}>
            {filteredMessages.map((msg) => {
              const isSelected = msg.id === selectedId;
              const isUrgent = msg.sentiment === 'URGENT';
              const badgeStyle = getChannelBadgeStyle(msg.channel);
              
              return (
                <div
                  key={msg.id}
                  onClick={() => setSelectedId(msg.id)}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    border: isSelected ? '1.5px solid #2563eb' : '1px solid rgba(0,0,0,0.08)',
                    backgroundColor: 'rgba(234, 241, 243, 0.75)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px' }}>{t(msg.flag)}</span>
                      <span style={{ fontWeight: 700, fontSize: '14.5px', color: '#1e293b' }}>{t(msg.sender)}</span>
                      <span style={{ fontSize: '11px', color: '#475569' }}>({t(msg.role)})</span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={11} />
                      {t(msg.time)}
                    </span>
                  </div>

                  <p dir="auto" style={{ 
                    fontSize: '12.5px', 
                    color: '#334155', 
                    margin: '0 0 12px 0', 
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis',
                    fontWeight: 500
                  }}>
                    {t(msg.originalText)}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ 
                        fontSize: '9px', 
                        fontWeight: 700, 
                        backgroundColor: isUrgent ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0,0,0,0.04)', 
                        color: isUrgent ? '#ef4444' : '#475569', 
                        padding: '2px 6px', 
                        borderRadius: '4px', 
                        border: isUrgent ? '1px solid rgba(239, 68, 68, 0.15)' : '1px solid rgba(0,0,0,0.08)'
                      }}>
                        {t(msg.sentiment)}
                      </span>
                      {msg.isAiProcessed && (
                        <span style={{ 
                          fontSize: '9px', 
                          fontWeight: 700, 
                          backgroundColor: 'rgba(37, 99, 235, 0.08)', 
                          color: '#2563eb', 
                          padding: '2px 6px', 
                          borderRadius: '4px',
                          border: '1px solid rgba(37, 99, 235, 0.15)'
                        }}>
                          {t("AI Processed")}</span>
                      )}
                    </div>
                    {/* Distinct Channel Badge */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: 700,
                      backgroundColor: badgeStyle.bg,
                      border: `1px solid ${badgeStyle.border}`,
                      color: badgeStyle.color
                    }}>
                      {getChannelIcon(msg.channel)}
                      <span>{t(badgeStyle.label)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detail Pane (Narrower Width & Separate Scroll) */}
        <div style={{ flex: '0.85 1 380px', maxWidth: '480px', minWidth: '320px', display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
          <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '1.5px', margin: '0 0 12px 0', flexShrink: 0 }}>
            {t("Message Detail")}</h3>

          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid rgba(0,0,0,0.08)', backgroundColor: 'rgba(234, 241, 243, 0.75)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>

            {/* Header metadata */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '24px' }}>{t(selectedMsg.flag)}</span>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                      {t(selectedMsg.sender)}
                    </h2>
                    <div style={{ fontSize: '11.5px', color: '#475569', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{t(selectedMsg.role)}</span>
                      <span>•</span>
                      <span style={{ color: '#2563eb', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {getChannelIcon(selectedMsg.channel)}
                        {t(selectedMsg.channel)} · {t(selectedMsg.originalLanguage)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setShowHistoryModal(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(37,99,235,0.25)',
                    backgroundColor: 'rgba(37,99,235,0.08)',
                    color: '#2563eb',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <History size={13} />
                  {t("Chat History (")}{selectedMsg.history ? selectedMsg.history.length : 0})
                </button>
                <span style={{ 
                  fontSize: '10px', 
                  fontWeight: 700, 
                  backgroundColor: selectedMsg.sentiment === 'URGENT' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0,0,0,0.04)', 
                  color: selectedMsg.sentiment === 'URGENT' ? '#ef4444' : '#475569', 
                  padding: '4px 10px', 
                  borderRadius: '6px',
                  border: selectedMsg.sentiment === 'URGENT' ? '1px solid rgba(239, 68, 68, 0.15)' : '1px solid rgba(0,0,0,0.08)'
                }}>
                  {t(selectedMsg.sentiment)}
                </span>
              </div>
            </div>

            {/* Radio recording playback */}
            {t(selectedMsg.audioUrl && (
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mic size={12} />
                  <span>{t("Radio Recording Playback")}</span>
                </div>
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                  <audio
                    key={selectedMsg.id}
                    controls
                    src={selectedMsg.audioUrl}
                    style={{ width: '100%', height: '36px' }}
                  />
                </div>
              </div>
            ))}

            {/* Original message text box / Authentic Email formatting */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                {t(selectedMsg.channel === 'Mail' ? 'Incoming Email Message' : (selectedMsg.audioUrl ? 'Radio Transcript' : 'Original Message'))}
              </div>
              
              {selectedMsg.channel === 'Mail' ? (
                <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #cbd5e1', boxShadow: '0 2px 6px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                  {/* Email Header Bar */}
                  <div style={{ padding: '12px 16px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                      <Mail size={14} color="#ea4335" />
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>{t("From:")}</span>
                      <span style={{ color: '#334155' }}>{t(selectedMsg.sender)} {t(" <ops@dhofarshipping.om>")}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      <span style={{ fontWeight: 600 }}>{t("To:")}</span> {t(" Port Operations Control <portcontrol@salalahport.com>")}</div>
                  </div>
                  {/* Email Body */}
                  <div style={{ padding: '16px', fontSize: '12.5px', color: '#1e293b', lineHeight: 1.6, whiteSpace: 'pre-wrap', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    {t(selectedMsg.originalText)}
                  </div>
                </div>
              ) : (
                <div dir="auto" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)', fontSize: '13px', color: '#1e293b', lineHeight: 1.5 }}>
                  {t(selectedMsg.originalText)}
                </div>
              )}
            </div>

            {/* Translation box */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={12} />
                  <span>{t("AI Translation (")}{t(displayLanguage)})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 8px', height: '28px', borderRadius: '6px', border: '1px solid rgba(37, 99, 235, 0.2)', backgroundColor: 'rgba(37, 99, 235, 0.06)' }}>
                  <Globe size={12} color="#2563eb" />
                  <select
                    value={displayLanguage}
                    onChange={(e) => setDisplayLanguage(e.target.value as SupportedLanguage)}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      outline: 'none',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      color: '#2563eb',
                      cursor: 'pointer'
                    }}
                  >
                    {LANGUAGES.map(lang => (
                      <option key={lang} value={lang}>{t(lang)}</option>
                    ))}
                  </select>
                </div>
              </div>
              {selectedMsg.originalLanguage !== displayLanguage ? (
                <div dir="auto" style={{ backgroundColor: 'rgba(37, 99, 235, 0.05)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(37, 99, 235, 0.12)', fontSize: '13px', color: '#1e293b', lineHeight: 1.5 }}>
                  {t(selectedMsg.translations[displayLanguage])}
                </div>
              ) : (
                <div style={{ backgroundColor: 'rgba(37, 99, 235, 0.05)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(37, 99, 235, 0.12)', fontSize: '13px', color: '#94a3b8', lineHeight: 1.5, fontStyle: 'italic' }}>
                  {t("Message is already in ")}{t(displayLanguage)}.
                </div>
              )}
            </div>

            {/* Actions list */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckSquare size={12} />
                <span>{t("AI Extracted Action Items")}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedMsg.actions.map((act, index) => {
                  const key = `${selectedMsg.id}-${index}`;
                  const isChecked = !!actionStates[key];
                  return (
                    <div 
                      key={index} 
                      onClick={() => toggleAction(key)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        backgroundColor: isChecked ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.3)', 
                        padding: '10px 14px', 
                        borderRadius: '8px', 
                        border: isChecked ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(0,0,0,0.06)',
                        cursor: 'pointer',
                        gap: '12px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ 
                        width: '20px', 
                        height: '20px', 
                        borderRadius: '4px', 
                        border: isChecked ? '1.5px solid #10b981' : '1.5px solid rgba(0,0,0,0.2)', 
                        backgroundColor: isChecked ? '#10b981' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {isChecked && <Check size={12} color="white" strokeWidth={3.5} />}
                      </div>
                      <span style={{ fontSize: '12px', color: isChecked ? '#047857' : '#1e293b', textDecoration: isChecked ? 'line-through' : 'none', fontWeight: 500 }}>
                        {t(act)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Port Database Update proposal */}
            {selectedMsg.dbUpdate && (
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Database size={12} />
                  <span>{t("Oman PCS Database Update Available")}</span>
                </div>
                <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.06)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  <div style={{ fontSize: '12.5px', color: '#1e293b', fontWeight: 600, marginBottom: '10px' }}>
                    {t(selectedMsg.dbUpdate.vessel)} — {t(selectedMsg.dbUpdate.summary)}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                    {selectedMsg.dbUpdate.changes.map((change, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', backgroundColor: 'rgba(255,255,255,0.5)', padding: '8px 10px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.06)' }}>
                        <span style={{ color: '#64748b', fontWeight: 600, minWidth: '110px' }}>{t(change.field)}</span>
                        <span style={{ color: '#94a3b8', textDecoration: 'line-through' }}>{t(change.from)}</span>
                        <ArrowRight size={12} color="#b45309" />
                        <span style={{ color: '#0f172a', fontWeight: 700 }}>{t(change.to)}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => applyDbUpdate(selectedMsg.id)}
                    disabled={!!dbUpdateApplied[selectedMsg.id]}
                    style={{
                      width: '100%',
                      height: '38px',
                      borderRadius: '7px',
                      backgroundColor: dbUpdateApplied[selectedMsg.id] ? 'rgba(16, 185, 129, 0.12)' : '#b45309',
                      border: dbUpdateApplied[selectedMsg.id] ? '1px solid rgba(16, 185, 129, 0.3)' : 'none',
                      color: dbUpdateApplied[selectedMsg.id] ? '#047857' : 'white',
                      fontWeight: 600,
                      fontSize: '12.5px',
                      cursor: dbUpdateApplied[selectedMsg.id] ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    {dbUpdateApplied[selectedMsg.id] ? (
                      <>
                        <Check size={14} />
                        {t("Oman PCS Database Updated")}</>
                    ) : (
                      <>
                        <Database size={14} />
                        {t("Update Oman PCS Database")}</>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Chat Thread History Section (MOVED TO BOTTOM) */}
            <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MessageSquare size={13} color="#2563eb" />
                  <span>{t("Communication Thread History (")}{t(selectedMsg.channel)})</span>
                </div>
                <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>
                  {t(selectedMsg.history ? `${selectedMsg.history.length} past messages` : '0 past messages')}
                </span>
              </div>

              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '220px', overflowY: 'auto' }}>
                {selectedMsg.history && selectedMsg.history.map((hItem) => (
                  <div 
                    key={hItem.id} 
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '4px', 
                      alignSelf: hItem.isMe ? 'flex-end' : 'flex-start', 
                      maxWidth: '85%' 
                    }}
                  >
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600, textAlign: hItem.isMe ? 'right' : 'left' }}>
                      {t(hItem.sender)} · {t(hItem.time)}
                    </div>
                    <div style={{ 
                      backgroundColor: hItem.isMe ? '#2563eb' : '#ffffff', 
                      color: hItem.isMe ? '#ffffff' : '#1e293b', 
                      border: hItem.isMe ? 'none' : '1px solid rgba(0,0,0,0.08)', 
                      borderRadius: '8px', 
                      padding: '8px 12px', 
                      fontSize: '12px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}>
                      {t(hItem.text)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reply Section — Disabled for Radio/VHF channels */}
            {selectedMsg.channel === 'Radio' || selectedMsg.channel.startsWith('VHF') ? (
              <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: 'rgba(241, 245, 249, 0.8)', border: '1px solid rgba(0,0,0,0.08)', color: '#64748b', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Radio size={14} color="#3b82f6" />
                <span><strong>{t("Radio Channel (Voice Transmission Only)")}</strong> {t(" — Direct text reply is disabled. Use dispatch microphone console for radio responses.")}</span>
              </div>
            ) : (
              <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ArrowRight size={12} />
                  <span>{t("Reply via ")}{t(selectedMsg.channel === 'Mail' ? 'Email' : selectedMsg.channel)}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendReply(selectedMsg.sender, selectedMsg.channel);
                    }}
                    placeholder={t(selectedMsg.channel === 'Mail' ? `Draft official email response to ${selectedMsg.sender}...` : `Send WhatsApp reply to ${selectedMsg.sender}...`)}
                    style={{
                      flex: 1,
                      height: '42px',
                      borderRadius: '8px',
                      border: '1px solid rgba(0,0,0,0.12)',
                      padding: '0 14px',
                      fontSize: '12.5px',
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      outline: 'none',
                      color: '#1e293b'
                    }}
                  />
                  <button
                    onClick={() => handleSendReply(selectedMsg.sender, selectedMsg.channel)}
                    disabled={!replyText.trim()}
                    style={{
                      padding: '0 18px',
                      height: '42px',
                      borderRadius: '8px',
                      backgroundColor: replyText.trim() ? (selectedMsg.channel === 'WhatsApp' ? '#25D366' : '#2563eb') : '#cbd5e1',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '12.5px',
                      border: 'none',
                      cursor: replyText.trim() ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease',
                      boxShadow: replyText.trim() ? '0 2px 8px rgba(0,0,0,0.15)' : 'none'
                    }}
                  >
                    {selectedMsg.channel === 'WhatsApp' ? <FaWhatsapp size={15} /> : <Mail size={15} />}
                    {t(selectedMsg.channel === 'Mail' ? 'Send Email' : 'Send')}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Reply Sent Success Toast */}
      {showReplyToast && (
        <div 
          className="animate-fade-in"
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '12px 18px',
            borderRadius: '10px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 9999,
            border: '1px solid rgba(255,255,255,0.15)'
          }}
        >
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Check size={14} color="white" strokeWidth={3} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 700 }}>{t("Reply Transmitted!")}</span>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>{t("Message sent directly to ")}{t(selectedMsg.sender)} {t(" via ")}{t(selectedMsg.channel)}.</span>
          </div>
        </div>
      )}
      {/* Full Chat History Modal Overlay */}
      {showHistoryModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(6px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
        >
          <div 
            className="animate-fade-in"
            style={{
              width: '100%',
              maxWidth: '650px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '80vh',
              overflow: 'hidden',
              border: '1px solid rgba(0,0,0,0.1)'
            }}
          >
            {/* Modal Header */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '22px' }}>{t(selectedMsg.flag)}</span>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    {t(selectedMsg.sender)} {t(" — Communication History")}</h3>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{t(selectedMsg.role)}</span>
                    <span>•</span>
                    <span style={{ color: '#2563eb', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {getChannelIcon(selectedMsg.channel)}
                      {t(selectedMsg.channel)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowHistoryModal(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={16} color="#64748b" />
              </button>
            </div>

            {/* Chat Thread Messages Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px', backgroundColor: '#f1f5f9' }}>
              {/* Initial message */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px', maxWidth: '85%' }}>
                <div style={{ fontSize: '10px', fontWeight: 600, color: '#64748b' }}>
                  {t(selectedMsg.sender)} ({t(selectedMsg.role)}) · {t(selectedMsg.time)}
                </div>
                <div dir="auto" style={{ backgroundColor: '#ffffff', color: '#1e293b', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', lineHeight: '1.5', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  {t(selectedMsg.originalText)}
                </div>
              </div>

              {/* Thread history */}
              {selectedMsg.history && selectedMsg.history.map((chat) => (
                <div 
                  key={chat.id} 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: chat.isMe ? 'flex-end' : 'flex-start', 
                    gap: '4px', 
                    alignSelf: chat.isMe ? 'flex-end' : 'flex-start',
                    maxWidth: '85%' 
                  }}
                >
                  <div style={{ fontSize: '10px', fontWeight: 600, color: '#64748b' }}>
                    {t(chat.sender)} · {t(chat.time)}
                  </div>
                  <div 
                    style={{ 
                      backgroundColor: chat.isMe ? '#2563eb' : '#ffffff', 
                      color: chat.isMe ? '#ffffff' : '#1e293b', 
                      padding: '12px 16px', 
                      borderRadius: '12px', 
                      fontSize: '13px', 
                      lineHeight: '1.5', 
                      border: chat.isMe ? 'none' : '1px solid #e2e8f0',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                    }}
                  >
                    {t(chat.text)}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Quick Reply Input */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', backgroundColor: '#ffffff', display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendReply(selectedMsg.sender, selectedMsg.channel);
                }}
                placeholder={t(`Reply to ${selectedMsg.sender} on ${selectedMsg.channel}...`)}
                style={{
                  flex: 1,
                  height: '42px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  padding: '0 14px',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
              <button
                onClick={() => handleSendReply(selectedMsg.sender, selectedMsg.channel)}
                disabled={!replyText.trim()}
                style={{
                  padding: '0 20px',
                  height: '42px',
                  borderRadius: '8px',
                  backgroundColor: replyText.trim() ? (selectedMsg.channel === 'WhatsApp' ? '#25D366' : '#2563eb') : '#cbd5e1',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '13px',
                  border: 'none',
                  cursor: replyText.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Send size={14} />
                {t("Send")}</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
