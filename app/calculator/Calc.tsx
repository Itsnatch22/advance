"use client";
import React, { useState, useMemo } from "react";

const Calc = () => {
  const [salary, setSalary] = useState<number>(0);
  const [daysWorked, setDaysWorked] = useState<number>(0);
  const [daysInMonth, setDaysInMonth] = useState<number>(30);

  const [remunerations, setRemunerations] = useState(false);
  const [allowances, setAllowance] = useState(false);
  const [isCovered, setIsCovered] = useState(false);
  const [isInsured, setIsInsured] = useState(false);
  const [isContributed, setIsContributed] = useState(false);

  const [deductNSSF, setDeductNSSF] = useState(true);
  const [deductHousingLevy, setDeductHousingLevy] = useState(false);
  const [deductSHIF, setDeductSHIF] = useState(true);

  const relief = 2400;

  const {
    gross,
    nssf,
    housingLevy,
    shif,
    totalDeductions,
    netPay,
    earnedAdvance,
  } = useMemo(() => {
    let gross = salary;

    // Optional Remunerations and Add-ons
    if (remunerations) gross += 3000; // bonus/travel
    if (allowances) gross += 2500; // meals/night
    if (isCovered) gross += 1500; // pension/medical
    if (isInsured) gross += 2000; // insurance
    if (isContributed) gross += 1000; // contributions

    // Deductions
    let nssf = 0,
      housingLevy = 0,
      shif = 0;

    if (deductNSSF && salary >= 8000 && salary <= 72000) nssf = salary * 0.06;
    if (deductHousingLevy) housingLevy = salary * 0.015;
    if (deductSHIF) shif = salary * 0.0275;

    const totalDeductions = nssf + housingLevy + shif;
    const netPay = Math.max(0, gross - totalDeductions - relief);
    const earnedAdvance = netPay * (daysWorked / daysInMonth);

    return { gross, nssf, housingLevy, shif, totalDeductions, netPay, earnedAdvance };
  }, [
    salary,
    daysWorked,
    daysInMonth,
    remunerations,
    allowances,
    isCovered,
    isInsured,
    isContributed,
    deductNSSF,
    deductHousingLevy,
    deductSHIF,
  ]);

  const advanceEligible =
    earnedAdvance >= netPay * 0.6 && earnedAdvance <= netPay ? earnedAdvance : 0;

  return (
    <div className="gap-6 bg-green-50 min-h-screen grid grid-cols-12 rounded-2xl">
      <div className="col-span-8 p-8">
        <h2 className="text-4xl font-bold font-serif">Wage Calculator</h2>
        <p className="text-sm mt-8 text-black">
          Our calculator helps employees estimate their wages depending on the
          months they've worked for.
        </p>

        <div className="space-y-4 mt-8">
          <label className="block">
            <span className="text-sm text-black">Salary</span>
            <input
              type="number"
              value={salary || ""}
              onChange={(e) => setSalary(Number(e.target.value))}
              className="mt-1 block w-full rounded border-gray-200 shadow-sm p-2"
              placeholder="Enter gross salary"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              value={daysWorked || ""}
              onChange={(e) => setDaysWorked(Number(e.target.value))}
              className="border p-2 rounded"
              placeholder="Days Worked"
            />
            <input
              type="number"
              value={daysInMonth || ""}
              onChange={(e) => setDaysInMonth(Number(e.target.value))}
              className="border p-2 rounded"
              placeholder="Days in Month"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <label className="block">
              <span className="text-sm text-gray-700">Remunerations</span>
              <select
                value={remunerations ? "yes" : "no"}
                onChange={(e) => setRemunerations(e.target.value === "yes")}
                className="mt-1 block w-full rounded border-gray-200 p-2"
              >
                <option value="no">None</option>
                <option value="yes">Bonuses / Travel</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm text-gray-700">Allowances</span>
              <select
                value={allowances ? "yes" : "no"}
                onChange={(e) => setAllowance(e.target.value === "yes")}
                className="mt-1 block w-full rounded border-gray-200 p-2"
              >
                <option value="no">None</option>
                <option value="yes">Meals / Nights Out</option>
              </select>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <label className="block">
              <span className="text-sm text-gray-700">Cover</span>
              <select
                value={isCovered ? "yes" : "no"}
                onChange={(e) => setIsCovered(e.target.value === "yes")}
                className="mt-1 block w-full rounded border-gray-200 p-2"
              >
                <option value="no">None</option>
                <option value="yes">Pension / Medical</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm text-gray-700">Insurance</span>
              <select
                value={isInsured ? "yes" : "no"}
                onChange={(e) => setIsInsured(e.target.value === "yes")}
                className="mt-1 block w-full rounded border-gray-200 p-2"
              >
                <option value="no">None</option>
                <option value="yes">Life & Health / Car</option>
              </select>
            </label>
          </div>

          <label className="block mt-4">
            <span className="text-sm text-gray-700">Contributions</span>
            <select
              value={isContributed ? "yes" : "no"}
              onChange={(e) => setIsContributed(e.target.value === "yes")}
              className="mt-1 block w-full rounded border-gray-200 p-2"
            >
              <option value="no">None</option>
              <option value="yes">Mortgage / Provident Fund</option>
            </select>
          </label>

          {/* Deductions */}
          <div className="flex flex-col gap-3 mt-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={deductNSSF}
                onChange={() => setDeductNSSF(!deductNSSF)}
              />
              <span className="text-sm">Deduct NSSF</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={deductHousingLevy}
                onChange={() => setDeductHousingLevy(!deductHousingLevy)}
              />
              <span className="text-sm">Deduct Housing Levy</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={deductSHIF}
                onChange={() => setDeductSHIF(!deductSHIF)}
              />
              <span className="text-sm">Deduct SHIF</span>
            </label>
          </div>
        </div>
      </div>

      <div className="col-span-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-lg mb-4">Total calculations</h3>
          <div className="text-sm text-gray-500 mb-2">Employee Costs</div>

          <div className="flex justify-between py-2 border-b">
            <div className="text-sm">Gross Pay</div>
            <div className="font-mono">{gross.toFixed(2)}</div>
          </div>

          <div className="flex justify-between py-2 border-b">
            <div className="text-sm">Net Salary</div>
            <div className="font-mono">{netPay.toFixed(2)}</div>
          </div>

          <div className="flex justify-between py-2 border-b">
            <div className="text-sm">Earned Advance</div>
            <div className="font-mono text-green-600">
              {advanceEligible ? `${advanceEligible.toFixed(2)} KES` : "Not Eligible"}
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-400">Breakdown:</div>
          <ul className="text-sm mt-2 space-y-1">
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
