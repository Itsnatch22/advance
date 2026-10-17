import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: "Calculator",
    description: "Our calculator enables you the users (employers and employees) to do a simulated estimate of your earnings by incorporating PAYE rules applied in your country of origin.",
    openGraph: {
        title: "EaziWage Calculator",
        description: "Let's do an extimate of your monthly earnings."
    }
}

export default function CalculatorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>;
}