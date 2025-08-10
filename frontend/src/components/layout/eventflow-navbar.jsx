"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function EventFlowNavbar({
  brand = "EventFlow",
  links = [
    { label: "Features", href: "#features" },
    { label: "Why EventFlow", href: "#why" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Contact", href: "#contact" },
  ],
  loginHref = "/login",
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/70 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="#" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500 text-neutral-900 font-extrabold">
            {"EF"}
          </span>
          <span className="font-semibold tracking-wide">{brand}</span>
          <span className="sr-only">{"Home"}</span>
        </Link>

        <nav aria-label="Primary" className="hidden md:flex items-center gap-6 text-sm text-neutral-300">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-emerald-400">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            className="border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 bg-transparent"
          >
            <Link href={loginHref}>{"Login"}</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
