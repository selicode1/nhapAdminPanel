import React, { useState } from 'react';
import { useHospital } from '../contexts/HospitalContext';
import Layout from '../components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const AddDepartmentPage: React.FC = () => {
  const { addDepartment } = useHospital();
  const [formData, setFormData] = useState({
    name: '',
    contactPhone: '',
    contactEmail: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await addDepartment(formData);
      setFormData({ name: '', contactPhone: '', contactEmail: '' });
      // Show success message or redirect
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Add New Department</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Department Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Contact Phone"
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                required
              />
              <Input
                label="Contact Email"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                required
              />
              <Button
                type="submit"
                isLoading={isLoading}
                fullWidth
              >
                Add Department
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AddDepartmentPage;