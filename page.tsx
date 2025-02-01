import IndianTaxCalculator from "./indian-tax-calculator"

export default function Home() {
  return (
    <main className="container mx-auto p-4 min-h-screen bg-gradient-to-b from-blue-100 to-indigo-200 dark:from-gray-900 dark:to-indigo-950 flex items-center justify-center">
      <IndianTaxCalculator />
    </main>
  )
}

