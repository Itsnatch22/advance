'use client';

import { motion } from 'framer-motion';
import { FiCopy } from 'react-icons/fi';
import { useState } from 'react';

export default function GetApiPage() {
  const [copied, setCopied] = useState(false);
   const [lang, setLang] = useState<'nextjs' | 'node' | 'python' | 'ruby'>('nextjs');

  const snippets = {
    nextjs: `// Next.js (API route example)
    export default async function handler(req, res) {
    const response = await fetch("https://api.kaziadvance.com/v1/payouts", {
        method: "POST",
        headers: {
        "Authorization": "Bearer sk_live_12345abcdef",
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
        employeeId: "emp_123",
        amount: 5000
        })
    });
    const data = await response.json();
    res.status(200).json(data);
    }`,
        node: `// Node.js (fetch)
    const fetch = require("node-fetch");

    fetch("https://api.kaziadvance.com/v1/payouts", {
    method: "POST",
    headers: {
        "Authorization": "Bearer sk_live_12345abcdef",
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        employeeId: "emp_123",
        amount: 5000
    })
    })
    .then(res => res.json())
    .then(data => console.log(data));`,
        python: `# Python (requests)
    import requests

    url = "https://api.kaziadvance.com/v1/payouts"
    headers = {
    "Authorization": "Bearer sk_live_12345abcdef",
    "Content-Type": "application/json"
    }
    data = {
    "employeeId": "emp_123",
    "amount": 5000
    }

    response = requests.post(url, headers=headers, json=data)
    print(response.json())`,
        ruby: `# Ruby (net/http)
    require "net/http"
    require "json"
    uri = URI("https://api.kaziadvance.com/v1/payouts")

    req = Net::HTTP::Post.new(uri, {
    "Authorization" => "Bearer sk_live_12345abcdef",
    "Content-Type" => "application/json"
    })
    req.body = { employeeId: "emp_123", amount: 5000 }.to_json

    res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
    http.request(req)
    end

    puts res.body`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText('sk_live_12345abcdef');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Get Started With KaziAdvance API
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Integrate earned wage access into your platform with just a few lines of code.
        </p>
      </motion.div>
      <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {[
          { step: '1', title: 'Sign Up', desc: 'Create a free account to access your developer dashboard.' },
          { step: '2', title: 'Get Your Key', desc: 'Grab your unique API key securely from the dashboard.' },
          { step: '3', title: 'Make Requests', desc: 'Start integrating with our REST endpoints instantly.' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
            className="bg-white rounded-2xl shadow p-6 text-center"
          >
            <span className="text-green-600 text-3xl font-bold">{item.step}</span>
            <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
            <p className="text-gray-500 mt-2">{item.desc}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-20 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your API Key</h2>
        <div className="flex items-center justify-between bg-gray-900 text-green-400 px-4 py-3 rounded-lg font-mono">
          <span>sk_live_12345abcdef</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 text-sm text-white hover:text-green-400"
          >
            <FiCopy /> {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="mt-12 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Example</h2>
        <div className="flex gap-4 mb-4">
          {['nextjs', 'node', 'python', 'ruby'].map((l) => (
            <button
              key={l}
              onClick={() => setLang(l as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                lang === l
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <pre className="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto text-sm font-mono">
          {snippets[lang]}
        </pre>
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <a
          href="/apis/pricing"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          View API Pricing
        </a>
      </div>
    </div>
  );
}
