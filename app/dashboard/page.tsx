"use server"

export default async function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Dashboard</h1>
      <div className="grid gap-4 sm:gap-6">
        <div className="p-4 sm:p-6 bg-card rounded-lg border">
          <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Welcome to FireSense</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            This is your central monitoring dashboard. Here you'll see an overview of all sensors, cameras, and active incidents.
          </p>
        </div>
      </div>
    </div>
  )
} 