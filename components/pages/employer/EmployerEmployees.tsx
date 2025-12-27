import React, { useState } from 'react';
import { Search, MoreHorizontal, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableRow, TableHead, TableCell, Badge, Button, Input } from '@/components/ui';
import { Employee } from '@/types';

const MOCK_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@company.com', department: 'Engineering', availableBalance: 1200, salary: 5000, status: 'Active' },
  { id: '2', name: 'Bob Smith', email: 'bob@company.com', department: 'Sales', availableBalance: 800, salary: 4500, status: 'Active' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@company.com', department: 'Marketing', availableBalance: 0, salary: 4200, status: 'Inactive' },
  { id: '4', name: 'Diana Prince', email: 'diana@company.com', department: 'Engineering', availableBalance: 2000, salary: 6000, status: 'Active' },
  { id: '5', name: 'Evan Wright', email: 'evan@company.com', department: 'HR', availableBalance: 500, salary: 4000, status: 'Active' },
];

const EmployerEmployees: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = MOCK_EMPLOYEES.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Employees</h1>
          <p className="text-slate-500">Manage your team and view their eligibility.</p>
        </div>
        <Button>
          <Plus size={18} className="mr-2" />
          Add Employee
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Team Directory</CardTitle>
          <div className="w-full sm:w-64">
            <Input 
              placeholder="Search employees..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Name</TableHeader>
                <TableHeader>Department</TableHeader>
                <TableHeader>Salary</TableHeader>
                <TableHeader>Available Balance</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <tbody>
              {filteredEmployees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{emp.name}</p>
                        <p className="text-xs text-slate-500">{emp.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{emp.department}</TableCell>
                  <TableCell>${emp.salary.toLocaleString()}</TableCell>
                  <TableCell className="font-medium text-indigo-600">${emp.availableBalance.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={emp.status === 'Active' ? 'success' : 'default'}>
                      {emp.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal size={16} />
                    </Button>
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

export default EmployerEmployees;