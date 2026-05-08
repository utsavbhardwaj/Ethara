'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Zap, Users, BarChart3, Kanban, Shield, Bell,
  ArrowRight, CheckCircle2, Star
} from 'lucide-react';

const features = [
  {
    icon: Kanban,
    title: 'Kanban Board',
    description: 'Drag-and-drop task management with visual workflows. Move tasks across TODO, In Progress, Review, and Completed.',
    gradient: 'from-indigo-500 to-violet-500',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Invite teammates, assign roles, and manage permissions with granular role-based access control.',
    gradient: 'from-violet-500 to-cyan-500',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Real-time insights on team productivity, task completion rates, and overdue items at a glance.',
    gradient: 'from-cyan-500 to-indigo-500',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimistic UI updates and smart caching ensure a buttery-smooth experience even with large teams.',
    gradient: 'from-indigo-500 to-violet-500',
  },
  {
    icon: Shield,
    title: 'Secure by Default',
    description: 'JWT authentication, RBAC middleware, rate limiting, and encrypted storage keep your data safe.',
    gradient: 'from-violet-500 to-cyan-500',
  },
  {
    icon: Bell,
    title: 'Activity Timeline',
    description: 'Stay informed with real-time activity feeds tracking every change across all your projects.',
    gradient: 'from-cyan-500 to-indigo-500',
  },
];

const testimonials = [
  {
    name: 'Sarah Kim',
    role: 'Engineering Lead @ Vercel',
    quote: 'FlowSphere replaced three tools for us. The kanban board is silky smooth and the analytics are exactly what our team needed.',
    avatar: 'SK',
  },
  {
    name: 'Marcus Chen',
    role: 'Product Manager @ Linear',
    quote: 'Finally a task manager that doesn\'t feel like it was designed in 2010. The dark UI and animations are chef\'s kiss.',
    avatar: 'MC',
  },
  {
    name: 'Priya Patel',
    role: 'CTO @ Startup',
    quote: 'We onboarded our entire team in an afternoon. The role-based access is exactly what we needed for our client projects.',
    avatar: 'PP',
  },
];

const stats = [
  { value: '10k+', label: 'Active Teams' },
  { value: '500k+', label: 'Tasks Completed' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9★', label: 'Average Rating' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen selection:bg-indigo-100 selection:text-indigo-900" style={{ background: 'var(--bg-primary)' }}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1a1a2e] flex items-center justify-center overflow-hidden">
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight" style={{ color: '#1a1a2e' }}>FlowSphere</span>
          </div>
          <div className="hidden lg:flex items-center gap-10">
            {['Read our blog', 'Visit our GitHub', 'Join our Community'].map((item) => (
              <a key={item} href="#" className="text-[15px] font-medium transition-colors" style={{ color: 'var(--text-primary)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
              >
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[15px] font-semibold px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors" style={{ color: 'var(--text-primary)' }}>Log in</Link>
            <Link href="/signup" className="btn-primary">
              Get now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-40 pb-32 px-6 overflow-hidden">
        {/* Soft background blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[80%] rounded-full blur-[120px] opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #6366f1, #a855f7, transparent)' }} />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-sm font-semibold"
              style={{ background: 'rgba(99, 102, 241, 0.08)', color: '#6366f1', border: '1px solid rgba(99, 102, 241, 0.1)' }}
            >
              <Zap size={14} fill="currentColor" />
              Web3, decentralized task management
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-bold leading-[1.1] mb-8 tracking-tight" style={{ color: '#1a1a2e' }}>
              Teams, <br />
              <span className="text-gray-400">decentralized</span>
            </h1>

            <p className="text-xl md:text-2xl mb-12 max-w-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Your projects, tasks, and team all in one place — secure, simple, and lightning fast.
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <Link href="/signup" className="btn-primary text-lg px-10 py-4 rounded-2xl">
                <Shield size={20} className="mr-2" />
                Start for free
              </Link>
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold"
                    style={{ background: `hsl(${i * 40}, 70%, 80%)` }}>
                    U{i}
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-white flex items-center justify-center text-[10px] font-bold text-gray-400 shadow-sm">
                  +2k
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="relative z-10 p-4">
              <img 
                src="/hero-asset.png" 
                alt="3D Crystal Render" 
                className="w-full h-auto drop-shadow-[0_50px_50px_rgba(99,102,241,0.2)] animate-float"
              />
            </div>
            {/* Decorative elements */}
            <motion.div 
              animate={{ y: [0, -20, 0] }} 
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 right-0 w-24 h-24 bg-white/40 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl z-20 flex items-center justify-center"
            >
              <Kanban size={32} className="text-indigo-500" />
            </motion.div>
            <motion.div 
              animate={{ y: [0, 20, 0] }} 
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-20 left-0 w-20 h-20 bg-white/40 backdrop-blur-xl rounded-full border border-white/50 shadow-2xl z-20 flex items-center justify-center"
            >
              <Users size={28} className="text-purple-500" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features - Minimalist */}
      <section id="features" className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-16">
            {features.slice(0, 3).map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-8`}>
                  <feature.icon size={28} className="text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: '#1a1a2e' }}>{feature.title}</h3>
                <p className="text-lg leading-relaxed text-gray-500">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-40 px-6 relative overflow-hidden" style={{ background: '#f8f9ff' }}>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold mb-10 tracking-tight" style={{ color: '#1a1a2e' }}>
            Ready to flow?
          </h2>
          <Link href="/signup" className="btn-primary text-xl px-12 py-5 rounded-3xl">
            Create your account <ArrowRight size={24} className="ml-2" />
          </Link>
          <p className="mt-8 text-gray-400 font-medium italic">No credit card required. Free forever for individuals.</p>
        </div>
        
        {/* Subtle background circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-100/50 rounded-full blur-3xl -z-10" />
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1a1a2e] flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight" style={{ color: '#1a1a2e' }}>FlowSphere</span>
          </div>
          <div className="flex items-center gap-10 text-gray-400 font-medium">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Security</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Support</a>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-indigo-600 cursor-pointer transition-all">
              <span className="font-bold">𝕏</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-indigo-600 cursor-pointer transition-all">
              <span className="font-bold">GH</span>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-gray-50 text-center text-gray-300 text-sm font-medium">
          © 2026 FlowSphere · Crafted for the modern web.
        </div>
      </footer>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
