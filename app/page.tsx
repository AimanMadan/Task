import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Dumbbell, Brain, Factory } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="py-12 md:py-24 lg:py-32 flex flex-col items-center text-center">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Bodybuilding Advice & Protein Factory Simulator
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Get expert bodybuilding advice and optimize your protein production with our advanced simulator.
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link href="/advice">Get Advice</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/factory">Optimize Factory</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="bg-primary/10 p-4 rounded-full">
                <Dumbbell className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Bodybuilding Advice</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Get personalized bodybuilding advice powered by GPT-4o-mini.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="bg-primary/10 p-4 rounded-full">
                <Factory className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Protein Factory</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Optimize your protein powder production with our interactive simulator.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="bg-primary/10 p-4 rounded-full">
                <Brain className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Smart Optimization</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Use our advanced algorithms to maximize protein output while minimizing energy consumption.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
