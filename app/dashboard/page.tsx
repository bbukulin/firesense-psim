"use server"

export default async function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-6">
        <div className="p-6 bg-card rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Welcome to FireSense</h2>
          <p className="text-muted-foreground">
            This is your central monitoring dashboard. Here you'll see an overview of all sensors, cameras, and active incidents.
          </p>
        </div>
      </div>
    </div>
  )
} 