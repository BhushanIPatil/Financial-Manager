import { useState } from 'react';
import { Users, Plus, Edit2, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useFinancialStore from '@/store/useFinancialStore';
import type { FamilyMember, MemberRelation } from '@/types';
import { format } from 'date-fns';

const RELATION_OPTIONS: { value: MemberRelation; label: string }[] = [
  { value: 'self', label: 'Self' },
  { value: 'spouse', label: 'Spouse' },
  { value: 'parent', label: 'Parent' },
  { value: 'child', label: 'Child' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'grandparent', label: 'Grandparent' },
  { value: 'grandchild', label: 'Grandchild' },
  { value: 'other', label: 'Other' },
];

export function FamilyMembersPage() {
  const { familyMembers, incomes, expenses, addFamilyMember, updateFamilyMember, deleteFamilyMember } = useFinancialStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [formData, setFormData] = useState<Partial<FamilyMember>>({
    name: '',
    relation: 'other',
    email: '',
    phone: '',
    dateOfBirth: '',
    notes: '',
    isActive: true,
  });

  const getMemberStats = (memberId: string) => {
    const memberIncomes = incomes.filter(i => i.familyMemberId === memberId);
    const memberExpenses = expenses.filter(e => e.familyMemberId === memberId);
    
    const totalIncome = memberIncomes.reduce((sum, i) => sum + i.amount, 0);
    const totalExpense = memberExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    return {
      totalIncome,
      totalExpense,
      netContribution: totalIncome - totalExpense,
    };
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.relation) return;

    if (editingMember) {
      updateFamilyMember(editingMember.id, formData);
      setEditingMember(null);
    } else {
      const newMember: FamilyMember = {
        id: Date.now().toString(),
        name: formData.name,
        relation: formData.relation as MemberRelation,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        notes: formData.notes,
        isActive: formData.isActive ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addFamilyMember(newMember);
    }

    setFormData({
      name: '',
      relation: 'other',
      email: '',
      phone: '',
      dateOfBirth: '',
      notes: '',
      isActive: true,
    });
    setIsAddDialogOpen(false);
  };

  const handleEdit = (member: FamilyMember) => {
    setEditingMember(member);
    setFormData(member);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this family member?')) {
      deleteFamilyMember(id);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Family Members"
        description="Manage your family members and track their financial activities"
        icon={<Users className="w-8 h-8" />}
        action={
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingMember(null);
                setFormData({
                  name: '',
                  relation: 'other',
                  email: '',
                  phone: '',
                  dateOfBirth: '',
                  notes: '',
                  isActive: true,
                });
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Family Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingMember ? 'Edit Family Member' : 'Add Family Member'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="relation">Relation *</Label>
                  <Select
                    value={formData.relation}
                    onValueChange={(value) => setFormData({ ...formData, relation: value as MemberRelation })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RELATION_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 1234567890"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes"
                  />
                </div>

                <Button onClick={handleSubmit} className="w-full">
                  {editingMember ? 'Update Member' : 'Add Member'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {familyMembers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Family Members Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start by adding family members to track their financial activities
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Member
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {familyMembers.map((member) => {
            const stats = getMemberStats(member.id);
            return (
              <Card key={member.id}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {RELATION_OPTIONS.find(r => r.value === member.relation)?.label || member.relation}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(member)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(member.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {member.email && (
                    <div className="text-sm text-muted-foreground">
                      {member.email}
                    </div>
                  )}
                  {member.phone && (
                    <div className="text-sm text-muted-foreground">
                      {member.phone}
                    </div>
                  )}
                  
                  <div className="pt-3 border-t space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Income</span>
                      <span className="font-medium text-green-600 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {formatCurrency(stats.totalIncome)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Expenses</span>
                      <span className="font-medium text-red-600 flex items-center">
                        <TrendingDown className="w-3 h-3 mr-1" />
                        {formatCurrency(stats.totalExpense)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-semibold pt-2 border-t">
                      <span>Net Contribution</span>
                      <span className={stats.netContribution >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(stats.netContribution)}
                      </span>
                    </div>
                  </div>

                  {member.notes && (
                    <div className="pt-2 text-xs text-muted-foreground">
                      {member.notes}
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
