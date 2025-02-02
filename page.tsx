import Header from "./app/Header"
import IndianTaxCalculator from "./indian-tax-calculator"


export default function Home() {
  return (
    <main className="container h-full mx-auto p-4 min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center">
      <Header />
      <IndianTaxCalculator />
    </main>
  )
}



