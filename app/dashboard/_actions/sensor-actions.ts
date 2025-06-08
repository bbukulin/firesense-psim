"use server"

import { db } from "../../../db"
import { sensors, sensorReadings } from "@/db/schema/sensors-schema"
import { eq, desc } from "drizzle-orm"
import { ActionState } from "../../../types"

type SensorWithLatestReading = {
  id: number
  name: string
  type: string
  location: string | null
  value: string
  smoke_detected: boolean | null
  timestamp: Date
}

export async function getLatestSensorReadingsAction(): Promise<
  ActionState<SensorWithLatestReading[]>
> {
  try {
    // Get all active sensors
    const activeSensors = await db
      .select()
      .from(sensors)
      .where(eq(sensors.active, true))

    // For each sensor, get its latest reading
    const sensorsWithReadings = await Promise.all(
      activeSensors.map(async (sensor) => {
        const [latestReading] = await db
          .select()
          .from(sensorReadings)
          .where(eq(sensorReadings.sensor_id, sensor.id))
          .orderBy(desc(sensorReadings.timestamp))
          .limit(1)

        return {
          ...sensor,
          value: latestReading?.value.toString() ?? "0",
          smoke_detected: latestReading?.smoke_detected ?? null,
          timestamp: latestReading?.timestamp ?? new Date()
        }
      })
    )

    return {
      isSuccess: true,
      message: "Successfully fetched latest sensor readings",
      data: sensorsWithReadings
    }
  } catch {
    return {
      isSuccess: false,
      message: "Failed to fetch sensor readings"
    }
  }
}

export async function getTemperatureReadingsAction() {
  try {
    const readings = await db
      .select({
        timestamp: sensorReadings.timestamp,
        value: sensorReadings.value,
        sensorId: sensorReadings.sensor_id,
        sensorName: sensors.name,
        location: sensors.location,
      })
      .from(sensorReadings)
      .innerJoin(sensors, eq(sensorReadings.sensor_id, sensors.id))
      .where(eq(sensors.type, 'temperature'))
      .orderBy(desc(sensorReadings.timestamp))

    // Format the data for the chart
    const formattedData = readings.map(reading => ({
      time: new Date(reading.timestamp).toLocaleTimeString(),
      value: Number(reading.value),
      sensorName: reading.sensorName,
      location: reading.location,
    }))

    return {
      isSuccess: true,
      data: formattedData,
    }
  } catch {
    return {
      isSuccess: false,
      message: 'Failed to fetch temperature readings',
    }
  }
}

export async function getSmokeReadingsAction() {
  try {
    const readings = await db
      .select({
        timestamp: sensorReadings.timestamp,
        value: sensorReadings.value,
        smoke_detected: sensorReadings.smoke_detected,
        sensorId: sensorReadings.sensor_id,
        sensorName: sensors.name,
        location: sensors.location,
      })
      .from(sensorReadings)
      .innerJoin(sensors, eq(sensorReadings.sensor_id, sensors.id))
      .where(eq(sensors.type, 'smoke'))
      .orderBy(desc(sensorReadings.timestamp))

    // Format the data for the chart
    const formattedData = readings.map(reading => ({
      time: new Date(reading.timestamp).toLocaleTimeString(),
      value: reading.smoke_detected ? 1 : 0,
      smoke_detected: reading.smoke_detected,
      sensorName: reading.sensorName,
      location: reading.location,
    }))

    return {
      isSuccess: true,
      data: formattedData,
    }
  } catch {
    return {
      isSuccess: false,
      message: 'Failed to fetch smoke readings',
    }
  }
}

export async function getGasReadingsAction() {
  try {
    const readings = await db
      .select({
        timestamp: sensorReadings.timestamp,
        value: sensorReadings.value,
        sensorId: sensorReadings.sensor_id,
        sensorName: sensors.name,
        location: sensors.location,
      })
      .from(sensorReadings)
      .innerJoin(sensors, eq(sensorReadings.sensor_id, sensors.id))
      .where(eq(sensors.type, 'gas'))
      .orderBy(desc(sensorReadings.timestamp))

    // Format the data for the chart
    const formattedData = readings.map(reading => ({
      time: new Date(reading.timestamp).toLocaleTimeString(),
      value: Number(reading.value),
      sensorName: reading.sensorName,
      location: reading.location,
    }))

    return {
      isSuccess: true,
      data: formattedData,
    }
  } catch {
    return {
      isSuccess: false,
      message: 'Failed to fetch gas readings',
    }
  }
} 