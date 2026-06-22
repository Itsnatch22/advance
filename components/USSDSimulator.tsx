"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Signal, Battery, Wifi, ChevronLeft } from "lucide-react";

type MenuNode = {
  id: string;
  text: string;
  options?: { key: string; label: string; next: string }[];
  action?: "input" | "end";
  inputPlaceholder?: string;
  nextDelay?: number;
};

const ussdFlow: Record<string, MenuNode> = {
  home: {
    id: "home",
    text: "Welcome to EaziWage\n1. Request Advance\n2. Check Balance\n3. Repayment Info\n4. My Account",
    options: [
      { key: "1", label: "Request Advance", next: "advance_amount" },
      { key: "2", label: "Check Balance", next: "balance" },
      { key: "3", label: "Repayment Info", next: "repayment" },
      { key: "4", label: "My Account", next: "account" },
    ],
  },
  advance_amount: {
    id: "advance_amount",
    text: "Available limit: KES 12,500\nEnter amount to request:",
    action: "input",
    nextDelay: 800,
  },
  confirm_advance: {
    id: "confirm_advance",
    text: "Request KES {amount}?\nFee: KES 150\nTotal: KES {total}\n\n1. Confirm\n2. Cancel",
    options: [
      { key: "1", label: "Confirm", next: "success" },
      { key: "2", label: "Cancel", next: "home" },
    ],
  },
  success: {
    id: "success",
    text: "Success! KES {amount} has been sent to your M-PESA account.\nThank you for using EaziWage.",
    action: "end",
  },
  balance: {
    id: "balance",
    text: "Your current available limit is KES 12,500.\n0. Back",
    options: [{ key: "0", label: "Back", next: "home" }],
  },
  repayment: {
    id: "repayment",
    text: "Next auto-deduction: KES 0.00 on 30th Nov.\n0. Back",
    options: [{ key: "0", label: "Back", next: "home" }],
  },
  account: {
    id: "account",
    text: "Name: John Doe\nEmployer: TechSpace Corp\nStatus: Active\n0. Back",
    options: [{ key: "0", label: "Back", next: "home" }],
  },
  invalid: {
    id: "invalid",
    text: "Invalid choice. Please try again.\n0. Back to Menu",
    options: [{ key: "0", label: "Back", next: "home" }],
  },
};

export default function USSDSimulator() {
  const [isActive, setIsActive] = useState(false);
  const [dialedNumber, setDialedNumber] = useState("");
  const [currentNode, setCurrentNode] = useState<MenuNode | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [requestedAmount, setRequestedAmount] = useState("0");

  const displayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.scrollTop = displayRef.current.scrollHeight;
    }
  }, [currentNode, inputValue]);

  const handleDial = (num: string) => {
    if (!isActive) {
      if (dialedNumber.length < 15) {
        setDialedNumber((prev) => prev + num);
      }
    } else if (currentNode?.action === "input" || currentNode?.options) {
      setInputValue((prev) => prev + num);
    }
  };

  const handleDelete = () => {
    if (!isActive) {
      setDialedNumber((prev) => prev.slice(0, -1));
    } else {
      setInputValue((prev) => prev.slice(0, -1));
    }
  };

  const handleCall = () => {
    if (!isActive) {
      if (dialedNumber === "*345#") {
        startUSSDSession();
      } else if (dialedNumber.length > 0) {
        setIsLoading(true);
        setIsActive(true);
        setTimeout(() => {
          setIsLoading(false);
          setCurrentNode({
            id: "error",
            text: "Connection problem or invalid MMI code.",
            action: "end",
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
    setInputValue("");
    setDialedNumber("");
  };

  const startUSSDSession = () => {
    setIsActive(true);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentNode(ussdFlow["home"]);
    }, 1200);
  };

  const processInput = () => {
    if (!currentNode || isLoading) return;

    const input = inputValue.trim();
    setInputValue("");

    if (currentNode.action === "input") {
      if (currentNode.id === "advance_amount") {
        const amount = parseInt(input);
        if (isNaN(amount) || amount < 500 || amount > 12500) {
          showTempMessage(
            "Amount must be between 500 and 12,500",
            ussdFlow["advance_amount"]
          );
          return;
        }
        setRequestedAmount(amount.toString());
        transitionTo("confirm_advance");
      }
    } else if (currentNode.options) {
      const option = currentNode.options.find((opt) => opt.key === input);
      if (option) {
        transitionTo(option.next);
      } else {
        transitionTo("invalid");
      }
    }
  };

  const transitionTo = (nodeId: string) => {
    setIsLoading(true);
    const nextNode = ussdFlow[nodeId];

    setTimeout(() => {
      setIsLoading(false);
      setCurrentNode(nextNode || ussdFlow["home"]);
    }, nextNode?.nextDelay || 600);
  };

  const showTempMessage = (msg: string, nextNode: MenuNode) => {
    setIsLoading(true);
    setCurrentNode({ id: "temp", text: msg, action: "end" });
    setTimeout(() => {
      setIsLoading(false);
      setCurrentNode(nextNode);
    }, 2000);
  };

  const formatText = (text: string) => {
    const amount = parseInt(requestedAmount) || 0;
    const fee = 150;
    const total = amount + fee;

    return text
      .replace("{amount}", amount.toLocaleString())
      .replace("{total}", total.toLocaleString());
  };

  return (
    <section className="line-pattern relative overflow-hidden bg-slate-900 py-24">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-900/50 to-emerald-900/20" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Content Left */}
          <div className="order-2 text-white lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-emerald-400 uppercase"
            >
              <Signal className="h-4 w-4" />
              <span>Offline First</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mb-6 font-serif text-4xl font-extrabold tracking-tight md:text-5xl"
            >
              No Data? <br />
              <span className="text-emerald-400">No Problem.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mb-8 max-w-lg text-lg leading-relaxed text-slate-400"
            >
              We built EaziWage for everyone. Employees don't need a smartphone
              or an internet connection to access their earned wages. Our
              dedicated USSD gateway works on any feature phone, instantly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="group relative max-w-lg overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm"
            >
              <div className="absolute top-0 right-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-2xl transition-colors group-hover:bg-emerald-500/20" />
              <h3 className="mb-2 flex items-center gap-2 text-xl font-bold">
                Try it yourself <span className="animate-pulse">👉</span>
              </h3>
              <p className="mb-4 text-sm text-slate-400">
                Dial our demo shortcode{" "}
                <strong className="text-emerald-400">*345#</strong> on the
                simulator to see how fast an employee can request a standard
                advance offline.
              </p>
            </motion.div>
          </div>

          {/* Interactive Phone Simulator Right */}
          <div className="perspective-1000 order-1 flex justify-center lg:order-2 lg:justify-end">
            <motion.div
              initial={{ opacity: 0, rotateY: 20, x: 50 }}
              whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, type: "spring" }}
              className="relative flex h-150 w-75 flex-col overflow-hidden rounded-[40px] border-8 border-slate-800 bg-slate-950 shadow-[20px_20px_60px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(0,0,0,0.5)]"
            >
              {/* Phone Speaker Notch */}
              <div className="absolute inset-x-0 top-0 z-20 flex h-6 justify-center">
                <div className="mt-2 h-1 w-16 rounded-b-xl bg-slate-800" />
              </div>

              {/* Screen Area */}
              <div className="relative flex h-70 w-full flex-col border-b-2 border-slate-800/50 bg-slate-900 p-4">
                {/* Status Bar */}
                <div className="mb-2 flex items-center justify-between font-mono text-[10px] text-slate-500">
                  <span>SAFARICOM</span>
                  <div className="flex items-center gap-1.5">
                    <Signal className="h-3 w-3" />
                    <Wifi className="h-3 w-3 opacity-30" />
                    <Battery className="h-4 w-4" />
                    <span>12:45</span>
                  </div>
                </div>

                {/* Display Center */}
                <div
                  ref={displayRef}
                  className="relative flex-1 overflow-x-hidden overflow-y-auto rounded-sm border-[3px] border-slate-800/80 bg-[#87A96B] p-3 font-mono text-sm leading-snug text-slate-900 shadow-inner"
                  style={{ textShadow: "0px 0px 1px rgba(0,0,0,0.3)" }}
                >
                  {/* Screen Glare Layer */}
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-white/10" />

                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex h-full flex-col items-center justify-center gap-2"
                      >
                        <div className="h-4 w-4 animate-spin text-slate-900">
                          ⧗
                        </div>
                        <span className="text-xs font-bold tracking-widest text-slate-800 uppercase">
                          USSD Code Running...
                        </span>
                      </motion.div>
                    ) : isActive && currentNode ? (
                      <motion.div
                        key="content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="wrap-break-word whitespace-pre-wrap"
                      >
                        {formatText(currentNode.text)}
                        <br />
                        <br />
                        {currentNode.action !== "end" && (
                          <div className="mt-2 flex items-center border-b border-slate-800/30 pb-0.5">
                            <span className="mr-1 animate-pulse">_</span>
                            {inputValue}
                          </div>
                        )}
                        {currentNode.action === "end" && (
                          <div className="mt-4 text-center text-xs font-bold opacity-70">
                            Press Cancel to exit
                          </div>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="dialer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex h-full items-center justify-center text-2xl font-bold tracking-widest"
                      >
                        {dialedNumber || (
                          <span className="opacity-30">Enter code</span>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Functional Keys */}
              <div className="flex justify-between px-6 py-4">
                <button
                  onClick={handleCall}
                  className="flex h-8 w-14 items-center justify-center rounded-full border-b-2 border-slate-700 bg-slate-800 text-xs font-bold text-slate-300 transition-all active:translate-y-0.5 active:border-b-0"
                >
                  {isActive && currentNode?.action !== "end" ? (
                    "SEND"
                  ) : (
                    <Phone className="h-4 w-4 text-emerald-400" />
                  )}
                </button>
                <button
                  onClick={handleDelete}
                  className="flex h-8 w-14 items-center justify-center rounded-full border-b-2 border-slate-700 bg-slate-800 transition-all active:translate-y-0.5 active:border-b-0"
                >
                  <ChevronLeft className="h-4 w-4 text-slate-400" />
                </button>
                <button
                  onClick={handleCancel}
                  className="flex h-8 w-14 items-center justify-center rounded-full border-b-2 border-slate-700 bg-slate-800 transition-all active:translate-y-0.5 active:border-b-0"
                >
                  <Phone className="h-4 w-4 rotate-135 text-red-400" />
                </button>
              </div>

              {/* T9 Keypad */}
              <div className="mt-2 grid flex-1 grid-cols-3 gap-x-4 gap-y-3 px-8 pb-8">
                {[
                  { num: "1", sub: "" },
                  { num: "2", sub: "ABC" },
                  { num: "3", sub: "DEF" },
                  { num: "4", sub: "GHI" },
                  { num: "5", sub: "JKL" },
                  { num: "6", sub: "MNO" },
                  { num: "7", sub: "PQRS" },
                  { num: "8", sub: "TUV" },
                  { num: "9", sub: "WXYZ" },
                  { num: "*", sub: "" },
                  { num: "0", sub: "+" },
                  { num: "#", sub: "" },
                ].map((btn) => (
                  <button
                    key={btn.num}
                    onClick={() => handleDial(btn.num)}
                    className="group flex h-10 flex-col items-center justify-center rounded-full border-b-[3px] border-slate-900 bg-slate-800/80 transition-all active:translate-y-0.75 active:border-b-0"
                  >
                    <span className="text-lg leading-none font-bold text-white group-active:text-emerald-400">
                      {btn.num}
                    </span>
                    {btn.sub && (
                      <span className="-mt-0.5 text-[8px] font-bold text-slate-500">
                        {btn.sub}
                      </span>
                    )}
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
