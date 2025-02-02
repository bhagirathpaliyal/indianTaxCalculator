"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface TaxSlab {
  min: number;
  max: number | null;
  rate: number;
}

const taxSlabs: TaxSlab[] = [
  { min: 0, max: 400000, rate: 0 },
  { min: 400000, max: 800000, rate: 0.05 },
  { min: 800000, max: 1200000, rate: 0.1 },
  { min: 1200000, max: 1600000, rate: 0.15 },
  { min: 1600000, max: 2000000, rate: 0.2 },
  { min: 2000000, max: 2400000, rate: 0.25 },
  { min: 2400000, max: null, rate: 0.3 },
];

export default function IndianTaxCalculator() {
  const [income, setIncome] = useState<string>("");
  const [taxBreakdown, setTaxBreakdown] = useState<
    { slab: string; tax: number }[]
  >([]);
  const [totalTax, setTotalTax] = useState<number>(0);

  const calculateTax = (income: number) => {
    if (income <= 1200000) {
      setTaxBreakdown([]);
      setTotalTax(0);
      return;
    }

    let remainingIncome = income;
    let totalTax = 0;
    const breakdown: { slab: string; tax: number }[] = [];

    for (const slab of taxSlabs) {
      if (remainingIncome <= 0) break;

      const taxableAmount = slab.max
        ? Math.min(remainingIncome, slab.max - slab.min)
        : remainingIncome;
      const taxForSlab = taxableAmount * slab.rate;

      if (taxForSlab > 0) {
        breakdown.push({
          slab: `₹${(slab.min / 100000).toFixed(2)} to ${
            slab.max ? `₹${(slab.max / 100000).toFixed(2)}` : "above"
          } lacs (${slab.rate * 100}%)`,
          tax: taxForSlab,
        });
      }

      totalTax += taxForSlab;
      remainingIncome -= taxableAmount;
    }

    setTaxBreakdown(breakdown);
    setTotalTax(totalTax);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const incomeValue = Number.parseFloat(income);
    if (!isNaN(incomeValue) && incomeValue >= 0) {
      calculateTax(incomeValue);
    } else {
      alert("Please enter a valid income amount");
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 shadow-xl mt-[80px]">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-lg">
        <CardTitle className="text-2xl font-bold text-center">
          Calculate your tax here for 2025-26
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="income"
              className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Annual Income (in ₹)
            </label>
            <Input
              type="number"
              id="income"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              placeholder="Enter your annual income"
              className="text-lg p-3 border-2 border-blue-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Calculate Tax
          </Button>
        </form>

        {income && Number.parseFloat(income) <= 1200000 && (
          <Alert className="mt-6 bg-green-100 border-green-400 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-100">
            <InfoIcon className="h-5 w-5" />
            <AlertTitle>Good news!</AlertTitle>
            <AlertDescription>
              Your annual income is ₹
              {Number.parseFloat(income).toLocaleString()} which is not taxable.
              There is no tax applicable for annual income up to ₹12,00,000.
            </AlertDescription>
          </Alert>
        )}

        {totalTax > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-inner">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
              Tax Breakdown
            </h3>
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 text-gray-600 dark:text-gray-400">
                    Income Slab
                  </th>
                  <th className="text-right py-2 text-gray-600 dark:text-gray-400">
                    Tax Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {taxBreakdown.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    <td className="py-2 text-gray-800 dark:text-gray-200">
                      {item.slab}
                    </td>
                    <td className="text-right py-2 text-gray-800 dark:text-gray-200">
                      ₹{item.tax.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-bold text-lg">
                  <td className="py-2 text-gray-800 dark:text-white">
                    Total Tax
                  </td>
                  <td className="text-right py-2 text-blue-600 dark:text-blue-400">
                    ₹{totalTax.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
