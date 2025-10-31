"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Slider from "react-slick";
import Link from 'next/link';

export function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fade-in animation on load
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Testimonial slider settings
  const testimonialSettings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  // Hero text slider settings
  const heroSettings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    fade: true,
    pauseOnHover: false,
    arrows: false
  };

  const steps = [
    {
      emoji: "🗒️",
      title: "ASK",
      description: "Assess Your Tobacco Use And History",
      color: "from-blue-400 to-cyan-400"
    },
    {
      emoji: "💡",
      title: "ADVISE",
      description: "Get Professional Guidance To Quit",
      color: "from-purple-400 to-pink-400"
    },
    {
      emoji: "📊",
      title: "ASSESS",
      description: "Receive Personalized Treatment",
      color: "from-green-400 to-emerald-400"
    },
    {
      emoji: "🤝",
      title: "ASSIST",
      description: "Measure Your Dependence Level",
      color: "from-orange-400 to-red-400"
    },
    {
      emoji: "📅",
      title: "ARRANGE",
      description: "Schedule Ongoing Support",
      color: "from-indigo-400 to-purple-400"
    },
  ];

  // Hero text slides
  const heroSlides = [
    {
      title: "Your Journey To A Smoke-Free Life Starts With",
      highlight: "YENQUIT",
      description: "Quitting smoking isn't easy, but you don't have to do it alone. YenQuit provides personalized tools, daily motivation, and expert guidance to help you quit for good. Join a growing community of people transforming their lives — and start your journey to a healthier, happier you."
    },
    {
      title: "Take The First Step Towards A",
      highlight: "Healthier Future",
      description: "Every journey begins with a single step. With YenQuit, you get comprehensive support, proven strategies, and a community that cares about your success. Start your transformation today and discover the benefits of a smoke-free life."
    },
    {
      title: "Join Thousands Who Have Successfully",
      highlight: "Quit Smoking",
      description: "You're not alone in this journey. Our evidence-based approach and supportive community have helped thousands break free from smoking addiction. Be the next success story and reclaim your health, energy, and freedom."
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "AISHA KHAN",
      image: "/images/user1.png",
      text: "What I love about YenQuit is how supportive it feels. It's not just an app; it's like having a friend who understands what you're going through.",
      role: "Smoke-free for 8 months"
    },
    {
      name: "VIKRAM SHETTY",
      image: "/images/user2.png",
      text: "I used to think quitting was impossible, but with YenQuit's step-by-step plan and motivation, I did it. My energy and focus are back!",
      role: "Smoke-free for 1 year"
    },
    {
      name: "RAHUL MENON",
      image: "/images/user1.png",
      text: "YenQuit helped me finally take control. The daily tips and reminders kept me on track — I've been smoke-free for 6 months now!",
      role: "Smoke-free for 6 months"
    },
    {
      name: "PRIYA SHARMA",
      image: "/images/user2.png",
      text: "The community support in YenQuit made all the difference. Sharing experiences and getting encouragement helped me stay committed.",
      role: "Smoke-free for 9 months"
    },
    {
      name: "ANAND PATEL",
      image: "/images/user1.png",
      text: "After 15 years of smoking, I never thought I could quit. YenQuit's personalized approach proved me wrong. Thank you!",
      role: "Smoke-free for 1.5 years"
    },
    {
      name: "SNEHA REDDY",
      image: "/images/user2.png",
      text: "The progress tracking and milestones kept me motivated. Celebrating small victories made the journey enjoyable and sustainable.",
      role: "Smoke-free for 11 months"
    }
  ];

  // Stats data
  const stats = [
    { number: "10K+", label: "Users Helped" },
    { number: "85%", label: "Success Rate" },
    { number: "2.5M+", label: "Cigarettes Not Smoked" },
    { number: "24/7", label: "Support Available" }
  ];

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={`font-sans text-[#1C3B5E] bg-white scroll-smooth overflow-x-hidden transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Enhanced Navbar */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'}`}>
        <div className="flex justify-between items-center px-6 md:px-12">
          {/* Logo */}
          <h1
            className="text-2xl md:text-3xl font-extrabold tracking-wide cursor-pointer transition-transform hover:scale-105"
            onClick={() => scrollToSection("hero")}
          >
            YEN<span className="text-[#FFC107]">QUIT</span>
          </h1>

          {/* Hamburger Menu for Mobile */}
          <button
            className="md:hidden flex flex-col space-y-1 z-20 group"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-0.5 bg-[#1C3B5E] transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5 bg-[#FFC107]' : 'group-hover:bg-[#FFC107]'}`}></span>
            <span className={`w-6 h-0.5 bg-[#1C3B5E] transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100 group-hover:bg-[#FFC107]'}`}></span>
            <span className={`w-6 h-0.5 bg-[#1C3B5E] transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5 bg-[#FFC107]' : 'group-hover:bg-[#FFC107]'}`}></span>
          </button>

          {/* Mobile Menu Overlay */}
          <div className={`fixed inset-0 bg-white z-10 flex flex-col items-center justify-center transition-transform duration-500 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <nav className="flex flex-col space-y-8 text-center font-semibold text-2xl">
              <button onClick={() => scrollToSection("about")} className="hover:text-[#FFC107] py-2 transition-all duration-300 hover:scale-110">About Us</button>
              <button onClick={() => scrollToSection("whyquit")} className="hover:text-[#FFC107] py-2 transition-all duration-300 hover:scale-110">Why Quit</button>
              <button onClick={() => scrollToSection("testimonials")} className="hover:text-[#FFC107] py-2 transition-all duration-300 hover:scale-110">Testimonials</button>
              <button onClick={() => scrollToSection("footer")} className="hover:text-[#FFC107] py-2 transition-all duration-300 hover:scale-110">Contact Us</button>
            </nav>
            <button className="bg-gradient-to-r from-[#FFC107] to-[#FFD54F] px-8 py-3 rounded-full text-white font-semibold shadow-lg mt-8 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              Login
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="hidden md:flex space-x-8 font-medium">
              <button onClick={() => scrollToSection("about")} className="hover:text-[#FFC107] transition-all duration-300 relative group">
                About Us
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFC107] transition-all duration-300 group-hover:w-full"></span>
              </button>
              <button onClick={() => scrollToSection("whyquit")} className="hover:text-[#FFC107] transition-all duration-300 relative group">
                Why Quit
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFC107] transition-all duration-300 group-hover:w-full"></span>
              </button>
              <button onClick={() => scrollToSection("testimonials")} className="hover:text-[#FFC107] transition-all duration-300 relative group">
                Testimonials
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFC107] transition-all duration-300 group-hover:w-full"></span>
              </button>
              <button onClick={() => scrollToSection("footer")} className="hover:text-[#FFC107] transition-all duration-300 relative group">
                Contact Us
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFC107] transition-all duration-300 group-hover:w-full"></span>
              </button>
            </nav>
            <button className="bg-gradient-to-r from-[#FFC107] to-[#FFD54F] px-6 py-2 rounded-full text-white font-semibold shadow transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <Link
                href="/login">
                Login
              </Link>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Text Slider */}
      <section id="hero" className="min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-12 pt-24 md:pt-32 pb-12 md:pb-20 bg-gradient-to-br from-white to-blue-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#FFC107] opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1C3B5E] opacity-5 rounded-full translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-xl w-full md:w-auto text-center md:text-left z-10">
          <Slider {...heroSettings} className="hero-text-slider mb-8">
            {heroSlides.map((slide, index) => (
              <div key={index} className="outline-none">
                <h2 className="text-3xl md:text-5xl font-extrabold leading-snug md:leading-tight">
                  {slide.title}{" "}
                  <span className="text-[#273A56]">{slide.highlight.includes("YENQUIT") ? "YEN" : ""}</span>
                  <span className="text-[#FFC107] bg-clip-text text-transparent bg-gradient-to-r from-[#FFC107] to-[#FFD54F]">
                    {slide.highlight.includes("YENQUIT") ? "QUIT" : slide.highlight}
                  </span>
                </h2>
                <p className="text-gray-600 mt-5 leading-relaxed text-base md:text-lg">
                  {slide.description}
                </p>
              </div>
            ))}
          </Slider>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="bg-gradient-to-r from-[#FFC107] to-[#FFD54F] px-8 py-4 rounded-full text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <Link
                href="/login">
                Get Started Free
              </Link>
            </button>
            <button className="border-2 border-[#1C3B5E] px-8 py-4 rounded-full text-[#1C3B5E] font-semibold transition-all duration-300 hover:bg-[#1C3B5E] hover:text-white">
              Learn More
            </button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-14">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-[#1C3B5E]">{stat.number}</div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Image with floating animation */}
        <div className="hidden md:block mt-10 md:mt-0 ml-1 w-full flex justify-center relative">
          <div className="relative">
            <Image
              src="/images/cigbg.png"
              alt="Quit Smoking Illustration"
              width={650}
              height={500}
              className="rounded-lg object-contain w-full  max-w-md md:max-w-full animate-float z-10"
            />
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#FFC107] rounded-full opacity-20 animate-pulse z-0"></div>
            <div className="absolute -bottom-4 -left-2 w-10 h-10 bg-[#1C3B5E] rounded-full opacity-20 animate-pulse delay-1000 z-0"></div>
          </div>
        </div>
      </section>

      {/* Evidence-Based Approach */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl md:text-4xl font-bold text-[#1C3B5E] mb-4 uppercase tracking-wide text-center">
            Evidence–Based Approach
          </h3>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            Our proven 5-step methodology has helped thousands achieve lasting freedom from smoking
          </p>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-6 text-center shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-gray-100"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {step.emoji}
                </div>
                <h4 className="text-lg font-bold text-[#1C3B5E] mb-2">{step.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-8 h-1 bg-gradient-to-r from-[#FFC107] to-[#FFD54F] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Quit */}
      <section id="whyquit" className="py-16 md:py-24 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/family.png"
                alt="Why Quit Smoking"
                width={600}
                height={400}
                className="rounded-2xl object-cover w-full h-auto transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#FFC107] rounded-full opacity-30"></div>
            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-[#1C3B5E] rounded-full opacity-20"></div>
          </div>

          <div>
            <span className="text-[#1C3B5E] font-bold text-sm tracking-widest mb-2 inline-block px-3 py-1 bg-blue-50 rounded-full">WHY QUIT</span>
            <h3 className="text-3xl md:text-4xl font-bold leading-snug mt-4">
              Every Breath Without Smoke Is A Step Toward A{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFC107] to-[#FFD54F]">Stronger, Happier You</span>
            </h3>
            <p className="text-gray-600 mt-6 leading-relaxed text-lg">
              Quitting smoking isn't just about breaking a habit — it's about reclaiming your
              health, energy, and peace of mind. Within weeks, your lungs begin to heal,
              your body gets stronger, and your confidence returns.
            </p>

            {/* Benefits list */}
            <div className="mt-8 space-y-4">
              {[
                "Improved lung capacity and breathing",
                "Reduced risk of heart disease and cancer",
                "Better sense of taste and smell",
                "Increased energy and stamina",
                "Financial savings",
                "Healthier skin and appearance"
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-16 md:py-24 px-6 md:px-12 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div>
            <span className="text-[#1C3B5E] font-bold text-sm tracking-widest mb-2 inline-block px-3 py-1 bg-blue-50 rounded-full">ABOUT YENQUIT</span>
            <h3 className="text-3xl md:text-4xl font-bold leading-snug mt-4">
              A student-led initiative from Yenepoya University, guided by{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFC107] to-[#FFD54F]">passion and purpose</span>
            </h3>

            <ul className="space-y-6 text-[#1C3B5E] text-base leading-relaxed mt-8">
              <li className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <span className="text-[#FFC107] text-2xl flex-shrink-0">•</span>
                <span>
                  We Are A Group Of Dedicated Students From Yenepoya University, Developing
                  YenQuit — A Web Application Designed To Help Users Overcome Smoking And
                  Other Addictive Habits.
                </span>
              </li>
              <li className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <span className="text-[#FFC107] text-2xl flex-shrink-0">•</span>
                <span>
                  Our Project Is Mentored And Inspired By Dr. Imran, The Founder Of The Idea,
                  Whose Vision To Promote A Healthier, Addiction-Free Community Drives Our Mission.
                </span>
              </li>
              <li className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <span className="text-[#FFC107] text-2xl flex-shrink-0">•</span>
                <span>
                  With Technical Guidance From Yasir, Our Senior Full-Stack Developer,
                  We're Building A Supportive And User-Friendly Platform That Empowers People
                  To Quit And Live Better, Healthier Lives.
                </span>
              </li>
            </ul>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/aboutyen.png"
                alt="About YenQuit"
                width={550}
                height={400}
                className="rounded-2xl object-cover w-full h-auto transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
            </div>
            {/* Floating badge */}
            {/* <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-[#FFC107] to-[#FFD54F] text-white px-6 py-3 rounded-2xl shadow-lg transform rotate-3">
              <div className="text-sm font-semibold">Since 2024</div>
              <div className="text-xs opacity-90">Making Lives Better</div>
            </div> */}
          </div>
        </div>
      </section>

      {/* Testimonials with Enhanced Slider */}
      <section id="testimonials" className="py-16 md:py-24 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <span className="text-[#1C3B5E] font-bold text-sm tracking-widest mb-2 inline-block px-3 py-1 bg-blue-50 rounded-full">TESTIMONIALS</span>
          <h3 className="text-3xl md:text-4xl font-extrabold text-[#1C3B5E] mb-4 mt-2">
            Read What Others Have To Say
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">
            Join thousands of successful quitters who have transformed their lives with YenQuit
          </p>

          <div className="relative">
            <Slider {...testimonialSettings}>
              {testimonials.map((testimonial, index) => (
                <div key={index} className="px-4 outline-none">
                  <div className="bg-gradient-to-br from-[#1C3B5E] to-[#2D4A6E] text-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 min-h-[420px] flex flex-col justify-between relative overflow-hidden">
                    {/* Quote icon */}
                    <div className="absolute top-6 right-6 text-6xl opacity-10">"</div>

                    <div>
                      <div className="flex justify-center mb-6">
                        <div className="relative">
                          <Image
                            src={testimonial.image}
                            alt={testimonial.name}
                            width={80}
                            height={80}
                            className="rounded-full border-4 border-white shadow-lg object-cover bg-white"
                          />
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
                        </div>
                      </div>

                      <h4 className="font-bold text-lg mb-2">{testimonial.name}</h4>
                      <p className="text-yellow-200 text-sm mb-4 font-medium">{testimonial.role}</p>

                      <p className="text-gray-200 leading-relaxed text-center">
                        "{testimonial.text}"
                      </p>
                    </div>

                    {/* Rating stars */}
                    <div className="flex justify-center mt-6 space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="text-yellow-400 text-lg">★</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto bg-gradient-to-r from-[#4A8BB2] via-[#5D9BC6] to-[#C7A74E] text-center text-white rounded-3xl p-12 md:p-16 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
          </div>

          <span className="text-sm font-semibold uppercase tracking-widest mb-3 opacity-90 inline-block px-4 py-1 bg-white/20 rounded-full">
            ARE YOU READY?
          </span>
          <h3 className="text-3xl md:text-5xl font-bold leading-snug mb-8 mt-4 max-w-3xl mx-auto">
            Join Hands With Us — Your Journey To A Fresh, Smoke-Free Life Starts Today
          </h3>
          <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
            Take the first step towards a healthier, happier you. Join thousands who have already transformed their lives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-black text-white px-10 py-4 rounded-full font-semibold text-lg tracking-wide shadow-lg hover:scale-105 transition-transform duration-300 hover:shadow-xl z-10">
              <Link
                href="/login">
                GET STARTED NOW
              </Link>
            </button>
            <button className="bg-white/20 text-white px-10 py-4 rounded-full font-semibold text-lg tracking-wide backdrop-blur-sm hover:bg-white/30 transition-all duration-300 hover:scale-105 z-10">
              <Link
                href="/login">
                SCHEDULE A CALL
              </Link>
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer id="footer" className="bg-gradient-to-b from-white to-blue-50 text-[#1C3B5E] py-16 md:py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 items-start">
            {/* Logo and description */}
            <div className="md:col-span-2">
              <h1 className="text-3xl font-extrabold mb-4">
                <span className="text-[#1C3B5E]">YEN</span>
                <span className="text-[#F5B82E]">QUIT</span>
              </h1>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Your trusted companion in the journey to a smoke-free life. We provide evidence-based tools,
                community support, and personalized guidance to help you quit smoking for good.
              </p>
              <div className="flex space-x-4">
                {/* Facebook Icon */}
                <a href="#" className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-[#1877F2] hover:shadow-lg transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                  </svg>
                </a>

                {/* X (Twitter) Icon */}
                <a href="#" className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-[#000000] hover:shadow-lg transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.475 11.633Z" />
                  </svg>
                </a>

                {/* Instagram Icon */}
                <a href="#" className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-[#E4405F] hover:shadow-lg transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 1 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
                  </svg>
                </a>

                {/* LinkedIn Icon */}
                <a href="#" className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-[#0A66C2] hover:shadow-lg transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col items-start">
              <h3 className="text-[#F5B82E] font-semibold mb-4 text-lg">YENQUIT</h3>
              <ul className="space-y-3 text-sm">
                <li><button onClick={() => scrollToSection("hero")} className="hover:text-[#F5B82E] transition-colors duration-300">Home</button></li>
                <li><button onClick={() => scrollToSection("about")} className="hover:text-[#F5B82E] transition-colors duration-300">About Us</button></li>
                <li><button onClick={() => scrollToSection("whyquit")} className="hover:text-[#F5B82E] transition-colors duration-300">Why Quit</button></li>
                <li><button onClick={() => scrollToSection("testimonials")} className="hover:text-[#F5B82E] transition-colors duration-300">Testimonials</button></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="flex flex-col items-start">
              <h3 className="text-[#F5B82E] font-semibold mb-4 text-lg">CONTACT</h3>
              <div className="space-y-3 text-sm">
                <p className="flex items-center gap-2">
                  <span>📍</span>
                  <span>Yenepoya University, Mangalore</span>
                </p>
                <p className="flex items-center gap-2">
                  <span>📧</span>
                  <span>info@yenquit.com</span>
                </p>
                <p className="flex items-center gap-2">
                  <span>📞</span>
                  <span>+91 98765 43210</span>
                </p>
              </div>
            </div>

            {/* Newsletter */}
            <div className="flex flex-col items-start">
              <h3 className="text-[#F5B82E] font-semibold mb-4 text-lg">NEWSLETTER</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get tips and motivation delivered to your inbox
              </p>
              <div className="flex bg-white rounded-full overflow-hidden shadow-md w-full max-w-xs">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="px-4 py-3 text-sm text-gray-700 bg-transparent outline-none w-full placeholder-gray-400"
                />
                <button className="bg-gradient-to-r from-[#FFC107] to-[#FFD54F] text-white text-sm font-semibold px-4 py-3 transition-all duration-300 hover:shadow-inner">
                  SUBMIT
                </button>
              </div>
            </div>
          </div>

          {/* Bottom section */}
          <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left text-sm text-gray-500 mb-4 md:mb-0">
              © 2025 YenQuit. All rights reserved. | <button className="hover:text-[#F5B82E] transition-colors">Privacy Policy</button> • <button className="hover:text-[#F5B82E] transition-colors">Terms of Service</button>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <span>Made with ❤️ for a healthier world</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Button */}
      <button
        onClick={() => scrollToSection("hero")}
        className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-[#FFC107] to-[#FFD54F] rounded-full shadow-2xl flex items-center justify-center text-white z-40 transition-all duration-300 hover:scale-110 hover:shadow-2xl"
      >
        ↑
      </button>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}