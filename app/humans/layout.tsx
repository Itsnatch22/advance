import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Humans",
    description: "Get to meet the team that makes EaziWage work.",
    openGraph: {
        title: "EaziWage Humans - Our Team",
        description: "Discover the minds that drive EaziWage forward"
    }
}

export default function HumanLayout ({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}