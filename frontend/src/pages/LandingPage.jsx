import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import {
  CalendarCheck,
  Users,
  BadgeDollarSign,
  BarChart3,
  Quote,
  Twitter,
  Facebook,
  Linkedin,
  CheckCircle2,
  ArrowRight,
  Star,
  Zap,
  Shield,
  Globe,
  Clock,
  TrendingUp,
  UserCheck,
  Target,
  Sparkles,
} from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  const testimonials = [
    {
      quote: "EventFlow has transformed our operations—our team executes faster and our clients notice the difference.",
      author: "Alex Nguyen",
      role: "Director of Events at BrightWorks"
    },
    {
      quote: "The intuitive interface and powerful features have cut our event planning time in half.",
      author: "Sarah Chen",
      role: "Event Manager at TechCorp"
    },
    {
      quote: "From small meetings to 5000+ person conferences, EventFlow scales with our needs perfectly.",
      author: "Michael Rodriguez",
      role: "VP Events at Global Dynamics"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Events Managed" },
    { number: "50+", label: "Enterprise Clients" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" }
  ];

  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(testimonialInterval);
  }, [testimonials.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <div className="dark min-h-[100dvh] bg-neutral-950 text-neutral-100">
      <main>
        {}
        <section className="relative overflow-hidden">
          {}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-950/70 to-neutral-950" />
            <div className="absolute -left-40 -top-32 h-[48rem] w-[48rem] rounded-full bg-emerald-500/15 blur-3xl animate-pulse" />
            <div className="absolute -right-48 bottom-[-10%] h-[44rem] w-[44rem] rounded-full bg-emerald-300/10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[32rem] w-[32rem] rounded-full bg-blue-500/5 blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.07] mix-blend-soft-light"
              style={{
                backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSBiYXNlRnJlcXVlbmN5PSIwLjkiIG51bU9jdGF2ZXM9IjMiIHJlc3VsdD0ibm9pc2UiLz48ZmVDb2xvck1hdHJpeCBpbj0ibm9pc2UiIHR5cGU9InNhdHVyYXRlIiB2YWx1ZXM9IjAiLz48L2ZpbHRlcj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4xIi8+PC9zdmc+')",
                backgroundSize: "300px 300px",
              }}
            />
          </div>

          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:py-24 md:grid-cols-2 md:items-center lg:py-32">
            <div className="space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300 animate-bounce-subtle">
                <Sparkles className="mr-2 h-4 w-4" />
                Built for modern event teams
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl bg-gradient-to-r from-white via-white to-emerald-300 bg-clip-text text-transparent">
                Effortless orchestration for{' '}
                <span className="text-emerald-400">exceptional events</span>
              </h1>
              <p className="text-lg leading-relaxed text-neutral-300 sm:text-xl max-w-2xl">
                EventFlow unifies planning, guest workflows, vendor operations, and real‑time insights—empowering your team to deliver flawless experiences at any scale.
              </p>
              {!isAuthenticated ? (
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-neutral-900 text-lg px-8 py-6 group">
                    <Link to="/register">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 bg-transparent text-lg px-8 py-6"
                  >
                    <Link to="/login">Login</Link>
                  </Button>
                </div>
              ) : (
                <div className="flex justify-start">
                  <Button
                    asChild
                    size="lg"
                    className="bg-emerald-500 hover:bg-emerald-400 text-neutral-900 text-lg px-8 py-6 group"
                  >
                    <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'}>
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              )}
              <p className="text-sm text-neutral-400 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                No credit card required • Set up in minutes • 14-day free trial
              </p>
            </div>

            {}
            <Card className="border-neutral-800 bg-neutral-900/60 backdrop-blur shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <CardContent className="p-6 sm:p-8">
                <div className="grid gap-6">
                  <Highlight
                    icon={<CalendarCheck className="h-6 w-6" aria-hidden="true" />}
                    title="Timelines in minutes"
                    description="Drag‑and‑drop schedules with automated reminders and conflict prevention."
                    delay="0.1s"
                  />
                  <Highlight
                    icon={<Users className="h-6 w-6" aria-hidden="true" />}
                    title="Guest lists that sync"
                    description="Smart RSVPs, seating, and check‑in with live updates across teams."
                    delay="0.2s"
                  />
                  <Highlight
                    icon={<BadgeDollarSign className="h-6 w-6" aria-hidden="true" />}
                    title="Budgets under control"
                    description="Vendor management, payment milestones, and clear cost controls."
                    delay="0.3s"
                  />
                  <Highlight
                    icon={<BarChart3 className="h-6 w-6" aria-hidden="true" />}
                    title="Insights that matter"
                    description="Live dashboards and post‑event reports to optimize outcomes."
                    delay="0.4s"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {}
        <section className="bg-neutral-950 border-b border-neutral-800">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-emerald-400 sm:text-4xl">{stat.number}</div>
                  <div className="mt-2 text-sm text-neutral-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {}
        <section id="features" className={`border-t border-neutral-800 bg-neutral-950 transition-all duration-1000 ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300 mb-6">
                <Zap className="mr-2 h-4 w-4" />
                Powerful Features
              </div>
              <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">
                Everything you need to run outstanding events
              </h2>
              <p className="mt-4 text-lg text-neutral-300">
                From kickoff to wrap‑up, manage every detail in one streamlined hub.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Feature
                icon={<CalendarCheck className="h-7 w-7" aria-hidden="true" />}
                title="Intuitive scheduling & tracking"
                description="Plan agendas, assign tasks, and monitor progress with visual timelines that update in real-time."
                color="emerald"
              />
              <Feature
                icon={<Users className="h-7 w-7" aria-hidden="true" />}
                title="Guest management & invitations"
                description="Automate invites, RSVPs, and reminders with customizable templates and smart check-in."
                color="blue"
              />
              <Feature
                icon={<BadgeDollarSign className="h-7 w-7" aria-hidden="true" />}
                title="Budget & vendor coordination"
                description="Track expenses, manage vendors, and control approvals with integrated payment processing."
                color="purple"
              />
              <Feature
                icon={<BarChart3 className="h-7 w-7" aria-hidden="true" />}
                title="Real‑time analytics & reporting"
                description="Understand attendance, costs, and engagement with live dashboards and detailed insights."
                color="orange"
              />
              <Feature
                icon={<Shield className="h-7 w-7" aria-hidden="true" />}
                title="Enterprise security"
                description="Bank-level encryption, SSO integration, and compliance with GDPR and SOC 2 standards."
                color="red"
              />
              <Feature
                icon={<Globe className="h-7 w-7" aria-hidden="true" />}
                title="Global scalability"
                description="Multi-language support, timezone handling, and infrastructure that scales worldwide."
                color="green"
              />
            </div>
          </div>
        </section>

        {}
        <section id="why" className={`bg-neutral-950 transition-all duration-1000 ${isVisible.why ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:py-20 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
                <Target className="mr-2 h-4 w-4" />
                Why EventFlow
              </div>
              <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
                Save time, reduce stress, and deliver{' '}
                <span className="text-emerald-400">unforgettable events</span>
              </h2>
              <p className="text-lg text-neutral-300">
                Our unified, user‑friendly platform brings planners, vendors, and guests together—so you can focus on the moments that matter most.
              </p>
              <ul className="grid gap-4 text-base text-neutral-200">
                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-emerald-500/20 p-1">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" aria-hidden="true" />
                  </div>
                  <div>
                    <strong className="text-white">All‑in‑one workflows</strong>
                    <p className="text-sm text-neutral-400 mt-1">From planning to post‑event insights, everything in one platform</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-emerald-500/20 p-1">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" aria-hidden="true" />
                  </div>
                  <div>
                    <strong className="text-white">Built-in collaboration</strong>
                    <p className="text-sm text-neutral-400 mt-1">Real-time teamwork for all stakeholders and vendors</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-emerald-500/20 p-1">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" aria-hidden="true" />
                  </div>
                  <div>
                    <strong className="text-white">Enterprise-ready</strong>
                    <p className="text-sm text-neutral-400 mt-1">Secure, scalable, and ready for events of any size</p>
                  </div>
                </li>
              </ul>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-neutral-900">
                  <Link to="/register">Start Free Trial</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 bg-transparent"
                >
                  <Link to="/contact">Schedule Demo</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative h-80 w-full overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl sm:h-96">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10" />
                <div className="flex items-center justify-center h-full">
                  <div className="grid grid-cols-2 gap-4 p-8">
                    <div className="bg-neutral-800 rounded-lg p-4 text-center">
                      <TrendingUp className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">95%</div>
                      <div className="text-xs text-neutral-400">Success Rate</div>
                    </div>
                    <div className="bg-neutral-800 rounded-lg p-4 text-center">
                      <Clock className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">60%</div>
                      <div className="text-xs text-neutral-400">Time Saved</div>
                    </div>
                    <div className="bg-neutral-800 rounded-lg p-4 text-center">
                      <UserCheck className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">98%</div>
                      <div className="text-xs text-neutral-400">Satisfaction</div>
                    </div>
                    <div className="bg-neutral-800 rounded-lg p-4 text-center">
                      <Globe className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">50+</div>
                      <div className="text-xs text-neutral-400">Countries</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {}
        <section id="testimonials" className={`border-t border-neutral-800 bg-neutral-950 transition-all duration-1000 ${isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300 mb-6">
                <Quote className="mr-2 h-4 w-4" />
                Customer Stories
              </div>
              <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">
                Trusted by event professionals worldwide
              </h2>
            </div>

            <div className="relative">
              <div className="mx-auto max-w-4xl">
                <div className="relative min-h-[200px] flex items-center justify-center">
                  {testimonials.map((testimonial, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-all duration-500 ${
                        index === currentTestimonial 
                          ? 'opacity-100 transform translate-x-0' 
                          : index < currentTestimonial 
                            ? 'opacity-0 transform -translate-x-full' 
                            : 'opacity-0 transform translate-x-full'
                      }`}
                    >
                      <div className="text-center">
                        <div className="flex justify-center mb-6">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <blockquote className="text-xl font-medium text-white sm:text-2xl">
                          "{testimonial.quote}"
                        </blockquote>
                        <div className="mt-6">
                          <div className="font-semibold text-emerald-300">{testimonial.author}</div>
                          <div className="text-sm text-neutral-400">{testimonial.role}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-center mt-8 gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`h-2 w-8 rounded-full transition-all ${
                      index === currentTestimonial ? 'bg-emerald-400' : 'bg-neutral-600 hover:bg-neutral-500'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="mt-16 grid items-center justify-center gap-8 sm:grid-cols-3 lg:grid-cols-5 opacity-60">
              <ClientLogo alt="TechCorp" />
              <ClientLogo alt="BrightWorks" />
              <ClientLogo alt="Global Dynamics" />
              <ClientLogo alt="Innovation Labs" />
              <ClientLogo alt="Future Events" />
            </div>
          </div>
        </section>

        {}
        <section id="cta" className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 relative">
          <div className="absolute inset-0 bg-emerald-500/5" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-20 sm:py-24 lg:grid-cols-[1fr_auto]">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
                Ready to elevate your{' '}
                <span className="text-emerald-400">event operations?</span>
              </h2>
              <p className="mt-4 text-lg text-neutral-300 max-w-2xl">
                Join thousands of event professionals delivering seamless experiences—from intimate gatherings to large‑scale conferences.
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-6 mt-6 text-sm text-neutral-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  14-day free trial
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  No setup fees
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Cancel anytime
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
              <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-neutral-900 text-lg px-8 py-6 group">
                <Link to="/register">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 bg-transparent text-lg px-8 py-6"
              >
                <Link to="/contact">Schedule Demo</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

function Highlight({ icon, title, description, delay = "0s" }) {
  return (
    <div className="flex items-start gap-4 animate-fade-in-up" style={{ animationDelay: delay }}>
      <div className="rounded-md bg-emerald-500/10 p-3 text-emerald-300 ring-1 ring-emerald-500/20">{icon}</div>
      <div>
        <h3 className="font-semibold text-neutral-100 text-lg">{title}</h3>
        <p className="text-sm text-neutral-300 mt-1">{description}</p>
      </div>
    </div>
  );
}

function Feature({ icon, title, description, color = "emerald" }) {
  const colorClasses = {
    emerald: "text-emerald-300 bg-emerald-500/10 ring-emerald-500/20",
    blue: "text-blue-300 bg-blue-500/10 ring-blue-500/20",
    purple: "text-purple-300 bg-purple-500/10 ring-purple-500/20",
    orange: "text-orange-300 bg-orange-500/10 ring-orange-500/20",
    red: "text-red-300 bg-red-500/10 ring-red-500/20",
    green: "text-green-300 bg-green-500/10 ring-green-500/20",
  };

  return (
    <div className="group rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur p-6 shadow-sm transition-all hover:border-neutral-700/80 hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-1">
      <div className="flex items-start gap-4">
        <div className={`rounded-lg p-3 ring-1 transition-all group-hover:scale-110 ${colorClasses[color]}`}>
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-neutral-100 text-lg group-hover:text-white transition-colors">{title}</h3>
          <p className="mt-2 text-sm text-neutral-300 group-hover:text-neutral-200 transition-colors leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

function ClientLogo({ alt }) {
  return (
    <div className="flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity">
      <div className="h-12 w-40 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-lg flex items-center justify-center text-neutral-400 text-sm font-medium border border-neutral-700">
        {alt}
      </div>
    </div>
  );
}

export default LandingPage;
