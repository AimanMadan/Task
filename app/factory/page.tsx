"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Factory, CheckCircle, XCircle, BarChart } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import FactoryChart from "@/components/factory-chart"
import { useToast } from "@/components/ui/use-toast"
import { useSupabase } from "@/lib/supabase-provider"

// Machine data
const machines = [
  { id: "A", protein: 10, electricity: 2, name: "Machine A" },
  { id: "B", protein: 20, electricity: 5, name: "Machine B" },
  { id: "C", protein: 35, electricity: 10, name: "Machine C" },
  { id: "D", protein: 50, electricity: 15, name: "Machine D" },
  { id: "E", protein: 100, electricity: 40, name: "Machine E" },
]

const MAX_ELECTRICITY = 50

export default function FactoryPage() {
  const { toast } = useToast()
  const { user } = useSupabase()
  const [machineRuns, setMachineRuns] = useState<Record<string, number>>({
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
  })
  const [result, setResult] = useState<{
    valid: boolean
    protein: number
    electricity: number
  } | null>(null)
  const [showChart, setShowChart] = useState(false)

  const handleInputChange = (machineId: string, value: string) => {
    const numValue = Number.parseInt(value) || 0
    setMachineRuns((prev) => ({
      ...prev,
      [machineId]: Math.max(0, numValue), // Ensure non-negative values
    }))
  }

  const calculateResults = () => {
    let totalProtein = 0
    let totalElectricity = 0

    machines.forEach((machine) => {
      const runs = machineRuns[machine.id] || 0
      totalProtein += machine.protein * runs
      totalElectricity += machine.electricity * runs
    })

    const valid = totalElectricity <= MAX_ELECTRICITY

    setResult({
      valid,
      protein: totalProtein,
      electricity: totalElectricity,
    })

    setShowChart(true)

    if (valid && totalProtein > 0) {
      toast({
        title: "Calculation successful!",
        description: `You produced ${totalProtein} grams of protein using ${totalElectricity} kW of electricity.`,
      })
    }
  }

  const resetForm = () => {
    setMachineRuns({
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      E: 0,
    })
    setResult(null)
    setShowChart(false)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-primary/10 p-3 rounded-full mr-4">
            <Factory className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Protein Factory Simulator</h1>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Optimize Your Protein Production</CardTitle>
              <CardDescription>
                Maximize protein output while staying within the 50 kW electricity limit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 font-medium text-sm">
                  <div>Machine</div>
                  <div>Protein/Hour</div>
                  <div>Electricity/Hour</div>
                </div>
                {machines.map((machine) => (
                  <div key={machine.id} className="grid grid-cols-3 gap-4 items-center">
                    <div>{machine.name}</div>
                    <div>{machine.protein}g</div>
                    <div>{machine.electricity}kW</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Factory Control Panel</CardTitle>
              <CardDescription>Enter how many times each machine runs per hour</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                {machines.map((machine) => (
                  <div key={machine.id} className="grid grid-cols-2 gap-4">
                    <Label htmlFor={`machine-${machine.id}`} className="self-center">
                      {machine.name}:
                    </Label>
                    <Input
                      id={`machine-${machine.id}`}
                      type="number"
                      min="0"
                      value={machineRuns[machine.id]}
                      onChange={(e) => handleInputChange(machine.id, e.target.value)}
                      className="w-full"
                    />
                  </div>
                ))}
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetForm}>
                Reset
              </Button>
              <Button onClick={calculateResults}>Calculate</Button>
            </CardFooter>
          </Card>
        </div>

        {result && (
          <div className="mt-8 space-y-6">
            <Alert variant={result.valid ? "default" : "destructive"}>
              {result.valid ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <AlertTitle>
                {result.valid
                  ? `Valid! You produced ${result.protein} grams of protein!`
                  : "Invalid! Your electricity consumption is too high!"}
              </AlertTitle>
              <AlertDescription>
                Electricity consumption: {result.electricity} kW / {MAX_ELECTRICITY} kW
                {!result.valid && ` (${result.electricity - MAX_ELECTRICITY} kW over the limit)`}
              </AlertDescription>
            </Alert>

            {showChart && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="h-5 w-5 mr-2" />
                    Energy Usage vs. Protein Output
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <FactoryChart machineRuns={machineRuns} machines={machines} maxElectricity={MAX_ELECTRICITY} />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
