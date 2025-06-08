"use server"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import TemperatureChart from "./_components/temperature-chart"
import SmokeChart from "./_components/smoke-chart"
import GasChart from "./_components/gas-chart"
import IncidentLogsTable from "./_components/incident-logs-table"
import SensorStatus from "./_components/sensor-status"

export default async function DashboardPage() {
  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Dashboard</h1>
      <p className="text-muted-foreground text-base mb-6 -mt-4">Live sensor status, camera and operator overview, and recent incidents.</p>
      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Sensor Status Overview (now includes Cameras card) */}
        <SensorStatus />

        {/* Sensor Data Visualizations */}
        <div className="mt-1 flex flex-col gap-4">
          <Card>
            <CardContent>
              <TemperatureChart />
            </CardContent>
          </Card>
          <div className="flex flex-col md:flex-row gap-4">
            <Card className="flex-1">
              <CardContent>
                <SmokeChart />
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardContent>
                <GasChart />
              </CardContent>
            </Card>
          </div>
          {/* Incident Logs Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Incident Logs</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto p-0 sm:p-4">
              <IncidentLogsTable />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 