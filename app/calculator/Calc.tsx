"use client"
import React , { useState }from 'react'

const Calc = () => {

    const [salary, setSalary] = useState<number>(0)
const [isNonResident, setIsNonResident] = useState(false)
const [isSecondary, setIsSecondary] = useState(false)
const [mortgageInterest, setMortgageInterest] = useState<number>(0)
const [enableHousingRelief, setEnableHousingRelief] = useState(false)
const [deductNSSF, setDeductNSSF] = useState(true)
const [deductPAYE, setDeductPAYE] = useState(true)
const [deductHousingLevy, setDeductHousingLevy] = useState(false)
const [deductNHIF, setDeductNHIF] = useState(true)


// Simple, illustrative calculation rules (replace with real rules if you want)
const calcNSSF = (s: number) => (deductNSSF ? Math.min(s * 0.06, 2000) : 0)
const calcPAYE = (s: number) => (deductPAYE ? s * 0.25 : 0) // placeholder flat 25%
const calcHousingLevy = (s: number) => (deductHousingLevy ? s * 0.01 : 0)
const calcNHIF = (s: number) => (deductNHIF ? Math.min(1500, Math.max(300, Math.floor(s / 1000) * 50)) : 0)
const calcEmployerExtras = (s: number) => {
// Example: employer NITA like a fixed contribution for demo
return 50
}


const gross = salary
const nssf = calcNSSF(gross)
const paye = calcPAYE(gross)
const housingLevy = calcHousingLevy(gross)
const nhif = calcNHIF(gross)
const employerExtras = calcEmployerExtras(gross)


const totalDeductions = nssf + paye + housingLevy + nhif
const netPay = Math.max(0, gross - totalDeductions)

  return (
    <div className="gap-6 bg-green-50 min-h-screen grid grid-cols-12 rounded-2xl">
                <div className="col-span-8 p-8">
                    <h2 className="text-4xl font-bold font-serif">Wage Calculator</h2>
                    <p className="text-sm mt-8 text-black">Our calculator helps employees estimate on they wages depending on the months they&apos;ve worked for.</p>

                    <div className="space-y-4 mt-8">
                        <label htmlFor="" className="block">
                            <span className="text-sm text-black">Salary</span>
                            <input
                type="number"
                value={salary || ''}
                onChange={(e) => setSalary(Number(e.target.value))}
                className="mt-1 block w-full rounded border-gray-200 shadow-sm p-2"
                placeholder="Enter gross salary"
              />
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm text-gray-700">Is Non-Resident?</span>
                <select
                  value={isNonResident ? 'yes' : 'no'}
                  onChange={(e) => setIsNonResident(e.target.value === 'yes')}
                  className="mt-1 block w-full rounded border-gray-200 p-2"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm text-gray-700">Is Secondary Employee?</span>
                <select
                  value={isSecondary ? 'yes' : 'no'}
                  onChange={(e) => setIsSecondary(e.target.value === 'yes')}
                  className="mt-1 block w-full rounded border-gray-200 p-2"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm text-gray-700">Interest on Mortgage</span>
                <input
                  type="number"
                  value={mortgageInterest || ''}
                  onChange={(e) => setMortgageInterest(Number(e.target.value))}
                  className="mt-1 block w-full rounded border-gray-200 p-2"
                  placeholder="Amount"
                />
              </label>

              <label className="block">
                <span className="text-sm text-gray-700">Enable Housing Levy Relief</span>
                <select
                  value={enableHousingRelief ? 'yes' : 'no'}
                  onChange={(e) => setEnableHousingRelief(e.target.value === 'yes')}
                  className="mt-1 block w-full rounded border-gray-200 p-2"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </label>
            </div>

                        <div className="flex flex-col gap-3 mt-2">
                            <label className="flex items-center gap-3">
                                <input type="checkbox" checked={deductNSSF} onChange={() => setDeductNSSF(!deductNSSF)} />
                                <span className="text-sm">Deduct NSSF</span>
                            </label>

                            <label className="flex items-center gap-3">
                                <input type="checkbox" checked={deductPAYE} onChange={() => setDeductPAYE(!deductPAYE)} />
                                <span className="text-sm">Deduct PAYE</span>
                            </label>

                            <label className="flex items-center gap-3">
                                <input type="checkbox" checked={deductHousingLevy} onChange={() => setDeductHousingLevy(!deductHousingLevy)} />
                                <span className="text-sm">Deduct Housing Levy</span>
                            </label>

                            <label className="flex items-center gap-3">
                                <input type="checkbox" checked={deductNHIF} onChange={() => setDeductNHIF(!deductNHIF)} />
                                <span className="text-sm">Deduct NHIF/SHIF</span>
                            </label>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={() => {
                                // we calculate live — button kept for UX parity with the screenshot
                                // nothing to do here because results are derived from state
                                }}
                                className="bg-green-600 text-white px-6 py-2 rounded w-full"
                            >
                                Calculate
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-span-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-lg mb-4">Total calculations</h3>

            <div className="text-sm text-gray-500 mb-2">Employee Costs</div>
            <div className="flex justify-between py-2 border-b">
              <div className="text-sm">Net Salary</div>
              <div className="font-mono">{netPay.toFixed(2)}</div>
            </div>

            <div className="text-sm text-gray-500 mt-4 mb-2">Employer Costs</div>
            <div className="flex justify-between py-2 border-b">
              <div className="text-sm">NITA</div>
              <div className="font-mono">{employerExtras.toFixed(2)}</div>
            </div>

            <div className="mt-6 bg-green-600 text-white rounded p-3 flex items-center justify-between">
              <div className="text-sm">Net Pay</div>
              <div className="text-xl font-semibold">{netPay.toFixed(2)} KES</div>
            </div>

            <div className="mt-4 text-xs text-gray-400">Breakdown:</div>
            <ul className="text-sm mt-2 space-y-1">
              <li>NSSF: {nssf.toFixed(2)}</li>
              <li>PAYE: {paye.toFixed(2)}</li>
              <li>Housing Levy: {housingLevy.toFixed(2)}</li>
              <li>NHIF: {nhif.toFixed(2)}</li>
            </ul>

          </div>
        </div>
            </div>
  )
}

export default Calc