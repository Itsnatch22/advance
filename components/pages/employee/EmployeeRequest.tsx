import React, { useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@/components/ui';

const EmployeeRequest: React.FC = () => {
  const [amount, setAmount] = useState<number>(0);
  const [reason, setReason] = useState('');
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);

  const MAX_AVAILABLE = 1250;
  const FEE_PERCENTAGE = 0.02; // 2%
  const fee = amount * FEE_PERCENTAGE;
  const total = amount + fee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || amount > MAX_AVAILABLE) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep('success');
    }, 1500);
  };

  if (step === 'success') {
    return (
      <div className="max-w-md mx-auto mt-12 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 size={40} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Request Submitted!</h2>
          <p className="text-slate-500 mt-2">Your request for ${amount} has been sent for approval. You will be notified shortly.</p>
        </div>
        <Button onClick={() => { setStep('form'); setAmount(0); }}>Make Another Request</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Request Wage Advance</h1>
        <p className="text-slate-500">Access your earned wages before payday.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg flex items-start gap-3">
              <AlertCircle className="text-indigo-600 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-medium text-indigo-900">Available Limit</p>
                <p className="text-sm text-indigo-700">You can request up to <span className="font-bold">${MAX_AVAILABLE}</span> based on your days worked.</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Amount Required
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                <input
                  type="number"
                  min="1"
                  max={MAX_AVAILABLE}
                  value={amount || ''}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 text-2xl font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:bg-white transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>

            <Input 
              label="Reason (Optional)"
              placeholder="e.g. Car repair, Medical bill..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            <div className="bg-slate-50 p-4 rounded-xl space-y-3 border border-slate-100">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Requested Amount</span>
                <span>${amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Service Fee (2%)</span>
                <span>${fee.toFixed(2)}</span>
              </div>
              <div className="h-px bg-slate-200 my-2"></div>
              <div className="flex justify-between font-bold text-slate-900">
                <span>Total Repayment</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={amount <= 0 || amount > MAX_AVAILABLE || loading}
            >
              {loading ? 'Processing...' : 'Submit Request'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeRequest;