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
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b" style={{ borderColor: 'rgba(0,0,0,0.03)', background: 'rgba(255, 255, 255, 0.8)' }}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1a1a2e] flex items-center justify-center shadow-lg">
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight" style={{ color: '#1a1a2e' }}>FlowSphere</span>
          </div>
          <div className="hidden lg:flex items-center gap-10">
            {['Product', 'Integrations', 'Pricing', 'Company'].map((item) => (
              <a key={item} href="#" className="text-[14px] font-semibold text-gray-500 hover:text-indigo-600 transition-colors">
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[14px] font-semibold px-4 py-2 hover:bg-gray-100 rounded-xl transition-colors" style={{ color: 'var(--text-primary)' }}>Log in</Link>
            <Link href="/signup" className="btn-primary">
              Try for free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-44 pb-32 px-6 overflow-hidden">
        {/* Soft background aesthetics */}
        <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[100%] rounded-full blur-[150px] opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #6366f1, #a855f7, transparent)' }} />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[60%] rounded-full blur-[120px] opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }} />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg mb-8 text-xs font-bold uppercase tracking-wider"
                style={{ background: 'rgba(99, 102, 241, 0.08)', color: '#6366f1' }}>
                <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                New: AI-Powered Workflows
              </div>

              <h1 className="text-6xl md:text-[5.5rem] font-bold leading-[1] mb-8 tracking-tighter" style={{ color: '#1a1a2e' }}>
                Manage projects, <br />
                <span className="text-indigo-600">not chaos.</span>
              </h1>

              <p className="text-xl md:text-2xl mb-12 max-w-lg leading-relaxed text-gray-500 font-medium">
                FlowSphere combines power and simplicity to help your team ship faster. 
                Everything you need to track, collaborate, and succeed.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-5">
                <Link href="/signup" className="btn-primary text-lg px-10 py-4.5 rounded-2xl w-full sm:w-auto justify-center">
                  Get started free
                  <ArrowRight size={20} className="ml-2" />
                </Link>
                <Link href="/login" className="btn-secondary text-lg px-10 py-4.5 rounded-2xl w-full sm:w-auto justify-center">
                  Watch demo
                </Link>
              </div>

              <div className="mt-12 pt-12 border-t border-gray-100">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Trusted by world-class teams</p>
                <div className="flex flex-wrap items-center gap-10 grayscale opacity-40">
                  <div className="text-2xl font-black italic">LINEAR</div>
                  <div className="text-2xl font-black">Vercel</div>
                  <div className="text-2xl font-black">Figma</div>
                  <div className="text-2xl font-black italic">Stripe</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative lg:scale-110"
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1.1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="relative z-10">
                <img 
                  src="/dashboard-preview.png" 
                  alt="FlowSphere Dashboard Preview" 
                  className="w-full h-auto drop-shadow-[0_40px_80px_rgba(0,0,0,0.12)] rounded-3xl"
                />
              </div>

              {/* Floating Productivity Widgets */}
              <motion.div 
                animate={{ y: [0, -15, 0] }} 
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-10 glass-strong p-4 rounded-2xl shadow-2xl z-20 border border-white/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase">Task Completed</div>
                    <div className="text-xs font-bold" style={{ color: '#1a1a2e' }}>Deploy to Production</div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 15, 0] }} 
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-10 -left-10 glass-strong p-4 rounded-2xl shadow-2xl z-20 border border-white/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                    MK
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase">New Comment</div>
                    <div className="text-xs font-bold" style={{ color: '#1a1a2e' }}>"Looks good to ship! 🚀"</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Grid - The 'Clean UI' Promise */}
      <section className="py-32 px-6 bg-white border-y border-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight" style={{ color: '#1a1a2e' }}>
              Built for the way <span className="text-indigo-600">modern teams work</span>.
            </h2>
            <p className="text-xl text-gray-500">
              Powerful enough for engineers, simple enough for everyone else. 
              Say goodbye to cluttered spreadsheets and confusing interfaces.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: Kanban, 
                title: 'Visual Workflows', 
                desc: 'Manage tasks with intuitive Kanban boards that help everyone stay aligned on progress.',
                color: '#6366f1'
              },
              { 
                icon: BarChart3, 
                title: 'Real-time Analytics', 
                desc: 'Track team productivity and project health with beautiful, automated dashboards.',
                color: '#ec4899'
              },
              { 
                icon: Users, 
                title: 'Granular Collaboration', 
                desc: 'Assign roles, leave comments, and collaborate in real-time without the friction.',
                color: '#a855f7'
              }
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-3xl border border-gray-100 hover:border-indigo-100 transition-all group"
                style={{ background: '#fcfcfe' }}
              >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110"
                  style={{ background: `${f.color}15`, color: f.color }}>
                  <f.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: '#1a1a2e' }}>{f.title}</h3>
                <p className="text-lg leading-relaxed text-gray-500">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof - Large */}
      <section className="py-32 px-6" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 rounded-full mb-10 text-xs font-bold uppercase tracking-widest"
            style={{ background: '#1a1a2e', color: 'white' }}>
            Trusted Worldwide
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-16 tracking-tight" style={{ color: '#1a1a2e' }}>
            Thousands of teams <br />flow with us every day.
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm">
                <div className="text-4xl font-bold text-indigo-600 mb-2">{s.value}</div>
                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-40 px-6 relative overflow-hidden bg-[#1a1a2e]">
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 70% 30%, #6366f1, transparent)' }} />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold mb-10 tracking-tight text-white">
            Transform your <br /><span className="text-indigo-400">productivity</span> today.
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/signup" className="bg-white text-[#1a1a2e] text-xl px-12 py-5 rounded-3xl font-bold hover:bg-gray-100 transition-all flex items-center">
              Start for free <ArrowRight size={24} className="ml-2" />
            </Link>
            <Link href="/login" className="text-white font-bold border-b-2 border-white/20 hover:border-white transition-all py-1">
              Talk to Sales
            </Link>
          </div>
          <p className="mt-12 text-gray-400 font-medium">Join 10,000+ teams who ship faster with FlowSphere.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-[#1a1a2e] flex items-center justify-center shadow-md">
                  <Zap size={16} className="text-white" />
                </div>
                <span className="font-bold text-lg tracking-tight" style={{ color: '#1a1a2e' }}>FlowSphere</span>
              </div>
              <p className="text-gray-500 font-medium leading-relaxed">
                The modern project management platform for high-velocity teams.
              </p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Integrations', 'Pricing', 'Changelog'] },
              { title: 'Resources', links: ['Documentation', 'Guides', 'API Reference', 'Community'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Privacy'] }
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-6">{col.title}</h4>
                <ul className="space-y-4">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-gray-500 font-medium hover:text-indigo-600 transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-10 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-gray-400 text-sm font-medium">
              © 2026 FlowSphere · All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <span className="text-gray-300">𝕏</span>
              <span className="text-gray-300">GH</span>
              <span className="text-gray-300">LD</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
