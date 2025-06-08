'use client'

import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-b from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-neutral-900 dark:to-zinc-900">
      <svg
        aria-hidden="true"
        className="hidden dark:block absolute inset-0 -z-10 size-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
      >
        <defs>
          <pattern
            x="50%"
            y={-1}
            id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
            width={200}
            height={200}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <svg x="50%" y={-1} className="overflow-visible fill-gray-800/20">
          <path
            d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
            strokeWidth={0}
          />
        </svg>
        <rect fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)" width="100%" height="100%" strokeWidth={0} />
      </svg>
      <div
        aria-hidden="true"
        className="absolute top-10 left-[calc(50%-4rem)] -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:top-[calc(50%-30rem)] lg:left-48 xl:left-[calc(50%-24rem)]"
      >
        {/* Removed orange/amber gradient overlay */}
      </div>
      <div className="mx-auto max-w-7xl px-6 pt-6 pb-12 sm:pb-20 lg:flex lg:px-8 lg:pt-16 lg:pb-24">
        <div className="max-w-xl shrink-0 pl-0 lg:mx-0 lg:pt-8">
          <motion.div 
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="inline-flex space-x-6">
              <span className="inline-flex items-center space-x-2 text-xs font-medium text-gray-500 dark:text-gray-300">
                <span>Just shipped v1.0</span>
              </span>
            </p>
          </motion.div>
          <motion.h1 
            className="mt-8 text-3xl font-semibold tracking-tight text-pretty text-gray-900 dark:text-white sm:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Proactive Fire Surveillance <br/> & Instant Alerts.
          </motion.h1>
          <motion.p 
            className="mt-6 text-base font-normal text-pretty text-gray-700 dark:text-gray-400 sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            FireSense is a modern PSIM platform built for warehouse safety and surveillance. It integrates all your cameras, alarms, and sensors into one secure dashboard. 
          </motion.p>
          <motion.div 
            className="mt-8 flex items-center gap-x-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Button
              asChild
              variant="default"
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold shadow-lg hover:shadow-xl transition-discrete transition-colors duration-300 cursor-pointer border border-amber-400 dark:border-none"
            >
              <Link href="/account">
                Get Early Access
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
        <motion.div 
          className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:mt-0 lg:mr-0 lg:ml-10 lg:max-w-none lg:flex-none xl:ml-32"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <Image
              alt="App screenshot light"
              src="/hero-light.png"
              width={2432}
              height={1442}
              className="block dark:hidden w-[76rem] rounded-md bg-white/70 ring-1 shadow-2xl ring-black/10"
              priority
            />
            <Image
              alt="App screenshot dark"
              src="/hero-dark.png"
              width={2432}
              height={1442}
              className="hidden dark:block w-[76rem] rounded-md bg-white/5 ring-1 shadow-2xl ring-white/10"
              priority
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
