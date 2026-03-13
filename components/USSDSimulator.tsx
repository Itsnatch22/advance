'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Signal, Battery, Wifi, ChevronLeft } from 'lucide-react';

// Define the USSD Menu structure
type MenuNode = {
  id: string;
  text: string;
  options?: { key: string; label: string; next: string }[];
  action?: 'input' | 'end';
  inputPlaceholder?: string;
  nextDelay?: number; // Simulate network lag
};

const ussdFlow: Record<string, MenuNode> = {
  'home': {
    id: 'home',
    text: 'Welcome to EaziWage\n1. Request Advance\n2. Check Balance\n3. Repayment Info\n4. My Account',
    options: [
      { key: '1', label: 'Request Advance', next: 'advance_amount' },
      { key: '2', label: 'Check Balance', next: 'balance' },
      { key: '3', label: 'Repayment Info', next: 'repayment' },
      { key: '4', label: 'My Account', next: 'account' },
    ]
  },
  'advance_amount': {
    id: 'advance_amount',
    text: 'Available limit: KES 12,500\nEnter amount to request:',
    action: 'input',
    nextDelay: 800,
  },
  'confirm_advance': {
    id: 'confirm_advance',
    text: 'Request KES {amount}?\nFee: KES 150\nTotal: KES {total}\n\n1. Confirm\n2. Cancel',
    options: [
      { key: '1', label: 'Confirm', next: 'success' },
      { key: '2', label: 'Cancel', next: 'home' },
    ]
  },
  'success': {
    id: 'success',
    text: 'Success! KES {amount} has been sent to your M-PESA account.\nThank you for using EaziWage.',
    action: 'end'
  },
  'balance': {
    id: 'balance',
    text: 'Your current available limit is KES 12,500.\n0. Back',
    options: [
      { key: '0', label: 'Back', next: 'home' }
    ]
  },
  'repayment': {
    id: 'repayment',
    text: 'Next auto-deduction: KES 0.00 on 30th Nov.\n0. Back',
    options: [
      { key: '0', label: 'Back', next: 'home' }
    ]
  },
  'account': {
    id: 'account',
    text: 'Name: John Doe\nEmployer: TechSpace Corp\nStatus: Active\n0. Back',
    options: [
      { key: '0', label: 'Back', next: 'home' }
    ]
  },
  'invalid': {
    id: 'invalid',
    text: 'Invalid choice. Please try again.\n0. Back to Menu',
    options: [
      { key: '0', label: 'Back', next: 'home' }
    ]
  }
};

export default function USSDSimulator() {
  const [isActive, setIsActive] = useState(false);
  const [dialedNumber, setDialedNumber] = useState('');
  const [currentNode, setCurrentNode] = useState<MenuNode | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // State for dynamic values
  const [requestedAmount, setRequestedAmount] = useState('0');
  
  const displayRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of "screen"
  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.scrollTop = displayRef.current.scrollHeight;
    }
  }, [currentNode, inputValue]);

  const handleDial = (num: string) => {
    if (!isActive) {
      if (dialedNumber.length < 15) {
        setDialedNumber(prev => prev + num);
      }
    } else if (currentNode?.action === 'input' || currentNode?.options) {
      setInputValue(prev => prev + num);
    }
  };

  const handleDelete = () => {
    if (!isActive) {
      setDialedNumber(prev => prev.slice(0, -1));
    } else {
      setInputValue(prev => prev.slice(0, -1));
    }
  };

  const handleCall = () => {
    if (!isActive) {
      if (dialedNumber === '*345#') {
        startUSSDSession();
      } else if (dialedNumber.length > 0) {
        // Show USSD running then invalid network
        setIsLoading(true);
        setIsActive(true);
        setTimeout(() => {
          setIsLoading(false);
          setCurrentNode({
            id: 'error',
            text: 'Connection problem or invalid MMI code.',
            action: 'end'
          });
        }, 1500);
      }
    } else {
        processInput();
    }
  };
  
  const handleCancel = () => {
      setIsActive(false);
      setCurrentNode(null);
      setInputValue('');
      setDialedNumber('');
  };

  const startUSSDSession = () => {
    setIsActive(true);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentNode(ussdFlow['home']);
    }, 1200);
  };

  const processInput = () => {
    if (!currentNode || isLoading) return;

    const input = inputValue.trim();
    setInputValue('');

    if (currentNode.action === 'input') {
        if (currentNode.id === 'advance_amount') {
            const amount = parseInt(input);
            if (isNaN(amount) || amount < 500 || amount > 12500) {
               showTempMessage('Amount must be between 500 and 12,500', ussdFlow['advance_amount']);
               return;
            }
            setRequestedAmount(amount.toString());
            transitionTo('confirm_advance');
        }
    } else if (currentNode.options) {
      const option = currentNode.options.find(opt => opt.key === input);
      if (option) {
        transitionTo(option.next);
      } else {
        transitionTo('invalid');
      }
    }
  };

  const transitionTo = (nodeId: string) => {
    setIsLoading(true);
    const nextNode = ussdFlow[nodeId];
    
    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      setCurrentNode(nextNode || ussdFlow['home']);
    }, nextNode?.nextDelay || 600);
  };

  const showTempMessage = (msg: string, nextNode: MenuNode) => {
      setIsLoading(true);
      setCurrentNode({ id: 'temp', text: msg, action: 'end' });
      setTimeout(() => {
          setIsLoading(false);
          setCurrentNode(nextNode);
      }, 2000);
  }

  // Helper to format text with dynamic variables
  const formatText = (text: string) => {
      const amount = parseInt(requestedAmount) || 0;
      const fee = 150;
      const total = amount + fee;
      
      return text
        .replace('{amount}', amount.toLocaleString())
        .replace('{total}', total.toLocaleString());
  };

  return (
    <section className="py-24 relative overflow-hidden bg-slate-900 line-pattern">
      <div className="absolute inset-0 bg-linear-to-b from-slate-900/50 to-emerald-900/20 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Content Left */}
          <div className="text-white order-2 lg:order-1">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-emerald-400 mb-6"
            >
                <Signal className="w-4 h-4" />
                <span>Offline First</span>
            </motion.div>
            
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 font-serif"
            >
                No Data? <br/>
                <span className="text-emerald-400">No Problem.</span>
            </motion.h2>
            
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-lg text-slate-400 mb-8 max-w-lg leading-relaxed"
            >
                We built EaziWage for everyone. Employees don't need a smartphone or an internet connection to access their earned wages. Our dedicated USSD gateway works on any feature phone, instantly.
            </motion.p>
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm max-w-lg relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/20 transition-colors" />
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    Try it yourself <span className="animate-pulse">👉</span>
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                    Dial our demo shortcode <strong className="text-emerald-400">*345#</strong> on the simulator to see how fast an employee can request a standard advance offline.
                </p>
            </motion.div>
          </div>

          {/* Interactive Phone Simulator Right */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end perspective-1000">
            <motion.div 
                initial={{ opacity: 0, rotateY: 20, x: 50 }}
                whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, type: "spring" }}
                className="relative w-[300px] h-[600px] bg-slate-950 rounded-[40px] border-[8px] border-slate-800 shadow-[20px_20px_60px_rgba(0,0,0,0.5),_inset_0_0_20px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
            >
              {/* Phone Speaker Notch */}
              <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20">
                  <div className="w-16 h-1 bg-slate-800 rounded-b-xl mt-2" />
              </div>

              {/* Screen Area */}
              <div className="h-[280px] bg-slate-900 w-full relative p-4 flex flex-col border-b-2 border-slate-800/50">
                  
                  {/* Status Bar */}
                  <div className="flex justify-between items-center text-[10px] text-slate-500 mb-2 font-mono">
                      <span>SAFARICOM</span>
                      <div className="flex items-center gap-1.5">
                          <Signal className="w-3 h-3" />
                          <Wifi className="w-3 h-3 opacity-30" />
                          <Battery className="w-4 h-4" />
                          <span>12:45</span>
                      </div>
                  </div>

                  {/* Display Center */}
                  <div 
                    ref={displayRef}
                    className="flex-1 bg-[#87A96B] rounded-sm p-3 font-mono text-sm text-slate-900 border-[3px] border-slate-800/80 shadow-inner relative overflow-y-auto overflow-x-hidden leading-snug"
                    style={{ textShadow: "0px 0px 1px rgba(0,0,0,0.3)" }}
                  >
                        {/* Screen Glare Layer */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />

                        <AnimatePresence mode="wait">
                            {isLoading ? (
                                <motion.div 
                                    key="loading"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="h-full flex items-center justify-center flex-col gap-2"
                                >
                                    <div className="w-4 h-4 text-slate-900 animate-spin">⧗</div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-slate-800">USSD Code Running...</span>
                                </motion.div>
                            ) : isActive && currentNode ? (
                                <motion.div 
                                    key="content"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="whitespace-pre-wrap break-words"
                                >
                                    {formatText(currentNode.text)}
                                    <br/><br/>
                                    {currentNode.action !== 'end' && (
                                        <div className="mt-2 flex items-center border-b border-slate-800/30 pb-0.5">
                                            <span className="mr-1 animate-pulse">_</span>
                                            {inputValue}
                                        </div>
                                    )}
                                    {currentNode.action === 'end' && (
                                        <div className="mt-4 text-xs font-bold opacity-70 text-center">
                                            Press Cancel to exit
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="dialer"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="h-full flex items-center justify-center text-2xl font-bold tracking-widest"
                                >
                                    {dialedNumber || <span className="opacity-30">Enter code</span>}
                                </motion.div>
                            )}
                        </AnimatePresence>
                  </div>
              </div>

              {/* Functional Keys */}
              <div className="px-6 py-4 flex justify-between">
                  <button onClick={handleCall} className="w-14 h-8 rounded-full bg-slate-800 border-b-2 border-slate-700 active:border-b-0 active:translate-y-0.5 transition-all text-xs font-bold text-slate-300 flex items-center justify-center">
                     {isActive && currentNode?.action !== 'end' ? 'SEND' : <Phone className="w-4 h-4 text-emerald-400" />}
                  </button>
                  <button onClick={handleDelete} className="w-14 h-8 rounded-full bg-slate-800 border-b-2 border-slate-700 active:border-b-0 active:translate-y-0.5 transition-all flex items-center justify-center">
                     <ChevronLeft className="w-4 h-4 text-slate-400" />
                  </button>
                  <button onClick={handleCancel} className="w-14 h-8 rounded-full bg-slate-800 border-b-2 border-slate-700 active:border-b-0 active:translate-y-0.5 transition-all flex items-center justify-center">
                     <Phone className="w-4 h-4 text-red-400 rotate-[135deg]" />
                  </button>
              </div>

              {/* T9 Keypad */}
              <div className="flex-1 px-8 pb-8 grid grid-cols-3 gap-x-4 gap-y-3 mt-2">
                  {[
                      { num: "1", sub: "" }, { num: "2", sub: "ABC" }, { num: "3", sub: "DEF" },
                      { num: "4", sub: "GHI" }, { num: "5", sub: "JKL" }, { num: "6", sub: "MNO" },
                      { num: "7", sub: "PQRS" }, { num: "8", sub: "TUV" }, { num: "9", sub: "WXYZ" },
                      { num: "*", sub: "" }, { num: "0", sub: "+" }, { num: "#", sub: "" }
                  ].map((btn) => (
                      <button 
                         key={btn.num}
                         onClick={() => handleDial(btn.num)}
                         className="h-10 rounded-full bg-slate-800/80 border-b-[3px] border-slate-900 active:border-b-0 active:translate-y-[3px] transition-all flex flex-col items-center justify-center group"
                      >
                          <span className="text-white font-bold leading-none text-lg group-active:text-emerald-400">{btn.num}</span>
                          {btn.sub && <span className="text-[8px] text-slate-500 font-bold -mt-0.5">{btn.sub}</span>}
                      </button>
                  ))}
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
