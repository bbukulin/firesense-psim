"use server"

import { UsersTable } from "./_components/users-table"
import { CamerasTable } from "./_components/cameras-table"

export default async function AdminPage() {
  return (
    <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4 md:py-6 lg:py-8">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 md:mb-6">Admin Panel</h1>
      <div className="grid gap-3 sm:gap-4 md:gap-6">
        <div className="p-3 sm:p-4 md:p-6 bg-card rounded-lg border overflow-hidden">
          <UsersTable />
        </div>
        <div className="p-3 sm:p-4 md:p-6 bg-card rounded-lg border overflow-hidden">
          <CamerasTable />
        </div>
      </div>
    </div>
  )
} 