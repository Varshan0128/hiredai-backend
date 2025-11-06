// src/pages/Index.tsx
import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Target,
  Zap,
  Brain,
  BarChart3,
  Users,
} from "lucide-react";

import Header from "../components/Header";
import { Card, CardContent } from "../components/ui/card";
import AnimatedBackground from "../components/AnimatedBackground";
import WaveBackground from "../components/animations/WaveBackground";
import ParticleField from "../components/animations/ParticleField";
import FloatingResumeIllustration from "../components/FloatingResumeIllustration";
import GradientButton from "../components/GradientButton";
import AnimatedButton from "../components/AnimatedButton";

const Index: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  // animation variants (typed as any for flexibility)
  const fadeUpVariant: any = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
  };

  const staggerContainer: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Resume Builder",
      description:
        "Create ATS-optimized resumes with intelligent suggestions and industry-specific templates.",
    },
    {
      icon: Target,
      title: "Smart Job Matching",
      description:
        "Get personalized job recommendations based on your skills, experience, and career goals.",
    },
    {
      icon: BarChart3,
      title: "Resume Score & Analytics",
      description:
        "Analyze your resume's effectiveness and get actionable insights to improve your success rate.",
    },
    {
      icon: Users,
      title: "Interview Preparation",
      description:
        "Practice with AI-generated questions tailored to your experience and target positions.",
    },
  ];

  const stats = [
    { value: "50K+", label: "Resumes Created" },
    { value: "95%", label: "Success Rate" },
    { value: "200+", label: "Companies" },
    { value: "4.9/5", label: "User Rating" },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Enhanced animated background with particles and shapes */}
      <AnimatedBackground variant="hero" showParticles showShapes />
      <Header />

      {/* Hero Section with Premium Animations */}
      <section className="relative pt-32 pb-20 px-4">
        <WaveBackground intensity="medium" className="bottom-0" />

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content - Animated Text */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-left space-y-8"
            >
              {/* Badge */}
              <motion.div
                variants={fadeUpVariant}
                className="inline-flex items-center gap-2 px-5 py-2.5 glass-card rounded-full text-primary text-sm font-semibold"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
                AI-Powered Career Platform
              </motion.div>

              {/* Headline with gradient */}
              <motion.h1
                variants={fadeUpVariant}
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight"
              >
                Build Your{" "}
                <motion.span
                  className="text-gradient inline-block"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  style={{ backgroundSize: "200% auto" }}
                >
                  Dream Career
                </motion.span>
                <br />
                with AI Assistance
              </motion.h1>

              {/* Description */}
              <motion.p
                variants={fadeUpVariant}
                className="text-xl text-muted-foreground max-w-2xl leading-relaxed"
              >
                Create professional resumes, get matched with perfect jobs, and
                prepare for interviews with our AI-powered platform trusted by
                thousands of professionals.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={fadeUpVariant}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <Link to="/dashboard">
                  <GradientButton variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                    Go to Dashboard
                  </GradientButton>
                </Link>

                <Link to="/builder">
                  <AnimatedButton
                    variant="outline"
                    size="lg"
                    className="border-2 text-lg px-10 py-4 rounded-2xl hover:bg-primary/5"
                    icon={<ArrowRight className="w-5 h-5" />}
                  >
                    Start Building Resume
                  </AnimatedButton>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Content - Floating Resume with Parallax */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              className="hidden lg:flex justify-center items-center relative"
            >
              {/* Glow effect behind resume */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-lavender/30 via-primary/20 to-sage/30 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <FloatingResumeIllustration variant="hero" className="drop-shadow-2xl relative z-10" />
            </motion.div>
          </div>

          {/* Enhanced Stats Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-24"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeUpVariant}
                whileHover={{
                  scale: 1.05,
                  y: -8,
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
              >
                <Card className="glass-card relative overflow-hidden group cursor-pointer">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-lavender/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.3 }}
                  />

                  <CardContent className="p-8 relative">
                    <motion.div
                      className="text-4xl font-bold text-gradient mb-2"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                        delay: index * 0.1,
                      }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="relative py-32 px-4">
        <ParticleField particleCount={12} color="mixed" className="opacity-50" />

        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Section Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-20"
          >
            <motion.div variants={fadeUpVariant}>
              <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
                Everything You Need to{" "}
                <span className="text-gradient">Land Your Dream Job</span>
              </h2>
            </motion.div>
            <motion.p
              variants={fadeUpVariant}
              className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            >
              From resume creation to interview preparation, we've got every step of your job search covered with AI-powered tools.
            </motion.p>
          </motion.div>

          {/* Feature Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeUpVariant}
                  whileHover={{
                    y: -10,
                    transition: { duration: 0.3, ease: "easeOut" },
                  }}
                >
                  <Card className="glass-card h-full relative overflow-hidden group cursor-pointer">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-lavender/10 via-primary/5 to-sage/10 opacity-0 group-hover:opacity-100"
                      transition={{ duration: 0.4 }}
                    />

                    <motion.div
                      className="absolute -inset-1 bg-gradient-to-r from-lavender via-primary to-sage rounded-3xl opacity-0 group-hover:opacity-20 blur-xl"
                      transition={{ duration: 0.4 }}
                    />

                    <CardContent className="p-8 relative h-full flex flex-col">
                      <motion.div
                        className="w-16 h-16 bg-gradient-to-br from-primary/20 to-lavender/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="w-8 h-8 text-primary" />
                      </motion.div>

                      <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed flex-grow">{feature.description}</p>

                      <motion.div
                        className="mt-4 flex items-center gap-2 text-primary font-semibold opacity-0 group-hover:opacity-100"
                        initial={{ x: -10 }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        Learn more
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="relative py-32 px-4">
        <WaveBackground intensity="strong" />
        <ParticleField particleCount={15} color="mixed" className="opacity-60" />

        <div className="container mx-auto max-w-5xl relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <Card className="glass-card p-12 md:p-16 text-center relative overflow-hidden group">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-lavender/20 via-primary/10 to-sage/20"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{ backgroundSize: "200% 200%" }}
              />

              <div className="absolute top-0 left-1/4 w-64 h-64 bg-lavender/30 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-sage/30 rounded-full blur-3xl" />

              <CardContent className="p-0 relative">
                <motion.div
                  className="w-20 h-20 bg-gradient-to-br from-lavender to-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl"
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(155, 138, 251, 0.4)",
                      "0 0 0 30px rgba(155, 138, 251, 0)",
                      "0 0 0 0 rgba(155, 138, 251, 0.4)",
                    ],
                    rotate: [0, 360],
                  }}
                  transition={{
                    boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  }}
                >
                  <Zap className="w-10 h-10 text-white" />
                </motion.div>

                <motion.h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                  Ready to Transform Your <span className="text-gradient">Career?</span>
                </motion.h2>

                <motion.p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                  Join thousands of professionals who have successfully landed their dream jobs with our AI-powered platform.
                </motion.p>

                <motion.div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/auth">
                    <GradientButton variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                      Get Started Free
                    </GradientButton>
                  </Link>
                  <Link to="/dashboard">
                    <AnimatedButton variant="outline" size="lg" className="border-2 text-lg px-10 py-4 rounded-2xl hover:bg-primary/5">
                      View Dashboard
                    </AnimatedButton>
                  </Link>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
