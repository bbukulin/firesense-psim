"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Monitor } from "lucide-react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"

export function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <div>
          <Link href="/" className="font-medium text-lg text-foreground">
            FireSense
          </Link>
        </div>

        {session && (
          <div className="ml-6 flex items-center space-x-4">
            <Button 
              variant="ghost" 
              asChild
              className={isActive('/dashboard') ? 'text-amber-500 hover:text-amber-500 hover:bg-amber-500/10' : ''}
            >
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button 
              variant="ghost" 
              asChild
              className={isActive('/monitoring') ? 'text-amber-500 hover:text-amber-500 hover:bg-amber-500/10' : ''}
            >
              <Link href="/monitoring">Monitoring</Link>
            </Button>
            <Button 
              variant="ghost" 
              asChild
              className={isActive('/incidents') ? 'text-amber-500 hover:text-amber-500 hover:bg-amber-500/10' : ''}
            >
              <Link href="/incidents">Incidents</Link>
            </Button>
            {session.user.role === 'admin' && (
              <Button 
                variant="ghost" 
                asChild
                className={isActive('/admin') ? 'text-amber-500 hover:text-amber-500 hover:bg-amber-500/10' : ''}
              >
                <Link href="/admin">Admin</Link>
              </Button>
            )}
          </div>
        )}

        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          {session && (
            <Button 
              variant="outline" 
              asChild
              className={isActive('/account') ? 'text-amber-500 border-amber-500 hover:text-amber-500 hover:bg-amber-500/10' : ''}
            >
              <Link href="/account">
                {session.user.role === 'admin' ? 'Admin' : 'Operator'}
              </Link>
            </Button>
          )}
        </div>
      </div>
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