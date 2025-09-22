'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const jobs = [
  {
    id: 1,
    title: 'Frontend Developer',
    location: 'Remote',
    short: 'Work on building sleek, modern UIs with React and Next.js.',
    description:
      'We’re looking for a Frontend Developer to join our team and help us craft intuitive, high-performing applications. Experience with React, Next.js, and TailwindCSS is a must. Bonus points if you vibe with framer-motion for animations!',
  },
  {
    id: 2,
    title: 'Backend Engineer',
    location: 'Nairobi, Kenya (Hybrid)',
    short: 'Design scalable APIs and work with databases at scale.',
    description:
      'As a Backend Engineer, you’ll architect and maintain high-availability systems, build APIs, and ensure smooth integrations. Knowledge of Node.js, PostgreSQL, and cloud services is key.',
  },
  {
    id: 3,
    title: 'Product Designer',
    location: 'Remote',
    short: 'Shape experiences and design systems for modern SaaS.',
    description:
      'Join as a Product Designer and lead our design direction, from wireframes to final UI polish. You’ll collaborate with devs and product managers to bring ideas to life.',
  },
];

export default function CareersPage() {
  const [openJob, setOpenJob] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900">Join Our Team</h1>
        <p className="mt-4 text-lg text-gray-600">
          Be part of a team that&apos;s redefining work and innovation. Explore our openings below.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
                <p className="text-sm text-gray-500">{job.location}</p>
                <p className="mt-2 text-gray-600">{job.short}</p>
              </div>
              <button
                onClick={() => setOpenJob(openJob === job.id ? null : job.id)}
                className="px-4 py-2 text-green-600 font-semibold border border-green-600 rounded-lg hover:bg-green-50 transition"
              >
                {openJob === job.id ? 'Hide Details' : 'View Details'}
              </button>
            </div>

            <AnimatePresence>
              {openJob === job.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mt-4 border-t pt-4"
                >
                  <p className="text-gray-700 mb-4">{job.description}</p>
                  <button className="px-5 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
                    Apply Now
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
