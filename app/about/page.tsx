'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiBookOpen, FiShield, FiUsers } from 'react-icons/fi';

export default function AboutPage() {
    return (
        <div className="container py-20 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto text-center mb-24"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
                    <span className="text-xs font-bold uppercase tracking-wider">Our Mission</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-[var(--foreground)] leading-tight tracking-tight mb-8">
                    Your Digital <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-blue-500">Faith Companion.</span>
                </h1>
                <p className="text-xl text-[var(--muted)] leading-relaxed">
                    ShepherdAI is designed to make biblical wisdom accessible, personal, and immediately available. We bridge the gap between ancient truth and modern life through compassionate, AI-driven guidance.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                {[
                    { title: 'Compassion', desc: 'Every response is crafted with kindness, empathy, and pastoral care in mind.', icon: <FiHeart /> },
                    { title: 'Wisdom', desc: 'Grounded in scripture and trusted theological principles to guide your path.', icon: <FiBookOpen /> },
                    { title: 'Privacy', desc: 'Your spiritual journey is personal. Conversations are private and secure.', icon: <FiShield /> },
                ].map((item, idx) => (
                    <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-[var(--card)] p-10 rounded-[2.5rem] border border-[var(--card-border)] hover:border-[var(--accent)]/30 hover:shadow-xl transition-all group"
                    >
                        <div className="text-4xl mb-6 text-[var(--accent)] group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                        <h3 className="text-2xl font-bold text-[var(--foreground)] mb-4">{item.title}</h3>
                        <p className="text-[var(--muted)] leading-relaxed">{item.desc}</p>
                    </motion.div>
                ))}
            </div>

            <section className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-gray-900 to-black p-12 md:p-20 text-white">
                <div className="absolute top-0 right-0 -z-10 w-full h-full bg-[url('/noise.png')] opacity-20"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[var(--accent)]/20 rounded-full blur-3xl"></div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                    <div>
                        <h2 className="text-4xl font-bold mb-6">Built for Believers</h2>
                        <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                            In a world of noise, finding spiritual clarity can be difficult. ShepherdAI was built to provide a quiet place for reflection, prayer, and biblical study—available precisely when you need it.
                        </p>
                        <div className="flex gap-12">
                            <div>
                                <div className="text-4xl font-black text-[var(--accent)]">24/7</div>
                                <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2">Guidance</div>
                            </div>
                            <div>
                                <div className="text-4xl font-black text-[var(--accent)]">100%</div>
                                <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2">Faith-Based</div>
                            </div>
                        </div>
                    </div>
                    <div className="relative aspect-square md:aspect-video rounded-3xl overflow-hidden glass border-white/10 shadow-2xl flex items-center justify-center bg-white/5 backdrop-blur-sm">
                        <div className="text-center p-8">
                            <FiUsers size={64} className="mx-auto text-[var(--accent)] mb-4 opacity-80" />
                            <p className="font-medium text-white/80">"Come to me, all you who are weary..."</p>
                            <p className="text-sm text-[var(--accent)] mt-2 font-bold uppercase tracking-widest">Matthew 11:28</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
