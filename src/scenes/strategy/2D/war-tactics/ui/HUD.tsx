import { Html } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import type React from 'react';
import { useEffect, useState } from 'react';

const Panel = ({
  title,
  children,
  variant = 'default',
  className = '',
}: {
  title: string;
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'warning' | 'success' | 'metal';
  className?: string;
}) => {
  const variants = {
    default:
      'border-weatheredMetal/60 bg-dustHaze backdrop-blur-xl shadow-warm',
    primary: 'border-copperWire/70 bg-metalSheen backdrop-blur-xl shadow-glow',
    warning:
      'border-amberAlert/70 bg-amberAlert/10 backdrop-blur-xl shadow-alert',
    success:
      'border-oxidizedGreen/70 bg-oxidizedGreen/10 backdrop-blur-xl shadow-warm',
    metal: 'border-steelGrey/60 bg-shadowDepth backdrop-blur-xl shadow-metal',
  };

  return (
    <div
      className={`relative font-mono rounded-lg border-2 p-4 mb-4 overflow-hidden ${variants[variant]} ${className}`}
    >
      {/* Weathered corner accents inspired by the metallic SecUnit */}
      <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-copperWire/80 bg-gradient-to-br from-dustyGold/20 to-transparent"></div>
      <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-steelGrey/80 bg-gradient-to-bl from-warmSilver/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-oxidizedGreen/80 bg-gradient-to-tr from-oxidizedGreen/20 to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-weatheredMetal/80 bg-gradient-to-tl from-weatheredMetal/20 to-transparent"></div>

      {/* Subtle weathered pattern overlay */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-3 left-3 w-12 h-0.5 bg-gradient-to-r from-copperWire to-dustyGold"></div>
        <div className="absolute top-3 left-3 w-0.5 h-12 bg-gradient-to-b from-copperWire to-oxidizedGreen"></div>
        <div className="absolute bottom-3 right-3 w-12 h-0.5 bg-gradient-to-l from-steelGrey to-weatheredMetal"></div>
        <div className="absolute bottom-3 right-3 w-0.5 h-12 bg-gradient-to-t from-steelGrey to-warmSilver"></div>
      </div>

      {/* Cinematic title bar */}
      <div className="relative z-10 mb-3 pb-2 border-b border-copperWire/30">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase text-oxidizedGreen tracking-widest font-medium">
            {title}
          </span>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-oxidizedGreen rounded-full animate-pulse shadow-warm"></div>
            <div className="w-2 h-2 bg-copperWire rounded-full animate-pulse delay-75 shadow-glow"></div>
            <div className="w-2 h-2 bg-dustyGold rounded-full animate-pulse delay-150 shadow-warm"></div>
          </div>
        </div>
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
};

// Left Column Components with cinematic colors
const SystemStatus = () => {
  const [time, setTime] = useState(new Date());
  const [systemLoad, setSystemLoad] = useState(67);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      setSystemLoad(Math.floor(Math.random() * 30) + 50);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Panel title="System Status" variant="success">
      <div className="space-y-3">
        <div className="text-parchment">
          <div className="text-sm font-medium">SecUnit Online</div>
          <div className="text-xs text-mutedBronze">
            {time.toLocaleTimeString('en-US', { hour12: false })} UTC
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-mutedBronze">CPU Load</span>
            <span className="text-copperWire font-medium">{systemLoad}%</span>
          </div>
          <div className="w-full bg-charcoal/50 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-copperWire via-dustyGold to-oxidizedGreen rounded-full transition-all duration-1000 shadow-glow"
              style={{ width: `${systemLoad}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-charcoal/40 p-3 rounded border border-oxidizedGreen/30">
            <div className="text-oxidizedGreen font-medium">SHIELDS</div>
            <div className="text-parchment font-bold">100%</div>
          </div>
          <div className="bg-charcoal/40 p-3 rounded border border-copperWire/30">
            <div className="text-copperWire font-medium">POWER</div>
            <div className="text-parchment font-bold">98%</div>
          </div>
        </div>
      </div>
    </Panel>
  );
};

const MissionBrief = () => {
  const [missionPhase, setMissionPhase] = useState('Reconnaissance');

  const phases = [
    'Reconnaissance',
    'Data Collection',
    'Perimeter Sweep',
    'Analysis Complete',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMissionPhase(phases[Math.floor(Math.random() * phases.length)]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Panel title="Mission Brief" variant="primary">
      <div className="space-y-3">
        <div className="text-parchment">
          <div className="text-sm font-medium">Current Phase</div>
          <div className="text-dustyGold font-bold text-lg">{missionPhase}</div>
        </div>

        <div className="text-xs text-mutedBronze space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-oxidizedGreen rounded-full"></div>
            <span>Survey designated area</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-copperWire rounded-full"></div>
            <span>Monitor for hostile activity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-dustyGold rounded-full"></div>
            <span>Protect human clients</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-steelGrey rounded-full"></div>
            <span>Maintain operational security</span>
          </div>
        </div>

        <div className="bg-charcoal/60 p-3 rounded border border-oxidizedGreen/40 text-xs">
          <div className="text-oxidizedGreen mb-1 font-medium">
            PRIORITY DIRECTIVE
          </div>
          <div className="text-parchment">
            Keep humans alive. Try not to kill anyone unless absolutely
            necessary.
          </div>
        </div>
      </div>
    </Panel>
  );
};

const AuthenticationPanel = () => {
  const [unitId, setUnitId] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  const handleAuth = () => {
    if (unitId && accessCode) {
      setIsAuthorized(true);
      setTimeout(() => setIsAuthorized(false), 5000);
    }
  };

  return (
    <Panel title="Authentication" variant="metal">
      {!isAuthorized ? (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Unit ID"
            value={unitId}
            onChange={(e) => setUnitId(e.target.value)}
            className="w-full bg-charcoal/60 border border-copperWire/50 focus:border-copperWire focus:shadow-glow text-parchment p-3 rounded text-sm font-mono focus:outline-none transition-all"
          />
          <input
            type="password"
            placeholder="Access Code"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            className="w-full bg-charcoal/60 border border-copperWire/50 focus:border-copperWire focus:shadow-glow text-parchment p-3 rounded text-sm font-mono focus:outline-none transition-all"
          />
          <button
            onClick={handleAuth}
            className="w-full bg-gradient-to-r from-copperWire to-dustyGold text-charcoal py-3 rounded font-bold hover:from-dustyGold hover:to-amberAlert transition-all text-sm shadow-glow"
          >
            AUTHORIZE ACCESS
          </button>
        </div>
      ) : (
        <div className="text-center space-y-2">
          <div className="text-oxidizedGreen text-xl font-bold animate-warm-glow">
            ✓ ACCESS GRANTED
          </div>
          <div className="text-xs text-mutedBronze">
            Unit {unitId} authenticated
          </div>
          <div className="text-xs text-dustyGold font-medium">
            Security clearance: Level 7
          </div>
        </div>
      )}
    </Panel>
  );
};

// Center Column Components with weathered aesthetic
const ThreatAssessment = () => {
  const [threatLevel, setThreatLevel] = useState<'low' | 'medium' | 'high'>(
    'low',
  );
  const [contacts, setContacts] = useState(3);
  const [scanRadius, setScanRadius] = useState(0);

  const threats = {
    low: {
      text: 'All Clear',
      color: 'text-oxidizedGreen',
      variant: 'success' as const,
    },
    medium: {
      text: 'Potential Threat Detected',
      color: 'text-amberAlert',
      variant: 'warning' as const,
    },
    high: {
      text: 'Multiple Hostiles',
      color: 'text-rustRed',
      variant: 'warning' as const,
    },
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const levels: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
      setThreatLevel(levels[Math.floor(Math.random() * levels.length)]);
      setContacts(Math.floor(Math.random() * 8) + 1);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const scanInterval = setInterval(() => {
      setScanRadius((prev) => (prev >= 360 ? 0 : prev + 5));
    }, 100);
    return () => clearInterval(scanInterval);
  }, []);

  const currentThreat = threats[threatLevel];

  return (
    <Panel
      title="Threat Assessment"
      variant={currentThreat.variant}
      className="h-80"
    >
      <div className="space-y-4">
        <div className="text-center">
          <div className={`text-lg font-bold ${currentThreat.color}`}>
            {currentThreat.text}
          </div>
          <div className="text-xs text-mutedBronze mt-1">
            Contacts: {contacts} | Range: 2.5km
          </div>
        </div>

        {/* Weathered radar display */}
        <div className="relative w-48 h-48 mx-auto bg-charcoal/60 rounded-full border-2 border-copperWire/40 shadow-glow">
          {/* Radar sweep with warm gradient */}
          <div
            className="absolute inset-2 rounded-full border border-oxidizedGreen/60"
            style={{
              background: `conic-gradient(from ${scanRadius}deg, transparent 0deg, rgba(143, 188, 143, 0.2) 30deg, rgba(184, 115, 51, 0.1) 60deg, transparent 90deg)`,
            }}
          ></div>

          {/* Weathered concentric circles */}
          <div className="absolute inset-8 rounded-full border border-dustyGold/30"></div>
          <div className="absolute inset-16 rounded-full border border-steelGrey/30"></div>

          {/* Center dot with warm glow */}
          <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-copperWire rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-glow animate-pulse"></div>

          {/* Contact blips with cinematic colors */}
          {Array.from({ length: contacts }).map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 rounded-full animate-pulse ${
                threatLevel === 'high'
                  ? 'bg-rustRed shadow-alert'
                  : threatLevel === 'medium'
                    ? 'bg-amberAlert shadow-warm'
                    : 'bg-oxidizedGreen shadow-warm'
              }`}
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
              }}
            ></div>
          ))}
        </div>

        <div className="text-xs text-mutedBronze text-center">
          Threat Level:{' '}
          <span className={`${currentThreat.color} font-bold`}>
            {threatLevel.toUpperCase()}
          </span>
        </div>
      </div>
    </Panel>
  );
};

const EnvironmentalData = () => {
  const [temp, setTemp] = useState(22.4);
  const [humidity, setHumidity] = useState(45);
  const [atmosphere, setAtmosphere] = useState('Standard');

  useEffect(() => {
    const interval = setInterval(() => {
      setTemp(20 + Math.random() * 10);
      setHumidity(40 + Math.random() * 20);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Panel title="Environmental" variant="default">
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-charcoal/40 p-3 rounded border border-amberAlert/30">
          <div className="text-amberAlert mb-1 font-medium">TEMPERATURE</div>
          <div className="text-parchment font-bold text-lg">
            {temp.toFixed(1)}°C
          </div>
        </div>
        <div className="bg-charcoal/40 p-3 rounded border border-dustyGold/30">
          <div className="text-dustyGold mb-1 font-medium">HUMIDITY</div>
          <div className="text-parchment font-bold text-lg">
            {humidity.toFixed(0)}%
          </div>
        </div>
        <div className="bg-charcoal/40 p-3 rounded col-span-2 border border-oxidizedGreen/30">
          <div className="text-oxidizedGreen mb-1 font-medium">ATMOSPHERE</div>
          <div className="text-oxidizedGreen font-bold">
            {atmosphere} - Breathable
          </div>
        </div>
      </div>
    </Panel>
  );
};

// Right Column Components with weathered palette
const DiagnosticFeed = () => {
  const [logs, setLogs] = useState([
    '[SYS] Heat signature detected: vector 042.11',
    '[AUTH] PresAux override key accepted',
    '[BIO] Heart rate elevated - stress state likely',
    '[NET] Satellite uplink secured',
  ]);

  const additionalLogs = [
    '[SCAN] Perimeter sweep initiated',
    '[COMM] Incoming transmission from Hub',
    '[SYS] Power levels optimal',
    '[THREAT] Motion detected sector 7',
    '[BIO] Adrenaline spike in human detected',
    '[NET] Data packet encrypted and sent',
    '[SCAN] Thermal: 37.2°C humanoid signature',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const newLog =
        additionalLogs[Math.floor(Math.random() * additionalLogs.length)];
      setLogs((prev) => [...prev.slice(-4), newLog]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Panel title="Diagnostic Feed" variant="default" className="h-64">
      <div className="space-y-1 text-xs font-mono overflow-auto h-48">
        {logs.map((log, index) => (
          <div
            key={index}
            className={`${
              index === logs.length - 1
                ? 'text-copperWire animate-pulse font-medium'
                : 'text-oxidizedGreen/80'
            } transition-all duration-300`}
          >
            {log}
          </div>
        ))}
      </div>
    </Panel>
  );
};

const NetworkStatus = () => {
  const [bandwidth, setBandwidth] = useState(87);
  const [latency, setLatency] = useState(12);

  useEffect(() => {
    const interval = setInterval(() => {
      setBandwidth(Math.floor(Math.random() * 40) + 60);
      setLatency(Math.floor(Math.random() * 20) + 5);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Panel title="Network Status" variant="success">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-mutedBronze">Hub Connection</span>
          <span className="text-oxidizedGreen text-xs font-bold animate-pulse">
            ACTIVE
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-mutedBronze">Bandwidth</span>
            <span className="text-copperWire font-medium">{bandwidth}%</span>
          </div>
          <div className="w-full bg-charcoal/50 rounded-full h-2">
            <div
              className="h-full bg-gradient-to-r from-copperWire to-dustyGold rounded-full transition-all duration-1000 shadow-glow"
              style={{ width: `${bandwidth}%` }}
            ></div>
          </div>
        </div>

        <div className="text-xs">
          <div className="text-mutedBronze">
            Latency:{' '}
            <span className="text-dustyGold font-medium">{latency}ms</span>
          </div>
        </div>
      </div>
    </Panel>
  );
};

const QuickActions = () => {
  const actions = [
    {
      name: 'Emergency Protocol',
      color: 'border-rustRed/50 hover:border-rustRed hover:bg-rustRed/10',
    },
    {
      name: 'Silent Mode',
      color: 'border-steelGrey/50 hover:border-steelGrey hover:bg-steelGrey/10',
    },
    {
      name: 'Data Backup',
      color:
        'border-copperWire/50 hover:border-copperWire hover:bg-copperWire/10',
    },
    {
      name: 'System Restart',
      color:
        'border-amberAlert/50 hover:border-amberAlert hover:bg-amberAlert/10',
    },
  ];

  return (
    <Panel title="Quick Actions" variant="metal">
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <button
            key={action.name}
            className={`bg-charcoal/40 border text-parchment text-xs p-3 rounded transition-all font-medium ${action.color}`}
          >
            {action.name}
          </button>
        ))}
      </div>
    </Panel>
  );
};

// Main HUD Layout
const HUDOverlay = () => (
  <Html fullscreen>
    <div className="w-full h-full p-4 grid grid-cols-3 gap-4 overflow-auto">
      {/* Left Column */}
      <div className="space-y-0">
        <SystemStatus />
        <MissionBrief />
        <AuthenticationPanel />
      </div>

      {/* Center Column */}
      <div className="space-y-0">
        <ThreatAssessment />
        <EnvironmentalData />
      </div>

      {/* Right Column */}
      <div className="space-y-0">
        <DiagnosticFeed />
        <NetworkStatus />
        <QuickActions />
      </div>
    </div>
  </Html>
);

export const HUD = () => (
  <div className="w-full h-screen bg-gradient-to-br from-sandstone via-desertTan to-weatheredMetal relative overflow-hidden">
    {/* Cinematic background patterns inspired by the desert scene */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-copperWire rounded-full animate-pulse shadow-glow"></div>
      <div className="absolute bottom-1/3 right-1/3 w-24 h-24 border-2 border-dustyGold rotate-45 animate-spin-slow shadow-warm"></div>
      <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-oxidizedGreen/20 rounded-full animate-ping shadow-warm"></div>
      <div className="absolute bottom-1/4 left-1/3 w-20 h-20 border-2 border-steelGrey/40 transform rotate-12 shadow-metal"></div>
    </div>

    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} intensity={0.6} color="#CD853F" />
      <pointLight position={[-10, -10, 5]} intensity={0.4} color="#8FBC8F" />
      <pointLight position={[0, 10, -5]} intensity={0.3} color="#B87333" />

      {/* Weathered floating elements */}
      <mesh position={[-4, 3, -4]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1.5]} />
        <meshStandardMaterial color="#B87333" opacity={0.2} transparent />
      </mesh>

      <mesh position={[4, -2, -3]} rotation={[Math.PI / 4, 0, 0]}>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshStandardMaterial color="#8B7D6B" opacity={0.15} transparent />
      </mesh>

      <mesh position={[0, 0, -6]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.3, 0.05, 8, 16]} />
        <meshStandardMaterial color="#8FBC8F" opacity={0.1} transparent />
      </mesh>

      <HUDOverlay />
    </Canvas>
  </div>
);
