"use client";
import {
  Settings,
  CheckCircle2,
  Wallet,
  BadgeCheck,
  ShieldCheck,
  FileCheck2,
} from "lucide-react";
const BRAND = "#15803D";
export default function Integrations() {
  return (
    <section
      id="integrations"
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
        <div className="rounded-3xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Integrations & employer controls
            </h3>
            <Settings className="h-6 w-6" style={{ color: BRAND }} />
          </div>
          <ul className="mt-4 space-y-3 text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5" style={{ color: BRAND }} />
              <span>
                Payroll mapping (earnings, days worked, cut-off dates) with
                auto-reconciliation at payday.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5" style={{ color: BRAND }} />
              <span>
                Limit policies: % of earned wages, per-request caps, pay-period
                buffers, cooling-off windows.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5" style={{ color: BRAND }} />
              <span>
                Approvals by role or amount, audit logs, and CSV exports for
                Finance.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5" style={{ color: BRAND }} />
              <span>
                Data privacy by design (ODPC principles) and granular access
                control.
              </span>
            </li>
          </ul>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6">
          <h4 className="text-lg font-semibold text-gray-900">
            Transparent to your team
          </h4>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <SmallCard
              title="Flat transaction fee"
              value="KSh 25"
              icon={<Wallet className="h-5 w-5" />}
            />
            <SmallCard
              title="Application fee"
              value="5%"
              icon={<BadgeCheck className="h-5 w-5" />}
            />
            <SmallCard
              title="Interest"
              value="0%"
              icon={<ShieldCheck className="h-5 w-5" />}
            />
            <SmallCard
              title="Settlement"
              value="Automatic on payday"
              icon={<FileCheck2 className="h-5 w-5" />}
            />
          </div>
          <p className="mt-3 text-xs text-gray-600">
            Employees always see fees before confirming a withdrawal. No hidden
            charges.
          </p>
        </div>
      </div>
    </section>
  );
}

const SmallCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) => (
  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-600">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
      <div style={{ color: BRAND }}>{icon}</div>
    </div>
  </div>
);
