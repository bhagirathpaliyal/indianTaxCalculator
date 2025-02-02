"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TaxSlab {
  min: number
  max: number | null
  rate: number
}

const newTaxSlabs: TaxSlab[] = [
  { min: 0, max: 400000, rate: 0 },
  { min: 400000, max: 800000, rate: 0.05 },
  { min: 800000, max: 1200000, rate: 0.1 },
  { min: 1200000, max: 1600000, rate: 0.15 },
  { min: 1600000, max: 2000000, rate: 0.2 },
  { min: 2000000, max: 2400000, rate: 0.25 },
  { min: 2400000, max: null, rate: 0.3 },
]

const oldTaxSlabs: TaxSlab[] = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250000, max: 500000, rate: 0.05 },
  { min: 500000, max: 1000000, rate: 0.2 },
  { min: 1000000, max: null, rate: 0.3 },
]

interface TaxBreakdown {
  slab: string
  tax: number
}

interface TaxCalculation {
  breakdown: TaxBreakdown[]
  totalTax: number
}

export default function IndianTaxCalculator() {
  const [income, setIncome] = useState<string>("")
  const [newTaxCalc, setNewTaxCalc] = useState<TaxCalculation>({ breakdown: [], totalTax: 0 })
  const [oldTaxCalc, setOldTaxCalc] = useState<TaxCalculation>({ breakdown: [], totalTax: 0 })

  const calculateTax = (income: number, slabs: TaxSlab[], minTaxableIncome: number): TaxCalculation => {
    if (income <= minTaxableIncome) {
      return { breakdown: [], totalTax: 0 }
    }

    let remainingIncome = income
    let totalTax = 0
    const breakdown: TaxBreakdown[] = []

    for (const slab of slabs) {
      if (remainingIncome <= 0) break

      const taxableAmount = slab.max ? Math.min(remainingIncome, slab.max - slab.min) : remainingIncome
      const taxForSlab = taxableAmount * slab.rate

      if (taxForSlab > 0) {
        breakdown.push({
          slab: `₹${(slab.min / 100000).toFixed(2)} to ${
            slab.max ? `₹${(slab.max / 100000).toFixed(2)}` : "above"
          } lacs (${slab.rate * 100}%)`,
          tax: taxForSlab,
        })
      }

      totalTax += taxForSlab
      remainingIncome -= taxableAmount
    }

    return { breakdown, totalTax }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const incomeValue = Number.parseFloat(income)
    if (!isNaN(incomeValue) && incomeValue >= 0) {
      setNewTaxCalc(calculateTax(incomeValue, newTaxSlabs, 1200000))
      setOldTaxCalc(calculateTax(incomeValue, oldTaxSlabs, 700000))
    } else {
      alert("Please enter a valid income amount")
    }
  }

  const renderTaxBreakdown = (taxCalc: TaxCalculation, title: string) => (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-inner">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">{title}</h3>
      {taxCalc.totalTax > 0 ? (
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200 dark:border-gray-700">
              <th className="text-left py-2 text-gray-600 dark:text-gray-400">Income Slab</th>
              <th className="text-right py-2 text-gray-600 dark:text-gray-400">Tax Amount</th>
            </tr>
          </thead>
          <tbody>
            {taxCalc.breakdown.map((item, index) => (
              <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-2 text-gray-800 dark:text-gray-200">{item.slab}</td>
                <td className="text-right py-2 text-gray-800 dark:text-gray-200">₹{item.tax.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-bold text-lg">
              <td className="py-2 text-gray-800 dark:text-white">Total Tax</td>
              <td className="text-right py-2 text-gray-800 dark:text-gray-200">₹{taxCalc.totalTax.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      ) : (
        <p className="text-lg text-gray-800 dark:text-gray-200">No tax applicable under this regime.</p>
      )}
    </div>
  )

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-xl mt-[80px]">
      
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="income" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Annual Income (in ₹)
            </label>
            <Input
              type="number"
              id="income"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              placeholder="Enter your annual income"
              className="text-lg p-3 border-2 border-gray-300 focus:border-gray-500 focus:ring-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Calculate Tax
          </Button>
        </form>

        {income && (
          <Alert className="mt-6 bg-green-100 border-green-400 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-100">
            <InfoIcon className="h-5 w-5" />
            <AlertTitle>Tax Information</AlertTitle>
            <AlertDescription>
              Your annual income is ₹{Number.parseFloat(income).toLocaleString()}.
              {Number.parseFloat(income) <= 1200000 && (
                <p>There is no tax applicable under the new regime for annual income up to ₹12,00,000.</p>
              )}
              {Number.parseFloat(income) <= 700000 && (
                <p>There is no tax applicable under the old regime for annual income up to ₹7,00,000.</p>
              )}
            </AlertDescription>
          </Alert>
        )}

        {(newTaxCalc.totalTax > 0 || oldTaxCalc.totalTax > 0) && (
          <Tabs defaultValue="new" className="mt-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="new">New Tax Regime</TabsTrigger>
              <TabsTrigger value="old">Old Tax Regime</TabsTrigger>
            </TabsList>
            <TabsContent value="new">{renderTaxBreakdown(newTaxCalc, "New Tax Regime Breakdown")}</TabsContent>
            <TabsContent value="old">{renderTaxBreakdown(oldTaxCalc, "Old Tax Regime Breakdown")}</TabsContent>
          </Tabs>
        )}

        {(newTaxCalc.totalTax > 0 || oldTaxCalc.totalTax > 0) && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-inner">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Tax Regime Comparison</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">New Regime Tax:</p>
                <p className="text-xl font-bold text-gray-800 dark:text-gray-200">₹{newTaxCalc.totalTax.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Old Regime Tax:</p>
                <p className="text-xl font-bold text-gray-800 dark:text-gray-200">₹{oldTaxCalc.totalTax.toFixed(2)}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Tax Savings with {newTaxCalc.totalTax < oldTaxCalc.totalTax ? "New" : "Old"} Regime:
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                ₹{Math.abs(newTaxCalc.totalTax - oldTaxCalc.totalTax).toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

