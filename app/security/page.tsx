"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  ShieldCheck, 
  Lock, 
  Server, 
  FileKey, 
  Key,
  Database,
  CheckCircle2,
} from "lucide-react";

/* ----------------------------- data ----------------------------- */

const securityLayers = [
  {
    id: "infrastructure",
    title: "Infrastructure Security",
    icon: Server,
    description: "Bank-grade cloud infrastructure with multi-zone redundancy and DDoS protection.",
    details: [
      "Hosted on AWS secure cloud",
      "99.99% uptime SLA",
      "Automated failover systems",
      "Continuous vulnerability scanning"
    ]
  },
  {
    id: "data",
    title: "Data Encryption",
    icon: Lock,
    description: "Military-grade encryption for all data, both in transit and at rest.",
    details: [
      "AES-256 encryption at rest",
      "TLS 1.3 encryption in transit",
      "Key management via KMS",
      "Zero-knowledge architecture"
    ]
  },
  {
    id: "access",
    title: "Access Control",
    icon: Key,
    description: "Strict role-based access controls and multi-factor authentication protocols.",
    details: [
      "Role-Based Access Control (RBAC)",
      "Mandatory 2FA for admin access",
      "Biometric user authentication",
      "Session timeout policies"
    ]
  },
  {
    id: "compliance",
    title: "Regulatory Compliance",
    icon: FileKey,
    description: "Fully compliant with data protection laws across all operating jurisdictions.",
    details: [
      "ODPC (Kenya) Compliant",
      "GDPR aligned framework",
      "Regular external audits",
      "Transparent data processing agreements"
    ]
  },
];

const certifications = [
  { label: "ODPC Compliant", icon: ShieldCheck },
  { label: "ISO 27001 Aligned", icon: CheckCircle2 },
  { label: "PCI-DSS Ready", icon: CreditCard },
  { label: "256-bit SSL", icon: Lock },
];

/* ----------------------------- components ----------------------------- */

import { CreditCard } from "lucide-react"; // Import missing icon

const FloatingOrb = ({ color, delay, className }: { color: string; delay: number; className?: string }) => (
  <motion.div
    animate={{
      y: [0, -40, 0],
      x: [0, 20, 0],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 10 + Math.random() * 5,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
    className={`absolute h-125 w-125 rounded-full blur-[120px] opacity-20 ${color} ${className}`}
  />
);

const VaultDoor = ({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) => {
  return (
    <motion.div
      onClick={onClick}
      className="relative z-20 cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative h-80 w-80 md:h-96 md:w-96">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-20 border-slate-200 bg-slate-100 shadow-[inset_0_10px_20px_rgba(0,0,0,0.1),0_20px_40px_rgba(0,0,0,0.2)]" />
        
        {/* Inner Mechanism */}
        <motion.div
          className="absolute inset-4 rounded-full border-4 border-slate-300 bg-linear-to-br from-slate-100 to-slate-300 flex items-center justify-center shadow-inner"
          animate={{ rotate: isOpen ? 120 : 0 }}
          transition={{ duration: 1.5, type: "spring", stiffness: 50 }}
        >
          {/* Bolts */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <motion.div
              key={deg}
              className="absolute h-6 w-12 bg-slate-400 rounded-sm"
              style={{ rotate: deg, x: 140 }}
              animate={{ x: isOpen ? 120 : 140 }} // Retract bolts
              transition={{ duration: 0.5, delay: isOpen ? 0 : 1 }}
            />
          ))}

          {/* Center Wheel */}
          <motion.div 
            className="h-32 w-32 rounded-full bg-slate-800 border-8 border-slate-600 flex items-center justify-center shadow-xl"
            animate={{ rotate: isOpen ? -360 : 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            <ShieldCheck size={48} className={`text-green-500 transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-50"}`} />
          </motion.div>
        </motion.div>

        {/* Status Light */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <motion.div 
            className={`h-3 w-3 rounded-full ${isOpen ? "bg-green-500 shadow-[0_0_10px_#22c55e]" : "bg-red-500 shadow-[0_0_10px_#ef4444]"}`} 
          />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {isOpen ? "SECURE" : "LOCKED"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

/* ------------------------------ page ----------------------------- */

export default function SecurityPage() {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const yHero = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <main ref={containerRef} className="relative min-h-screen overflow-hidden bg-white text-slate-900">
      {/* Immersive Background */}
      <div className="fixed inset-0 pointer-events-none">
        <FloatingOrb color="bg-green-100" delay={0} className="top-[-10%] right-[10%]" />
        <FloatingOrb color="bg-slate-200" delay={2} className="bottom-[10%] left-[10%]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
      </div>

      {/* Hero Section */}
      <motion.section 
        style={{ y: yHero, opacity: opacityHero }}
        className="relative pt-40 pb-20 lg:pt-56 lg:pb-32 px-6"
      >
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-green-600"
          >
            <ShieldCheck size={14} className="animate-pulse" />
            <span>Trust Center</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-5xl font-bold tracking-tight text-slate-900 sm:text-7xl lg:text-8xl"
          >
            Uncompromising <br/>
            <span className="text-green-600">Security</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="mt-8 max-w-3xl mx-auto text-xl leading-relaxed text-slate-500"
          >
            Your trust is our currency. We employ bank-grade security protocols 
            and rigorous compliance standards to protect your financial data.
          </motion.p>
        </div>
      </motion.section>

      {/* Interactive Vault Section */}
      <section className="relative z-10 py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: The Vault */}
            <div className="flex justify-center lg:justify-end">
              <VaultDoor isOpen={isVaultOpen} onClick={() => setIsVaultOpen(!isVaultOpen)} />
            </div>

            {/* Right: Security Layers */}
            <div>
              <div className="mb-12">
                <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">
                  Defense in Depth
                </h2>
                <p className="text-slate-500 text-lg">
                  Click on a security layer to inspect our protocols. Our multi-layered 
                  architecture ensures zero single points of failure.
                </p>
              </div>

              <div className="space-y-4">
                {securityLayers.map((layer) => (
                  <motion.div
                    key={layer.id}
                    layout
                    onClick={() => {
                      setActiveLayer(activeLayer === layer.id ? null : layer.id);
                      setIsVaultOpen(true);
                    }}
                    className={`cursor-pointer overflow-hidden rounded-2xl border transition-all duration-500 ${
                      activeLayer === layer.id 
                        ? "bg-slate-900 border-slate-900 shadow-2xl scale-105" 
                        : "bg-white/60 border-slate-200 hover:border-green-500/50 hover:bg-white"
                    }`}
                  >
                    <div className="p-6 flex items-center gap-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${
                        activeLayer === layer.id ? "bg-green-600 text-white" : "bg-slate-100 text-slate-500"
                      }`}>
                        <layer.icon size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-lg font-bold ${activeLayer === layer.id ? "text-white" : "text-slate-900"}`}>
                          {layer.title}
                        </h3>
                        <p className={`text-sm ${activeLayer === layer.id ? "text-slate-400" : "text-slate-500"}`}>
                          {layer.description}
                        </p>
                      </div>
                    </div>

                    <AnimatePresence>
                      {activeLayer === layer.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-6 pb-6"
                        >
                          <div className="h-px w-full bg-slate-800 mb-6" />
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {layer.details.map((detail, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                                <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Strip */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {certifications.map((cert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center gap-4"
              >
                <div className="h-16 w-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                  <cert.icon size={32} className="text-green-600" strokeWidth={1.5} />
                </div>
                <span className="font-bold text-slate-900 uppercase tracking-widest text-sm">
                  {cert.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Privacy Promise */}
      <section className="py-32 px-6">
        <div className="mx-auto max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[3rem] bg-slate-900 p-12 text-center shadow-2xl"
          >
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.1]" />
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-green-500/20 blur-[80px]" />
            
            <div className="relative z-10">
              <Database size={48} className="mx-auto text-green-500 mb-8" />
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
                Your Data Stays <span className="text-green-500">Yours</span>
              </h2>
              <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10">
                We believe in absolute data sovereignty. We do not sell, rent, or 
                monetize your personal financial data. It is used solely to facilitate 
                your transactions and improve your experience.
              </p>
              <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-6 py-2 text-sm font-bold text-green-400">
                <Lock size={16} />
                <span>End-to-End Encrypted</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
