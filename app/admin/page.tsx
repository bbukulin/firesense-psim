"use server"

import { UsersTable } from "./_components/users-table"

export default async function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Admin Panel</h1>
      <div className="grid gap-4 sm:gap-6">
        <div className="p-4 sm:p-6 bg-card rounded-lg border">
          <UsersTable />
        </div>
      </div>
    </div>
  )
} 