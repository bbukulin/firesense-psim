"use server"

export default async function MonitoringPage() {
  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Monitoring</h1>
      <div className="grid gap-4 sm:gap-6">
        <div className="p-4 sm:p-6 bg-card rounded-lg border">
          <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Camera Feeds</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            This page will display live camera feeds from your security cameras. You'll be able to monitor multiple locations simultaneously.
          </p>
        </div>
      </div>
    </div>
  )
} 