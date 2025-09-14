'use client';

import { ChevronRight, Code, Lock, Zap, Server } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ApiDocumentationPage() {
    return(
        <div className="min-h-screen bg-gradient-to-b from-green-50 to to-white">
            <section
            className="relative py-20 px-6 text-center">
                <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl text-black font-bold md:text-6xl">
                    Seamless API Integration
                </motion.h1>
                <motion.p
                initial={{ opacity:0 ,y:20 }}
                animate={{ opacity:1 , y:0 }}
                className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto"
                >
                    Connect KaziAdvance directly into your systems with just a few lines of code. Secure, fast, and scalable for your business.
                </motion.p>
                <div className="mt-8 flex justify-center gap-4">
                    <Link
                    href="/api-documentation/usage"
                    className="px-6 py-3 bg-green-600 text-white rounded-xl items-center gap-2 hover:bg-green-700 transition shadow-lg">
                        View Docs <ChevronRight className="w-4 h-4 inline-block"/>
                    </Link>
                    <Link
                    href="/api-documentation/get-started"
                    className="px-6 py-3 border border-green-600 text-green-600 rounded-xl hover:bg-green-50 transition">
                        Get API Key
                    </Link>
                </div>
            </section>
            <section className="py-20 px-6 bg-white">
                    <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 text-center">
                    {[
                        { icon: Code, title: 'Simple Integration', text: 'Embed in minutes with our SDKs & REST API.' },
                        { icon: Lock, title: 'Bank-level Security', text: 'All requests are encrypted and fully compliant.' },
                        { icon: Zap, title: 'Real-Time Payouts', text: 'Trigger instant wage access for employees.' },
                        { icon: Server, title: 'Scalable Infra', text: 'Built to handle millions of API calls reliably.' }
                    ].map((item, i) => (
                        <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2, duration: 0.6 }}
                        className="p-6 rounded-2xl shadow-md border hover:shadow-xl transition"
                        >
                        <item.icon className="w-10 h-10 mx-auto text-green-600 mb-4" />
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <p className="text-gray-600 mt-2 text-sm">{item.text}</p>
                        </motion.div>
                    ))}
                    </div>
                </section>
                {/* Partner Logos */}
                <section className="py-16 px-6 bg-gray-50">
                    <div className="max-w-6xl mx-auto text-center">
                        <h2 className="text-xl font-semibold text-gray-800">
                        Trusted by leading employers & financial institutions
                        </h2>
                        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
                        {/* Replace with actual logos */}
                        <div className="text-gray-500 text-lg font-bold">Safaricom</div>
                        <div className="text-gray-500 text-lg font-bold">Equity Bank</div>
                        <div className="text-gray-500 text-lg font-bold">KCB</div>
                        <div className="text-gray-500 text-lg font-bold">Co-op Bank</div>
                        </div>
                    </div>
                </section>

                <section className="py-20 px-6 bg-gray-50">
                    <div className="max-w-4xl mx-auto text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl font-bold text-gray-900"
                    >
                        Example API Call
                    </motion.h2>
                    <pre className="mt-6 bg-gray-900 text-green-400 text-left p-6 rounded-xl overflow-x-auto text-sm">
                        {`fetch("https://api.kaziadvance.com/v1/payouts", {
                        method: "POST",
                        headers: {
                            "Authorization": "Bearer YOUR_API_KEY",
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            employee_id: "emp_12345",
                            amount: 2000
                        })
                        })
                        .then(res => res.json())
                        .then(data => console.log(data));`}
                    </pre>
                    </div>
                </section>
                {/* Security Section */}
                <section className="py-20 px-6 bg-white">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Enterprise-Grade Security</h2>
                    <p className="text-gray-600 mt-4">
                    Every API request is secured with bank-level encryption. KaziAdvance is fully compliant with
                    <span className="font-semibold"> GDPR, PCI-DSS, and ISO standards</span>.
                    </p>
                    <div className="mt-10 grid md:grid-cols-3 gap-8">
                    <div className="p-6 border rounded-xl shadow-sm">
                        <h3 className="font-semibold">API Keys</h3>
                        <p className="text-sm text-gray-600 mt-2">Authenticate every request with unique keys.</p>
                    </div>
                    <div className="p-6 border rounded-xl shadow-sm">
                        <h3 className="font-semibold">OAuth 2.0</h3>
                        <p className="text-sm text-gray-600 mt-2">Support for secure delegated access.</p>
                    </div>
                    <div className="p-6 border rounded-xl shadow-sm">
                        <h3 className="font-semibold">Webhook Signing</h3>
                        <p className="text-sm text-gray-600 mt-2">Verify event payloads with signed secrets.</p>
                    </div>
                    </div>
                </div>
                </section>
                
                {/* Developer Experience */}
                <section className="py-20 px-6 bg-gray-50">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Built for Developers</h2>
                    <p className="text-gray-600 mt-4">
                    With clean docs, SDKs, and a sandbox environment, integrating takes hours—not weeks.
                    </p>
                    <div className="mt-10 grid md:grid-cols-3 gap-8">
                    <div className="p-6 border rounded-xl shadow-md hover:shadow-xl transition">
                        <h3 className="font-semibold">SDKs</h3>
                        <p className="text-sm text-gray-600 mt-2">Available in Node.js, Python, and PHP.</p>
                    </div>
                    <div className="p-6 border rounded-xl shadow-md hover:shadow-xl transition">
                        <h3 className="font-semibold">Sandbox</h3>
                        <p className="text-sm text-gray-600 mt-2">Test API calls safely in a staging environment.</p>
                    </div>
                    <div className="p-6 border rounded-xl shadow-md hover:shadow-xl transition">
                        <h3 className="font-semibold">Postman / OpenAPI</h3>
                        <p className="text-sm text-gray-600 mt-2">Import collections or explore our Swagger docs.</p>
                    </div>
                    </div>
                </div>
                </section>

                <section className="py-20 px-6 bg-white">
                    <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-900">API Pricing</h2>
                    <p className="text-gray-600 mt-2">Choose a plan that fits your scale.</p>

                    <div className="mt-12 grid md:grid-cols-4 gap-8">
                        {[
                        { name: 'Free', price: '$0', limit: '100 calls / month' },
                        { name: 'Starter', price: '$49/mo', limit: '10k calls / month' },
                        { name: 'Growth', price: '$199/mo', limit: '100k calls / month' },
                        { name: 'Enterprise', price: 'Custom', limit: 'Unlimited calls' }
                        ].map((plan, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2, duration: 0.6 }}
                            className="p-6 border rounded-2xl shadow-sm hover:shadow-xl hover:border-green-500 transition"
                        >
                            <h3 className="font-semibold text-xl">{plan.name}</h3>
                            <p className="text-2xl font-bold text-green-600 mt-2">{plan.price}</p>
                            <p className="text-gray-600 mt-2">{plan.limit}</p>
                            <button className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                            Select
                            </button>
                        </motion.div>
                        ))}
                    </div>
                    </div>
                </section>
        </div>
    )
}