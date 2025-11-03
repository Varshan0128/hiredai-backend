import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Linkedin, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EnhancedFooterProps {
  className?: string;
}

const EnhancedFooter: React.FC<EnhancedFooterProps> = ({ className }) => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: 'https://linkedin.com/company/root-ai',
      color: 'text-[#0077B5] hover:text-[#0077B5]/80'
    },
    {
      name: 'Email',
      icon: Mail,
      href: 'mailto:contact@root-ai.com',
      color: 'text-coral hover:text-coral/80'
    }
  ];

  const footerLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Support', href: '/support' },
    { name: 'About', href: '/about' }
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`bg-gradient-to-r from-charcoal via-charcoal-light to-charcoal border-t border-border/30 ${className}`}
    >
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-lavender to-sage rounded-2xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Hired<span className="text-lavender">AI</span>
                </h3>
                <p className="text-sm text-gray-400">AI-Powered Career Platform</p>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
              Empowering professionals with AI-driven resume optimization, job matching, and interview preparation.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-white/10 hover:border-white/20 ${link.color}`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-gray-300 hover:text-lavender transition-colors duration-200 text-sm py-1"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Contact & Attribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold text-white">Get in Touch</h4>
            <div className="space-y-3">
              <a
                href="mailto:contact@root-ai.com"
                className="flex items-center gap-2 text-gray-300 hover:text-coral transition-colors duration-200 text-sm"
              >
                <Mail className="w-4 h-4" />
                contact@root-ai.com
              </a>
              
              <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-coral" />
                  <span className="text-sm font-medium text-white">Proudly Made By</span>
                </div>
                <p className="text-gray-300 text-sm">
                  <span className="font-semibold text-white">Hired AI</span> is produced by{' '}
                  <span className="font-bold text-lavender">Root</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Advancing careers through AI innovation
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-gray-400 text-sm">
            © {currentYear} Root. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>Made with</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart className="w-4 h-4 text-coral fill-coral" />
            </motion.div>
            <span>for job seekers worldwide</span>
          </div>
        </motion.div>
      </div>
      
      {/* Decorative gradient line */}
      <div className="h-1 bg-gradient-to-r from-lavender via-sage to-coral" />
    </motion.footer>
  );
};

export default EnhancedFooter;