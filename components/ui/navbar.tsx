"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Monitor, LogOut, Menu, X } from "lucide-react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession, signOut } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"

export function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  const navLinks = session ? [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/monitoring', label: 'Monitoring' },
    { href: '/incidents', label: 'Incidents' },
    ...(session.user.role === 'admin' ? [{ href: '/admin', label: 'Admin' }] : [])
  ] : []

  return (
    <nav className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <div>
          <Link href="/" className="font-medium text-lg text-foreground">
            FireSense
          </Link>
        </div>

        {/* Desktop Navigation */}
        {session && (
          <div className="hidden md:flex ml-6 items-center space-x-4">
            {navLinks.map((link) => (
              <Button 
                key={link.href}
                variant="ghost" 
                asChild
                className={isActive(link.href) ? 'text-amber-500 hover:text-amber-500 hover:bg-amber-500/10' : ''}
              >
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
          </div>
        )}

        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <Button 
            variant="outline" 
            asChild
            className={isActive(session ? '/dashboard' : '/account') ? 'text-amber-500 border-amber-500 hover:text-amber-500 hover:bg-amber-500/10' : ''}
          >
            <Link href={session ? '/dashboard' : '/account'}>
              {session ? (session.user.role === 'admin' ? 'Admin' : 'Operator') : 'Account'}
            </Link>
          </Button>
          {session && (
            <>
              <Button 
                variant="outline" 
                size="icon" 
                className="size-8 hidden md:flex"
                onClick={handleSignOut}
                aria-label="Sign out"
              >
                <LogOut className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8 md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border/40"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Button
                  key={link.href}
                  variant="ghost"
                  asChild
                  className={`w-full justify-start ${isActive(link.href) ? 'text-amber-500 hover:text-amber-500 hover:bg-amber-500/10' : ''}`}
                >
                  <Link href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
                    {link.label}
                  </Link>
                </Button>
              ))}
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => {
                  handleSignOut()
                  setIsMobileMenuOpen(false)
                }}
              >
                <LogOut className="size-4 mr-2" />
                Sign out
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const root = window.document.documentElement;
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', isDark);
      localStorage.removeItem('theme');
    } else {
      root.classList.toggle('dark', theme === 'dark');
      localStorage.setItem('theme', theme);
    }
  }, [theme, mounted]);

  // Listen to system theme changes if in system mode
  useEffect(() => {
    if (!mounted || theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      window.document.documentElement.classList.toggle('dark', e.matches);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme, mounted]);

  const options = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'system', icon: Monitor, label: 'System' },
    { value: 'dark', icon: Moon, label: 'Dark' },
  ] as const;

  if (!mounted) {
    return (
      <div className="flex items-center bg-background/50 border border-border/50 rounded-full px-1.5 py-0.5 gap-1.5">
        {options.map(({ value, icon: Icon, label }) => (
          <button
            key={value}
            aria-label={label}
            className={`size-7 flex items-center justify-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 text-muted-foreground`}
            type="button"
            tabIndex={-1}
            disabled
          >
            <Icon className="size-4" />
          </button>
        ))}
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="flex items-center bg-background/50 border border-border/50 rounded-full px-1.5 py-0.5 gap-1.5"
    >
      {options.map(({ value, icon: Icon, label }) => (
        <motion.button
          key={value}
          aria-label={label}
          className={`size-7 flex items-center justify-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50
            ${theme === value 
              ? 'bg-primary/10 text-primary dark:bg-primary/20' 
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
          onClick={() => setTheme(value)}
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Icon className="size-4" />
        </motion.button>
      ))}
    </motion.div>
  );
} 