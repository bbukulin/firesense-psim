"use server"

export default async function AdminPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <div className="grid gap-6">
        <div className="p-6 bg-card rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">System Administration</h2>
          <p className="text-muted-foreground">
            This is the administration panel where you can manage users, cameras, and system settings.
          </p>
        </div>
      </div>
    </div>
  )
} 