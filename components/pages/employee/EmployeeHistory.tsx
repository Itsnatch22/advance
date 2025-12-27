"use client"
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableRow, TableHead, TableCell, Badge } from '@/components/ui';
import { RequestStatus } from '@/types';

const HISTORY_DATA = [
  { id: '1', date: 'Oct 12, 2023', amount: 200, status: RequestStatus.APPROVED, repaid: 'Pending' },
  { id: '2', date: 'Sep 28, 2023', amount: 150, status: RequestStatus.PAID, repaid: 'Yes' },
  { id: '3', date: 'Sep 10, 2023', amount: 300, status: RequestStatus.DENIED, repaid: '-' },
  { id: '4', date: 'Aug 15, 2023', amount: 500, status: RequestStatus.PAID, repaid: 'Yes' },
];

const EmployeeHistory: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Request History</h1>
        <p className="text-slate-500">View all your past wage advance requests and their status.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Date</TableHeader>
                <TableHeader>Amount</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Repayment Status</TableHeader>
              </TableRow>
            </TableHead>
            <tbody>
              {HISTORY_DATA.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell className="font-medium">${item.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        item.status === RequestStatus.APPROVED || item.status === RequestStatus.PAID ? 'success' : 
                        item.status === RequestStatus.DENIED ? 'danger' : 'default'
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`text-sm ${item.repaid === 'Yes' ? 'text-emerald-600 font-medium' : 'text-slate-500'}`}>
                      {item.repaid}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeHistory;