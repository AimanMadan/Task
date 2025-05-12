"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

type Machine = {
  id: string
  protein: number
  electricity: number
  name: string
}

type FactoryChartProps = {
  machineRuns: Record<string, number>
  machines: Machine[]
  maxElectricity: number
}

export default function FactoryChart({ machineRuns, machines, maxElectricity }: FactoryChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Prepare data for the chart
    const machineData = machines
      .map((machine) => {
        const runs = machineRuns[machine.id] || 0
        return {
          id: machine.id,
          name: machine.name,
          protein: machine.protein * runs,
          electricity: machine.electricity * runs,
        }
      })
      .filter((m) => m.protein > 0 || m.electricity > 0) // Only include machines that are running

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: machineData.map((m) => m.name),
        datasets: [
          {
            label: "Protein (g)",
            data: machineData.map((m) => m.protein),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            yAxisID: "y",
          },
          {
            label: "Electricity (kW)",
            data: machineData.map((m) => m.electricity),
            backgroundColor: "rgba(255, 99, 132, 0.6)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
            yAxisID: "y1",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            type: "linear",
            display: true,
            position: "left",
            title: {
              display: true,
              text: "Protein (g)",
            },
            beginAtZero: true,
          },
          y1: {
            type: "linear",
            display: true,
            position: "right",
            title: {
              display: true,
              text: "Electricity (kW)",
            },
            beginAtZero: true,
            grid: {
              drawOnChartArea: false,
            },
            max: Math.max(maxElectricity, ...machineData.map((m) => m.electricity)) + 10,
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              afterTitle: (context) => {
                const dataIndex = context[0].dataIndex
                const machine = machineData[dataIndex]
                return `Runs: ${machineRuns[machine.id]}`
              },
            },
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [machineRuns, machines, maxElectricity])

  return <canvas ref={chartRef} />
}
