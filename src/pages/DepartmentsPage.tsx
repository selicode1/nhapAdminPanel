import React, { useState } from 'react';
import { FolderPlus, Edit, Trash } from 'lucide-react';
import { useHospital } from '../contexts/HospitalContext';
import Layout from '../components/layout/Layout';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';

const DepartmentsPage: React.FC = () => {
  const { departments, addDepartment, updateDepartment } = useHospital();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDepartment) {
      const department = departments.find(d => d.id === selectedDepartment);
      if (department) {
        updateDepartment({ ...department, ...formData });
      }
      setIsEditModalOpen(false);
    } else {
      await addDepartment(formData,);
      setIsAddModalOpen(false);
    }
    setFormData({ name: '', phone: '', email: '' });
  };

  const handleEdit = (departmentId: string) => {
    const department = departments.find(d => d.id === departmentId);
    if (department) {
      setFormData({
        name: department.name,
        phone: department.phone,
        email: department.email,
      });
      setSelectedDepartment(departmentId);
      setIsEditModalOpen(true);
    }
  };

  // const DepartmentForm = () => (
  //   <form onSubmit={handleSubmit} className="space-y-4">
  //     <Input
  //       label="Department Name"
  //       value={formData.name}
  //       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
  //       required
  //     />
  //     <Input
  //       label="Contact Phone"
  //       type="tel"
  //       value={formData.phone}
  //       onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
  //       required
  //     />
  //     <Input
  //       label="Contact Email"
  //       type="email"
  //       value={formData.email}
  //       onChange={(e) => setFormData({ ...formData, email: e.target.value })}
  //       required
  //     />
  //     <Button type="submit" fullWidth>
  //       {selectedDepartment ? 'Update Department' : 'Add Department'}
  //     </Button>
  //   </form>
  // );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage hospital departments and their contact information
            </p>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center"
          >
            <FolderPlus className="w-4 h-4 mr-2" />
            Add Department
          </Button>
        </div>

        <div className="bg-white shadow rounded-lg">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Name</Table.Head>
                <Table.Head>Contact Phone</Table.Head>
                <Table.Head>Contact Email</Table.Head>
                <Table.Head>Actions</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {departments.map((department) => (
                <Table.Row key={department.id}>
                  <Table.Cell className="font-medium text-gray-900">
                    {department.name}
                  </Table.Cell>
                  <Table.Cell>{department.phone}</Table.Cell>
                  <Table.Cell>{department.email}</Table.Cell>
                  <Table.Cell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(department.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>

      {/* Add Department Modal */}
      <Modal
        isOpen={isAddModalOpen}
onClose={() => setIsAddModalOpen(false)}
        title="Add New Department"
      >
            <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Department Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
        placeholder='Department Name'
      />
      <Input
        label="Contact Phone"
        type="tel"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        required
        placeholder='+123 456 7890'
      />
      <Input
        label="Contact Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
        placeholder='user@example.com'
      />
      <Button type="submit" fullWidth>
        {selectedDepartment ? 'Update Department' : 'Add Department'}
      </Button>
    </form>
      </Modal>

      {/* Edit Department Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedDepartment(null);
          setFormData({ name: '', phone: '', email: '' });
        }}
        title="Edit Department"
      >
                    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Department Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
        placeholder='Department Name'
      />
      <Input
        label="Contact Phone"
        type="tel"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        required
        placeholder='+123 456 7890'
      />
      <Input
        label="Contact Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
        placeholder='user@example.com'
      />
      <Button type="submit" fullWidth>
        {selectedDepartment ? 'Update Department' : 'Add Department'}
      </Button>
    </form>
      </Modal>
    </Layout>
  );
};

export default DepartmentsPage;