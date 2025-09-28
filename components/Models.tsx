'use client'
import { FiCheck, FiUser } from "react-icons/fi"
import { BiBuilding } from "react-icons/bi";
import { motion } from 'framer-motion'

const models = [
    {
        icon: BiBuilding,
        name: 'Employer-Sponsored',
        price: 'Ksh 150',
        sub: 'per employee / month',
        extra: '+Ksh 50 per transaction',
        description: 'Complete employee benefit at no cost to staff',
        features: [
            'Unlimited access for employees',
            'No cost to employees',
            'Payroll integration',
            'Employee Dashboard',
            'Analytics Dashboard',
            '24/7 support',
        ],
    },
    {
        icon: FiUser,
        name: 'Employer-Pays',
        price: 'Ksh 0',
        sub: 'per month for employees',
        extra: 'Ksh 100 per employee transaction',
        description: 'No cost to employees, small fee per use',
        features: [
            'Zero cost to employers',
            'Flat fee per transaction',
            'Payroll integration',
            'Employee Dashboard',
            'Basic reporting',
            'Standard support',
        ],
    },
];

export default function Models() {
    return(
        <section className="py-16 bg-gray-50" id="pricing">
            <div className="max-w-5xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold font-serif">Flexible Pricing Models</h2>
                    <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
                        Choose the pricing model that works best for your organisation and employees.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {models.map((model,i) => (
                        <motion.div
                        whileHover={{ scale: 1.03, boxShadow: "0 0 25px rgba(16, 185, 129, 0.6"}}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        key={i}
                        className="bg-white rounded-2xl shadow-md p-6 border hover:shadow-green-400/40 relative transition">
                            <h3 className="text-xl font-semibold">{model.name}</h3>
                            <p className="text-gray-500 mt-1">{model.description}</p>

                            <div className="mt-4">
                                <span className="text-3xl font-bold">{model.price}</span>
                                <span className="text-gray-500 ml-2 text-sm">{model.sub}</span><br/> <br />
                                <span className="mt-1 text-gray-600">{model.extra}</span>

                                <ul className="mt-6 space-y-2">
                                    {model.features.map((feature,j) => (
                                        <li key={j} className="flex items-center gap-2 text-gray-700">
                                            <FiCheck className="w-5 h-5 text-green-400" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <button className="font-bold mt-6 w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-transparent hover:text-green-400 transition hover:border-green-500 border">
                                    Select {model.name}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}