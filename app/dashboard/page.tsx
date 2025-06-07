"use server"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import TemperatureChart from "./_components/temperature-chart"
import SmokeChart from "./_components/smoke-chart"
import GasChart from "./_components/gas-chart"
import IncidentLogsTable from "./_components/incident-logs-table"

export default async function DashboardPage() {
  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Dashboard</h1>
      <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Left 3/4: Alerts + Sensors + Visualizations */}
        <div className="flex flex-col gap-4 lg:col-span-3">
          {/* Active Alerts Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                No active alerts at this time
              </div>
            </CardContent>
          </Card>

          {/* Sensor Status Overview */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Temperature Sensors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Server Room</span>
                    <span className="font-medium">72°C</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Main Floor</span>
                    <span className="font-medium">24°C</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Smoke Detectors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Server Room</span>
                    <span className="font-medium text-green-500">Normal</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Main Floor</span>
                    <span className="font-medium text-green-500">Normal</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gas Sensors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Server Room</span>
                    <span className="font-medium">350 ppm</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Main Floor</span>
                    <span className="font-medium">280 ppm</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sensor Data Visualizations */}
          <div className="mt-1 flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Temperature Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <TemperatureChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Smoke Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <SmokeChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Gas Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <GasChart />
              </CardContent>
            </Card>
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

        {/* Right 1/4: Featured Camera Feed container */}
        <div className="flex flex-col lg:col-span-1 mt-4 lg:mt-0">
          <Card className="flex flex-col gap-4 h-full">
            <CardHeader>
              <CardTitle>Featured Camera Feed</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Card className="flex-1">
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">Server Room Camera</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="flex-1">
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">Main Entrance Camera</span>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 