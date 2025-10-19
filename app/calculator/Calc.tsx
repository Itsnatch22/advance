"use client";
import React, { useState, useMemo, useEffect } from "react";

const Calc = () => {
  const [salary, setSalary] = useState<number>(0);
  const [daysWorked, setDaysWorked] = useState<number>(0);
  const [daysInMonth, setDaysInMonth] = useState<number>(30);

  // 🔹 Allow user to input actual allowance figures
  const [mealAllowance, setMealAllowance] = useState<number>(0);
  const [nightOutAllowance, setNightOutAllowance] = useState<number>(0);
  const [pensionCover, setPensionCover] = useState<number>(0);
  const [medicalCover, setMedicalCover] = useState<number>(0);
  const [lifeInsurance, setLifeInsurance] = useState<number>(0);

  const [deductNSSF, setDeductNSSF] = useState(true);
  const [deductHousingLevy, setDeductHousingLevy] = useState(false);
  const [deductSHIF, setDeductSHIF] = useState(true);

  const relief = 2400;

  // 🔹 Auto-detect days in month
  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // JS is 0-based months
    const days = new Date(year, month, 0).getDate();
    setDaysInMonth(days);
  }, []);

  const { gross, nssf, housingLevy, shif, netPay, earnedAdvance } = useMemo(() => {
    let gross = salary;

    // Sum all custom allowance inputs
    gross +=
      mealAllowance +
      nightOutAllowance +
      pensionCover +
      medicalCover +
      lifeInsurance;

    // Deductions
    let nssf = 0,
      housingLevy = 0,
      shif = 0;

    if (deductNSSF && salary >= 8000 && salary <= 72000) nssf = salary * 0.06;
    if (deductHousingLevy) housingLevy = salary * 0.015;
    if (deductSHIF) shif = salary * 0.0275;

    const totalDeductions = nssf + housingLevy + shif;
    const netPay = Math.max(0, gross - totalDeductions - relief);

    // Earned advance = portion of netPay based on worked days
    const earnedAdvance = netPay * (daysWorked / daysInMonth);

    return { gross, nssf, housingLevy, shif, totalDeductions, netPay, earnedAdvance };
  }, [
    salary,
    daysWorked,
    daysInMonth,
    mealAllowance,
    nightOutAllowance,
    pensionCover,
    medicalCover,
    lifeInsurance,
    deductNSSF,
    deductHousingLevy,
    deductSHIF,
  ]);

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 dark:bg-green-500 bg-green-50 min-h-screen rounded-2xl p-4 lg:p-8">
      <div className="lg:col-span-8 p-4 lg:p-8">
        <h2 className="text-4xl font-bold font-seri dark:text-black">Wage Calculator</h2>
        <p className="mt-8 text-black text-lg">
          Estimate your wages and earned pay advances based on your inputs.
        </p>

        {/* Salary and Days */}
        <div className="space-y-4 mt-8">
          <label className="block">
            <span className="text-black text-lg">Basic Salary</span>
            <input
              type="number"
              value={salary || ""}
              onChange={(e) => setSalary(Number(e.target.value))}
              className="mt-1 block w-full rounded border-gray-200 shadow-sm p-2 text-black"
              placeholder="Enter gross salary"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              value={daysWorked || ""}
              onChange={(e) => setDaysWorked(Number(e.target.value))}
              className="border p-2 rounded text-black text-lg"
              placeholder="Days Worked"
            />
            <input
              type="number"
              value={daysInMonth || ""}
              readOnly
              className="border p-2 rounded text-black text-lg bg-gray-100"
              placeholder="Days in Month (auto)"
            />
          </div>

          {/* Allowance inputs */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <input
              type="number"
              value={mealAllowance || ""}
              onChange={(e) => setMealAllowance(Number(e.target.value))}
              className="border p-2 rounded text-black"
              placeholder="Meal Allowance"
            />
            <input
              type="number"
              value={nightOutAllowance || ""}
              onChange={(e) => setNightOutAllowance(Number(e.target.value))}
              className="border p-2 rounded text-black"
              placeholder="Night Out Allowance"
            />
            <input
              type="number"
              value={pensionCover || ""}
              onChange={(e) => setPensionCover(Number(e.target.value))}
              className="border p-2 rounded text-black"
              placeholder="Pension Cover"
            />
            <input
              type="number"
              value={medicalCover || ""}
              onChange={(e) => setMedicalCover(Number(e.target.value))}
              className="border p-2 rounded text-black"
              placeholder="Medical Cover"
            />
            <input
              type="number"
              value={lifeInsurance || ""}
              onChange={(e) => setLifeInsurance(Number(e.target.value))}
              className="border p-2 rounded text-black"
              placeholder="Life Insurance"
            />
          </div>

          {/* Deductions */}
          <div className="flex flex-col gap-3 mt-6">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={deductNSSF}
                onChange={() => setDeductNSSF(!deductNSSF)}
              />
              <span className="text-sm dark:text-black">Deduct NSSF</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={deductHousingLevy}
                onChange={() => setDeductHousingLevy(!deductHousingLevy)}
              />
              <span className="text-sm dark:text-black">Deduct Housing Levy</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={deductSHIF}
                onChange={() => setDeductSHIF(!deductSHIF)}
              />
              <span className="text-sm dark:text-black">Deduct SHIF</span>
            </label>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="lg:col-span-4">
        <div className="bg-gray-100 rounded-lg shadow p-6">
          <h3 className="font-bold text-lg mb-4 dark:text-black">Total calculations</h3>
          <div className="flex justify-between py-2 border-b">
            <div className="text-sm dark:text-black">Gross Pay</div>
            <div className="font-mono dark:text-black">{gross.toFixed(2)}</div>
          </div>
          <div className="flex justify-between py-2 border-b dark:text-black">
            <div className="text-sm">Net Salary</div>
            <div className="font-mono">{netPay.toFixed(2)}</div>
          </div>
          <div className="flex justify-between py-2 border-b dark:text-black">
            <div className="text-sm">Earned Advance</div>
            <div className="font-mono text-green-600">
              {earnedAdvance.toFixed(2)} KES
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-400 dark:text-black">Breakdown:</div>
          <ul className="text-sm mt-2 space-y-1 dark:text-black">
            <li>NSSF: {nssf.toFixed(2)}</li>
            <li>House Levy: {housingLevy.toFixed(2)}</li>
            <li>SHIF: {shif.toFixed(2)}</li>
            <li>PAYE Relief: {relief}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Calc;
