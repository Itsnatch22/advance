'use client';

import { motion } from 'framer-motion';
import { FaGoogle, FaLinkedin } from 'react-icons/fa';
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';

const baseSchema = z.object({
    name: z.string().min(4, "Name must be at least 4 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    role: z.enum(["employer", "employee"]),
});

const employerSchema = baseSchema.extend({
    company: z.string().min(5, "Company is required"),
    designation: z.string().min(2, "Designation is required"),
});

const employeeSchema = baseSchema.extend({
    company: z.string().min(5, "Company is required"),
    profession: z.string().min(2, "Profession is required"),
})

export default function RegisterPage() {
    const [ role, setRole ] = useState<"employer" | "employee" | "">("");
    const router = useRouter();

    const schema = role === "employer" ? employerSchema : role === "employee" ? employeeSchema : baseSchema;

    const form = useForm<any>({
        resolver: zodResolver(schema as any),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: undefined,
            company: "",
            designation: "",
            profession: "",
        },
    });

    const onSubmit = async (data: any) => {
        // Enforce role selection before proceeding
        if (!role) {
            form.setError("role" as any, { type: "manual", message: "Please select a role to continue" });
            return;
        }

        const res = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify(data),
        });

        if(!res.ok){
            router.push("/login");
        } else {
            alert("Registration failed. Please try again.");
        }
    }
    return (
        <div className='min-h-screen flex items-center justify-center dark:bg-black bg-gray-50 relative'>
            <div className="fixed inset-0 w-screen h-screen bg-green-600 
  sm:[clip-path:polygon(0_0,70%_0,100%_100%,0%_100%)] 
  [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)]"></div>
            <div className='relative z-10 w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-12 p-8'>
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className='flex flex-col justify-center text-white dark:text-black md:pr-8'
                >
                    <h1 className='text-4xl md:text-5xl font-bold leading-tight font-serif mt-12 dark:text-black'>Join EaziWage Today</h1>
                    <p className="mt-4 text-lg text-green-100 dark:text-black">Empower your employees with instant wage access. Sign up to unlock the future of payroll.</p>
                </motion.div>

                <motion.div
                initial={{ opacity:0, x:30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay:0.2 }}
                className='bg-white rounded-2xl shadow-lg p-8 mt-5'
                >
                    <h2 className='text-2xl font-semibold mb-6 text-gray-800'>Create Your Account</h2>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='mt-6 space-y-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700'>Select Role:</label>
                            <select
                                value={role}
                                onChange={(e) => {
                                    const v = e.target.value as "employer" | "employee" | "";
                                    setRole(v);
                                    form.clearErrors("role" as any);
                                    form.setValue("role", v, { shouldValidate: true, shouldDirty: true });
                                }}
                                className='mt-1 w-full px-4 py-2 border border-green-400 dark:text-black rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none'
                            >
                                <option value="">Select a role</option>
                                {["employer", "employee"].map((r) => (
                                    <option key={r} value={r}>
                                        {r.charAt(0).toUpperCase() + r.slice(1)}
                                    </option>
                                ))}
                            </select>
                            {form.formState.errors?.role && (
                                <p className="mt-1 text-sm text-red-600">{(form.formState.errors as any).role.message}</p>
                            )}
                        </div>
                        <div>
                            <input
                                {...form.register("name")}
                                placeholder='Your name'
                                className='mt-1 w-full px-4 py-2 border border-green-400 dark:text-black rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none'
                            />
                            <input
                                {...form.register("email")}
                                placeholder='johndoe@gmail.com'
                                className='mt-1 w-full px-4 py-2 border border-green-400 dark:text-black rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none'
                            />
                        </div>

                        <div>
                            {role === "employer" && (
                                <>
                                <input
                                    {...form.register("company")}
                                    placeholder='Company Name'
                                    className='mt-1 w-full px-4 py-2 border border-green-400 dark:text-black rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none'
                                />
                                <input
                                    {...form.register("designation")}
                                    placeholder='Your Designation'
                                    className='mt-1 w-full px-4 py-2 border border-green-400 dark:text-black rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none'
                                />
                                </>
                            )}
                            {role === "employee" && (
                                <>
                                <input
                                    {...form.register("profession")}
                                    placeholder='Profession'
                                    className='mt-1 w-full px-4 py-2 border border-green-400 dark:text-black rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none'
                                />
                                </>
                            )}
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700'>Password</label>
                            <input 
                            type='password'
                            className='mt-1 w-full px-4 py-2 border border-green-400 dark:text-black rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none'
                            placeholder='.........'/>
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700'>Confirm Password</label>
                            <input 
                            type='password'
                            className='mt-1 w-full px-4 py-2 border border-green-400 dark:text-black rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none'
                            placeholder='.........'/>
                        </div>
                        <button
                        type="submit"
                        disabled={!role}
                        className={`w-full mt-6 px-4 py-2 ${!role ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} dark:text-black text-white font-semibold rounded-lg transition`}
                        >
                            { !role ? 'Select a role to continue' : 'Sign Up' }
                        </button>
                    </form>

                    <div className="flex items-center my-6">
                        <div className="flex-grow h-px bg-gray-300"></div>
                        <span className="px-4 text-gray-500 text-sm">OR</span>
                        <div className="flex-grow h-px bg-gray-300"></div>
                    </div>
                    <button
                        type="button"
                        className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition"
                    >
                        <FaGoogle className="w-5 h-5" />
                        <span className="text-sm font-medium text-gray-700">Sign in with Google</span>
                    </button>
                    <button
                        type="button"
                        className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition mt-3"
                    >
                        <FaLinkedin className="w-5 h-5" />
                        <span className="text-sm font-medium text-gray-700">Sign in with LinkedIn</span>
                    </button>

                    <p className="text-sm text-gray-500 mt-6 text-center">
                        Already have an account?{' '}
                        <a href="/login" className="text-green-600 font-semibold hover:underline">
                        Log in
                        </a>
                    </p>
                </motion.div>
            </div>
        </div>
    )
}