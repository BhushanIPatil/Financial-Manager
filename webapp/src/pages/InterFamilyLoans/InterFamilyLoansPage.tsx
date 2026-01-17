import { useState } from 'react';
import { Coins, Plus, Edit2, Trash2, DollarSign, Calendar, AlertCircle } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useFinancialStore from '@/store/useFinancialStore';
import type { InterFamilyLoan, LoanStatus } from '@/types';
import { format, isPast } from 'date-fns';

const STATUS_COLORS: Record<LoanStatus, string> = {
  active: 'bg-blue-500',
  paid: 'bg-green-500',
  partially_paid: 'bg-yellow-500',
  overdue: 'bg-red-500',
  cancelled: 'bg-gray-500',
};

export function InterFamilyLoansPage() {
  const { familyMembers, interFamilyLoans, addInterFamilyLoan, updateInterFamilyLoan, deleteInterFamilyLoan } = useFinancialStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState<InterFamilyLoan | null>(null);
  const [formData, setFormData] = useState<Partial<InterFamilyLoan>>({
    lenderId: '',
    borrowerId: '',
    amount: 0,
    amountPaid: 0,
    interestRate: 0,
    loanDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    status: 'active',
    description: '',
    notes: '',
  });

  const getMemberName = (memberId: string) => {
    return familyMembers.find(m => m.id === memberId)?.name || 'Unknown';
  };

  const calculateRemaining = (amount: number, amountPaid: number) => {
    return amount - amountPaid;
  };

  const isOverdue = (dueDate?: string, status?: LoanStatus) => {
    if (!dueDate || status === 'paid' || status === 'cancelled') return false;
    return isPast(new Date(dueDate));
  };

  const handleSubmit = () => {
    if (!formData.lenderId || !formData.borrowerId || !formData.amount || !formData.loanDate) return;

    if (formData.lenderId === formData.borrowerId) {
      alert('Lender and borrower cannot be the same person');
      return;
    }

    if (editingLoan) {
      updateInterFamilyLoan(editingLoan.id, formData);
      setEditingLoan(null);
    } else {
      const newLoan: InterFamilyLoan = {
        id: Date.now().toString(),
        lenderId: formData.lenderId!,
        lenderName: getMemberName(formData.lenderId!),
        borrowerId: formData.borrowerId!,
        borrowerName: getMemberName(formData.borrowerId!),
        amount: formData.amount!,
        amountPaid: formData.amountPaid || 0,
        interestRate: formData.interestRate || 0,
        loanDate: formData.loanDate!,
        dueDate: formData.dueDate,
        status: formData.status as LoanStatus || 'active',
        description: formData.description,
        notes: formData.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addInterFamilyLoan(newLoan);
    }

    setFormData({
      lenderId: '',
      borrowerId: '',
      amount: 0,
      amountPaid: 0,
      interestRate: 0,
      loanDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      status: 'active',
      description: '',
      notes: '',
    });
    setIsAddDialogOpen(false);
  };

  const handleEdit = (loan: InterFamilyLoan) => {
    setEditingLoan(loan);
    setFormData({
      ...loan,
      loanDate: loan.loanDate.split('T')[0],
      dueDate: loan.dueDate?.split('T')[0] || '',
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this loan?')) {
      deleteInterFamilyLoan(id);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalLoansGiven = interFamilyLoans.reduce((sum, loan) => sum + (loan.status !== 'cancelled' ? loan.amount : 0), 0);
  const totalOutstanding = interFamilyLoans.reduce((sum, loan) => 
    sum + (loan.status !== 'paid' && loan.status !== 'cancelled' ? calculateRemaining(loan.amount, loan.amountPaid) : 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inter-Family Loans"
        description="Track loans between family members"
        action={
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingLoan(null);
                setFormData({
                  lenderId: '',
                  borrowerId: '',
                  amount: 0,
                  amountPaid: 0,
                  interestRate: 0,
                  loanDate: new Date().toISOString().split('T')[0],
                  dueDate: '',
                  status: 'active',
                  description: '',
                  notes: '',
                });
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Loan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingLoan ? 'Edit Loan' : 'Add Loan'}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lenderId">Lender *</Label>
                  <Select
                    value={formData.lenderId}
                    onValueChange={(value) => setFormData({ ...formData, lenderId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select lender" />
                    </SelectTrigger>
                    <SelectContent>
                      {familyMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="borrowerId">Borrower *</Label>
                  <Select
                    value={formData.borrowerId}
                    onValueChange={(value) => setFormData({ ...formData, borrowerId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select borrower" />
                    </SelectTrigger>
                    <SelectContent>
                      {familyMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amountPaid">Amount Paid</Label>
                  <Input
                    id="amountPaid"
                    type="number"
                    value={formData.amountPaid}
                    onChange={(e) => setFormData({ ...formData, amountPaid: parseFloat(e.target.value) })}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interestRate">Interest Rate (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.1"
                    value={formData.interestRate}
                    onChange={(e) => setFormData({ ...formData, interestRate: parseFloat(e.target.value) })}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as LoanStatus })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="partially_paid">Partially Paid</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loanDate">Loan Date *</Label>
                  <Input
                    id="loanDate"
                    type="date"
                    value={formData.loanDate}
                    onChange={(e) => setFormData({ ...formData, loanDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Purpose of the loan"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes"
                  />
                </div>

                <Button onClick={handleSubmit} className="col-span-2">
                  {editingLoan ? 'Update Loan' : 'Add Loan'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalLoansGiven)}</div>
            <p className="text-xs text-muted-foreground">
              Across {interFamilyLoans.length} loan(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Amount</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalOutstanding)}</div>
            <p className="text-xs text-muted-foreground">
              Yet to be recovered
            </p>
          </CardContent>
        </Card>
      </div>

      {familyMembers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Coins className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Add Family Members First</h3>
            <p className="text-muted-foreground text-center mb-4">
              You need to add family members before tracking loans
            </p>
          </CardContent>
        </Card>
      ) : interFamilyLoans.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Coins className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Loans Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start tracking loans between family members
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Loan
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {interFamilyLoans.map((loan) => {
            const remaining = calculateRemaining(loan.amount, loan.amountPaid);
            const overdue = isOverdue(loan.dueDate, loan.status);
            
            return (
              <Card key={loan.id}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">
                        {getMemberName(loan.lenderId)} → {getMemberName(loan.borrowerId)}
                      </CardTitle>
                      <Badge className={STATUS_COLORS[loan.status]}>
                        {loan.status.replace('_', ' ')}
                      </Badge>
                      {overdue && (
                        <Badge variant="destructive">
                          Overdue
                        </Badge>
                      )}
                    </div>
                    {loan.description && (
                      <p className="text-sm text-muted-foreground">{loan.description}</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(loan)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(loan.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Loan Amount</p>
                      <p className="text-lg font-semibold">{formatCurrency(loan.amount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Amount Paid</p>
                      <p className="text-lg font-semibold text-green-600">{formatCurrency(loan.amountPaid)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Remaining</p>
                      <p className="text-lg font-semibold text-orange-600">{formatCurrency(remaining)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Interest Rate</p>
                      <p className="text-lg font-semibold">{loan.interestRate}%</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Loan: {format(new Date(loan.loanDate), 'dd MMM yyyy')}</span>
                    </div>
                    {loan.dueDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Due: {format(new Date(loan.dueDate), 'dd MMM yyyy')}</span>
                      </div>
                    )}
                  </div>

                  {loan.notes && (
                    <div className="mt-3 pt-3 border-t text-sm text-muted-foreground">
                      {loan.notes}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
