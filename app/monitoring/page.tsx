"use server"

export default async function MonitoringPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Monitoring</h1>
      <div className="grid gap-6">
        <div className="p-6 bg-card rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Camera Feeds</h2>
          <p className="text-muted-foreground">
            This page will display live camera feeds from your security cameras. You'll be able to monitor multiple locations simultaneously.
          </p>
        </div>
      </div>
    </div>
  )
} 