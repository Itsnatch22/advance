// lib/disburse.ts

export type DisbursementStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

export interface DisbursementRequest {
  requestId: string;
  amount: number;
  currency: string;
  recipient: {
    id: string; // Employee ID
    name: string;
    phone?: string;
    bankAccount?: any;
  };
  reference?: string; // e.g. "INV-123"
}

export interface DisbursementResult {
  success: boolean;
  transactionId?: string;
  providerRef?: string;
  message?: string;
  status: DisbursementStatus;
}

export interface DisbursementProvider {
  sendPayment(request: DisbursementRequest): Promise<DisbursementResult>;
  checkStatus(transactionId: string): Promise<DisbursementStatus>;
}

// --- Mock Adapter ---

export class MockDisbursementProvider implements DisbursementProvider {
  async sendPayment(request: DisbursementRequest): Promise<DisbursementResult> {
    console.log(
      `[MockDisburse] Processing payment of ${request.currency} ${request.amount} to ${request.recipient.name}`
    );

    // Simulate API latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simulate random failure (optional, commented out for now)
    // if (Math.random() < 0.1) return { success: false, status: 'FAILED', message: "Random mock failure" };

    return {
      success: true,
      transactionId: `tx_mock_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      providerRef: `mpesa_${Date.now()}`,
      status: "COMPLETED",
      message: "Mock payment successful",
    };
  }

  async checkStatus(transactionId: string): Promise<DisbursementStatus> {
    return "COMPLETED";
  }
}

// --- Factory / Singleton ---

const currentProvider = new MockDisbursementProvider(); // In future switch based on env

export const disbursementAdapter = currentProvider;
