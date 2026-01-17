import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

type ResultsGraphProps = {
  result: {
    netMonthly: number;
    accruedGross: number;
    accessCap: number;
    platformFee: number;
    accessibleNow: number;
    // other fields can be ignored
  };
};

export default function ResultsGraph({ result }: ResultsGraphProps) {
  const data = [
    { name: "Net Earnings", value: result.netMonthly },
    { name: "Accrued Earnings", value: result.accruedGross },
    { name: "Access Cap", value: result.accessCap },
    { name: "Platform Fee", value: result.platformFee },
    { name: "Accessible Now", value: result.accessibleNow },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-6"
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <XAxis dataKey="name" stroke="#4f46e5" />
          <YAxis stroke="#4f46e5" />
          <Tooltip
            formatter={(value: number) =>
              new Intl.NumberFormat("en-US", {
                maximumFractionDigits: 0,
              }).format(value)
            }
          />
          <Legend />
          <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
