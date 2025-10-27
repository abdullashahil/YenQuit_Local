import { useState } from "react";
import React from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Card } from "../../ui/card";
import { ImageWithFallback } from "../../images/ImageWithFallback";
import { 
  Heart, 
  DollarSign, 
  Smile, 
  TrendingUp, 
  Shield, 
  Users,
  Mail,
  Phone,
  MapPin
} from "lucide-react";

interface LandingPageProps {
  onNavigateToLogin: () => void;
  onNavigateToSignup: () => void;
}

export function LandingPage({ onNavigateToLogin, onNavigateToSignup }: LandingPageProps) {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", contactForm);
    // Reset form
    setContactForm({ name: "", email: "", message: "" });
  };

  const benefits = [
    {
      icon: Heart,
      title: "Better Health",
      description: "Reduce risk of heart disease, stroke, and cancer. Your body begins healing within 20 minutes of quitting.",
    },
    {
      icon: DollarSign,
      title: "Save Money",
      description: "The average smoker saves over $2,000 per year after quitting. Invest in your future, not cigarettes.",
    },
    {
      icon: Smile,
      title: "Quality of Life",
      description: "Enjoy better breathing, improved taste and smell, and more energy for the things you love.",
    },
    {
      icon: TrendingUp,
      title: "Long-term Success",
      description: "With proper support, your chances of successfully quitting increase by 300%. You're not alone.",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Evidence-Based Approach",
      description: "Our methods are backed by scientific research and proven success stories.",
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with others on the same journey. Share experiences, tips, and encouragement.",
    },
    {
      icon: TrendingUp,
      title: "Track Your Progress",
      description: "Visualize your journey with detailed tracking and celebrate every milestone.",
    },
  ];

  const testimonials = [
    {
      name: "Michael Rodriguez",
      quote: "After 15 years of smoking, I finally found a program that worked. The daily support and tracking kept me motivated. I've been smoke-free for 8 months!",
      role: "Smoke-free for 8 months",
    },
    {
      name: "Sarah Chen",
      quote: "The community feature was a game-changer. Knowing others were going through the same struggles made all the difference. I'm healthier and happier than ever.",
      role: "Smoke-free for 1 year",
    },
    {
      name: "James Patterson",
      quote: "I tried quitting multiple times before. This app's personalized approach and AI-powered support helped me understand my triggers and build lasting habits.",
      role: "Smoke-free for 6 months",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Navigation */}
      <nav 
        className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <h1 
                className="text-lg md:text-2xl cursor-pointer brand-heading"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Quitting Journey App
              </h1>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection("about")}
                className="text-sm transition-colors hover:opacity-70 brand-text"
              >
                About Us
              </button>
              <button
                onClick={() => scrollToSection("why-quit")}
                className="text-sm transition-colors hover:opacity-70 brand-text"
              >
                Why Quit
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="text-sm transition-colors hover:opacity-70 brand-text"
              >
                Testimonials
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-sm transition-colors hover:opacity-70 brand-text"
              >
                Contact Us
              </button>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-2 md:gap-4">
              <Button
                onClick={onNavigateToLogin}
                variant="outline"
                className="hidden sm:block px-4 md:px-6 py-2 rounded-xl transition-all hover:bg-gray-50 brand-btn-outline"
              >
                Login
              </Button>
              <Button
                onClick={onNavigateToSignup}
                className="px-4 md:px-6 py-2 text-sm md:text-base rounded-xl text-white transition-all hover:opacity-90 shadow-md brand-btn"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-10 md:py-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div>
              <h1 
                className="text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6 leading-tight brand-hero-title"
              >
                Your Journey to a Smoke-Free Life Starts Here
              </h1>
              <p 
                className="text-base md:text-lg lg:text-xl mb-6 md:mb-8 leading-relaxed brand-hero-subtitle"
              >
                Join thousands of people who have successfully quit smoking with our evidence-based support program. 
                Track your progress, connect with a community, and reclaim your health—one day at a time.
              </p>
              <Button
                onClick={onNavigateToSignup}
                className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-6 rounded-2xl text-white text-base md:text-lg transition-all hover:opacity-90 shadow-lg brand-btn-lg"
              >
                Get Started Now
              </Button>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3 md:gap-6 mt-8 md:mt-12">
                <div>
                  <p 
                    className="text-xl md:text-2xl lg:text-3xl mb-1 brand-accent"
                  >
                    10K+
                  </p>
                  <p className="text-xs md:text-sm" style={{ color: "#333333", opacity: 0.7 }}>
                    Users Helped
                  </p>
                </div>
                <div>
                  <p 
                    className="text-xl md:text-2xl lg:text-3xl mb-1 brand-accent"
                  >
                    85%
                  </p>
                  <p className="text-xs md:text-sm" style={{ color: "#333333", opacity: 0.7 }}>
                    Success Rate
                  </p>
                </div>
                <div>
                  <p 
                    className="text-xl md:text-2xl lg:text-3xl mb-1 brand-accent"
                  >
                    24/7
                  </p>
                  <p className="text-xs md:text-sm" style={{ color: "#333333", opacity: 0.7 }}>
                    Support
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Hero Image */}
            <div className="relative hidden lg:block">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1637091476785-55859d508285?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBjb25maWRlbnQlMjBzdW5yaXNlJTIwaG9wZXxlbnwxfHx8fDE3NjEyNzkwNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Person looking confident towards a bright future"
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-12 md:py-20 px-4 md:px-6 brand-section-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-16">
            <h2 
              className="text-2xl md:text-3xl lg:text-4xl mb-3 md:mb-4 brand-heading"
            >
              About Us
            </h2>
            <p 
              className="text-sm md:text-base lg:text-lg max-w-3xl mx-auto brand-muted"
            >
              We believe that everyone deserves the freedom to live smoke-free. Our mission is to provide 
              compassionate, evidence-based support that empowers you to quit tobacco for good.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index}
                  className="p-6 md:p-8 rounded-2xl md:rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all bg-white brand-card"
                >
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: "#20B2AA20" }}
                  >
                    <Icon className="w-7 h-7 brand-accent" />
                  </div>
                  <h3 
                    className="text-lg md:text-xl mb-2 md:mb-3 brand-heading"
                  >
                    {feature.title}
                  </h3>
                  <p 
                    className="text-sm leading-relaxed brand-muted"
                  >
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Quit Section */}
      <section id="why-quit" className="py-12 md:py-20 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-16">
            <h2 
              className="text-2xl md:text-3xl lg:text-4xl mb-3 md:mb-4 brand-heading"
            >
              Why Quit?
            </h2>
            <p 
              className="text-sm md:text-base lg:text-lg max-w-3xl mx-auto brand-muted"
            >
              Quitting smoking is one of the best decisions you can make for your health, finances, and overall well-being.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-12 md:py-20 px-4 md:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 
              className="text-2xl md:text-3xl lg:text-4xl mb-3 md:mb-4 brand-heading"
            >
              Get In Touch
            </h2>
            <p 
              className="text-sm md:text-base lg:text-lg brand-muted"
            >
              Have questions? We're here to help. Reach out to our support team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
            {/* Contact Form */}
            <Card className="p-6 md:p-8 rounded-2xl md:rounded-3xl border-0 shadow-lg brand-card">
              <h3 
                className="text-lg md:text-xl mb-4 md:mb-6 brand-heading"
              >
                Send Us a Message
              </h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Your Name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="rounded-2xl h-12 border-gray-200 brand-border"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Your Email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="rounded-2xl h-12 border-gray-200 brand-border"
                    required
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Your Message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="rounded-2xl min-h-32 border-gray-200 resize-none brand-border"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full py-4 md:py-6 rounded-2xl text-white transition-all hover:opacity-90 shadow-md brand-btn"
                >
                  Send Message
                </Button>
              </form>
            </Card>

            {/* Contact Information */}
            <div className="space-y-4 md:space-y-8">
              <Card className="p-4 md:p-6 rounded-2xl md:rounded-3xl border-0 shadow-lg brand-card">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center brand-accent-bg"
                  >
                    <Mail className="w-6 h-6 brand-accent" />
                  </div>
                  <div>
                    <p className="text-sm mb-1 brand-heading">
                      Email
                    </p>
                    <p className="text-sm brand-muted">
                      support@quittingjourney.com
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 md:p-6 rounded-2xl md:rounded-3xl border-0 shadow-lg brand-card">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center brand-accent-bg"
                  >
                    <Phone className="w-6 h-6 brand-accent" />
                  </div>
                  <div>
                    <p className="text-sm mb-1 brand-heading">
                      Phone
                    </p>
                    <p className="text-sm brand-muted">
                      1-800-QUIT-NOW
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 rounded-3xl border-0 shadow-lg brand-card">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center brand-accent-bg"
                  >
                    <MapPin className="w-6 h-6 brand-accent" />
                  </div>
                  <div>
                    <p className="text-sm mb-1 brand-heading">
                      Location
                    </p>
                    <p className="text-sm brand-muted">
                      San Francisco, CA
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm brand-text opacity-60">
              © 2025 Quitting Journey App. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <button className="text-sm hover:opacity-70 transition-colors brand-text opacity-60">
                Privacy Policy
              </button>
              <button className="text-sm hover:opacity-70 transition-colors brand-text opacity-60">
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
