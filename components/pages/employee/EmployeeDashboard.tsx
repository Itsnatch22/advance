"use client"
import React, { useState } from 'react';
import { Check, X, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableRow, TableHead, TableCell, Badge, Button } from '@/components/ui';
import { RequestStatus, WageRequest } from '@/types';

const MOCK_REQUESTS: WageRequest[] = [
  { id: '101', employeeId: '1', employeeName: 'Alice Johnson', amount: 200, date: '2023-10-25', status: RequestStatus.PENDING, fee: 5 },
  { id: '102', employeeId: '2', employeeName: 'Bob Smith', amount: 500, date: '2023-10-24', status: RequestStatus.PENDING, fee: 12 },
  { id: '103', employeeId: '4', employeeName: 'Diana Prince', amount: 1000, date: '2023-10-23', status: RequestStatus.APPROVED, fee: 20 },
  { id: '104', employeeId: '5', employeeName: 'Evan Wright', amount: 150, date: '2023-10-22', status: RequestStatus.DENIED, fee: 3 },
];

const EmployerRequests: React.FC = () => {
  const [requests, setRequests] = useState<WageRequest[]>(MOCK_REQUESTS);

  const handleAction = (id: string, newStatus: RequestStatus) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: newStatus } : req
    ));
  };

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.APPROVED: return <Badge variant="success">Approved</Badge>;
      case RequestStatus.DENIED: return <Badge variant="danger">Denied</Badge>;
      case RequestStatus.PENDING: return <Badge variant="warning">Pending</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Wage Requests</h1>
        <p className="text-slate-500">Review and action employee wage advance requests.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Employee</TableHeader>
                <TableHeader>Amount Requested</TableHeader>
                <TableHeader>Fee</TableHeader>
                <TableHeader>Date</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <tbody>
              {requests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>
                    <div className="font-medium text-slate-900">{req.employeeName}</div>
                    <div className="text-xs text-slate-500">ID: {req.employeeId}</div>
                  </TableCell>
                  <TableCell className="font-bold text-slate-900">${req.amount}</TableCell>
                  <TableCell className="text-slate-500">${req.fee}</TableCell>
                  <TableCell>{req.date}</TableCell>
                  <TableCell>{getStatusBadge(req.status)}</TableCell>
                  <TableCell>
                    {req.status === RequestStatus.PENDING ? (
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="success" 
                          size="sm" 
                          onClick={() => handleAction(req.id, RequestStatus.APPROVED)}
                          title="Approve"
                        >
                          <Check size={16} />
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm" 
                          onClick={() => handleAction(req.id, RequestStatus.DENIED)}
                          title="Deny"
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock size={12} /> Actioned
                      </span>
                    )}
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

export default EmployerRequests;