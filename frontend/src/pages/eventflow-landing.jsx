"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import EventFlowNavbar from "@/components/eventflow-navbar"
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
} from "lucide-react"

export default function EventFlowLanding() {
  return (
    <div className="dark min-h-[100dvh] bg-neutral-950 text-neutral-100">
      <EventFlowNavbar />

      <main>
        {/* Hero with premium background */}
        <section className="relative overflow-hidden">
          {/* Premium gradient mesh + photo + grain */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <Image
              src="/backgrounds/eventflow-premium-hero.png"
              alt="Premium abstract background for EventFlow"
              fill
              priority
              className="object-cover opacity-[0.22]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-950/70 to-neutral-950" />
            <div className="absolute -left-40 -top-32 h-[48rem] w-[48rem] rounded-full bg-emerald-500/15 blur-3xl" />
            <div className="absolute -right-48 bottom-[-10%] h-[44rem] w-[44rem] rounded-full bg-emerald-300/10 blur-3xl" />
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.07] mix-blend-soft-light"
              style={{
                backgroundImage: "url('/backgrounds/noise.png')",
                backgroundSize: "300px 300px",
              }}
            />
          </div>

          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:py-24 md:grid-cols-2 md:items-center lg:py-28">
            <div className="space-y-7">
              <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                {"Built for modern event teams"}
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                {"Effortless orchestration for exceptional events."}
              </h1>
              <p className="text-base leading-relaxed text-neutral-300 sm:text-lg">
                {
                  "EventFlow unifies planning, guest workflows, vendor operations, and real‑time insights—empowering your team to deliver flawless experiences at any scale."
                }
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-neutral-900">
                  <Link href="#cta">{"Get Started"}</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 bg-transparent"
                >
                  <Link href="#cta">{"Book a Demo"}</Link>
                </Button>
              </div>
              <p className="text-xs text-neutral-400">{"No credit card required. Set up in minutes."}</p>
            </div>

            {/* Quick highlights card */}
            <Card className="border-neutral-800 bg-neutral-900/60 backdrop-blur">
              <CardContent className="p-6 sm:p-8">
                <div className="grid gap-6">
                  <Highlight
                    icon={<CalendarCheck className="h-6 w-6" aria-hidden="true" />}
                    title="Timelines in minutes"
                    description="Drag‑and‑drop schedules with automated reminders and conflict prevention."
                  />
                  <Highlight
                    icon={<Users className="h-6 w-6" aria-hidden="true" />}
                    title="Guest lists that sync"
                    description="Smart RSVPs, seating, and check‑in with live updates across teams."
                  />
                  <Highlight
                    icon={<BadgeDollarSign className="h-6 w-6" aria-hidden="true" />}
                    title="Budgets under control"
                    description="Vendor management, payment milestones, and clear cost controls."
                  />
                  <Highlight
                    icon={<BarChart3 className="h-6 w-6" aria-hidden="true" />}
                    title="Insights that matter"
                    description="Live dashboards and post‑event reports to optimize outcomes."
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-t border-neutral-800 bg-neutral-950">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold sm:text-3xl">{"Everything you need to run outstanding events"}</h2>
              <p className="mt-3 text-neutral-300">
                {"From kickoff to wrap‑up, manage every detail in one streamlined hub."}
              </p>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Feature
                icon={<CalendarCheck className="h-6 w-6" aria-hidden="true" />}
                title="Intuitive scheduling & tracking"
                description="Plan agendas, assign tasks, and monitor progress with visual timelines."
              />
              <Feature
                icon={<Users className="h-6 w-6" aria-hidden="true" />}
                title="Guest management & invitations"
                description="Automate invites, RSVPs, and reminders with customizable templates."
              />
              <Feature
                icon={<BadgeDollarSign className="h-6 w-6" aria-hidden="true" />}
                title="Budget & vendor coordination"
                description="Track expenses, manage vendors, and control approvals in one place."
              />
              <Feature
                icon={<BarChart3 className="h-6 w-6" aria-hidden="true" />}
                title="Real‑time analytics & reporting"
                description="Understand attendance, costs, and engagement with live dashboards."
              />
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section id="why" className="bg-neutral-950">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:py-20 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="inline-block rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300">
                {"Why EventFlow"}
              </div>
              <h2 className="text-2xl font-bold sm:text-3xl">
                {"Save time, reduce stress, and deliver unforgettable events."}
              </h2>
              <p className="text-neutral-300">
                {
                  "Our unified, user‑friendly platform brings planners, vendors, and guests together—so you can focus on the moments that matter."
                }
              </p>
              <ul className="grid gap-3 text-sm text-neutral-200">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-400" aria-hidden="true" />
                  {"All‑in‑one workflows from planning to post‑event insights"}
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-400" aria-hidden="true" />
                  {"Collaboration built‑in for teams and stakeholders"}
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-400" aria-hidden="true" />
                  {"Secure, scalable, and ready for events of any size"}
                </li>
              </ul>
            </div>
            <div className="relative h-64 w-full overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 shadow-sm sm:h-80">
              <Image
                src="/event-analytics-dashboard-dark-mode.png"
                alt="EventFlow analytics dashboard preview"
                fill
                className="object-cover opacity-80"
              />
            </div>
          </div>
        </section>

        {/* Testimonials / Trust */}
        <section id="testimonials" className="border-t border-neutral-800 bg-neutral-950">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <Quote className="mx-auto h-10 w-10 text-emerald-400" aria-hidden="true" />
              <p className="mt-4 text-xl font-medium">
                {
                  "“EventFlow has transformed our operations—our team executes faster and our clients notice the difference.”"
                }
              </p>
              <p className="mt-2 text-sm text-neutral-400">{"— Alex Nguyen, Director of Events at BrightWorks"}</p>
            </div>

            <div className="mt-10 grid items-center justify-center gap-8 sm:grid-cols-3 lg:grid-cols-5">
              <ClientLogo alt="Client logo 1" />
              <ClientLogo alt="Client logo 2" />
              <ClientLogo alt="Client logo 3" />
              <ClientLogo alt="Client logo 4" />
              <ClientLogo alt="Client logo 5" />
            </div>
          </div>
        </section>

        {/* Secondary CTA */}
        <section id="cta" className="bg-neutral-950">
          <div className="mx-auto grid max-w-7xl items-center gap-6 px-4 py-16 sm:py-20 lg:grid-cols-[1fr_auto]">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">{"Ready to elevate your event operations?"}</h2>
              <p className="mt-2 text-neutral-300">
                {"Join teams delivering seamless experiences—from intimate gatherings to large‑scale conferences."}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-neutral-900">
                <Link href="#">{"Sign Up Now"}</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 bg-transparent"
              >
                <Link href="#features">{"Learn More"}</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="border-t border-neutral-800 bg-neutral-950">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500 text-neutral-900 font-extrabold">
                {"EF"}
              </span>
              <span className="font-semibold tracking-wide">{"EventFlow"}</span>
            </div>
            <p className="text-sm text-neutral-400">
              {"Professional, approachable, and built for reliability and innovation."}
            </p>
          </div>
          <nav aria-label="Footer" className="grid gap-2 text-sm">
            <span className="font-semibold text-neutral-200">{"Quick Links"}</span>
            <Link href="#" className="text-neutral-400 hover:text-emerald-300">
              {"About"}
            </Link>
            <Link href="#features" className="text-neutral-400 hover:text-emerald-300">
              {"Features"}
            </Link>
            <Link href="#contact" className="text-neutral-400 hover:text-emerald-300">
              {"Contact"}
            </Link>
          </nav>
          <div className="space-y-3">
            <span className="font-semibold text-neutral-200">{"Follow Us"}</span>
            <div className="flex items-center gap-3">
              <Link
                aria-label="Twitter"
                href="#"
                className="rounded-md p-2 text-neutral-400 hover:bg-neutral-900 hover:text-emerald-300"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                aria-label="Facebook"
                href="#"
                className="rounded-md p-2 text-neutral-400 hover:bg-neutral-900 hover:text-emerald-300"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                aria-label="LinkedIn"
                href="#"
                className="rounded-md p-2 text-neutral-400 hover:bg-neutral-900 hover:text-emerald-300"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-neutral-800">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-neutral-500 sm:flex-row">
            <p>
              {"© "} {new Date().getFullYear()} {" EventFlow. All rights reserved."}
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="hover:text-emerald-300">
                {"Privacy"}
              </Link>
              <Link href="#" className="hover:text-emerald-300">
                {"Terms"}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Highlight({ icon, title, description }) {
  return (
    <div className="flex items-start gap-4">
      <div className="rounded-md bg-emerald-500/10 p-2 text-emerald-300">{icon}</div>
      <div>
        <h3 className="font-semibold text-neutral-100">{title}</h3>
        <p className="text-sm text-neutral-300">{description}</p>
      </div>
    </div>
  )
}

function Feature({ icon, title, description }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 shadow-sm transition-colors hover:border-neutral-700/80">
      <div className="flex items-start gap-4">
        <div className="rounded-md bg-emerald-500/10 p-2 text-emerald-300">{icon}</div>
        <div>
          <h3 className="font-semibold text-neutral-100">{title}</h3>
          <p className="mt-1 text-sm text-neutral-300">{description}</p>
        </div>
      </div>
    </div>
  )
}

function ClientLogo({ alt }) {
  return (
    <div className="flex items-center justify-center">
      <Image src="/generic-monochrome-logo.png" alt={alt} width={140} height={40} className="h-8 w-auto opacity-70" />
    </div>
  )
}
