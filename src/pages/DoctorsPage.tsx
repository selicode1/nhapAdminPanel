import React, { useState } from 'react';
import { CircleUser, Plus, Edit, Power, Calendar } from 'lucide-react';
import { useHospital } from '../contexts/HospitalContext';
import Layout from '../components/layout/Layout';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Select from '../components/ui/Select';

const DoctorsPage: React.FC = () => {
  const { doctors, departments, toggleDoctorStatus } = useHospital();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);

  const getDepartmentName = (departmentId: string) => {
    return departments.find(d => d.id === departmentId)?.name || 'Unknown';
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Doctors</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage hospital doctors and their schedules
            </p>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Doctor
          </Button>
        </div>

        <div className="bg-white shadow rounded-lg">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Name</Table.Head>
                <Table.Head>Department</Table.Head>
                <Table.Head>Title</Table.Head>
                <Table.Head>Experience</Table.Head>
                <Table.Head>Status</Table.Head>
                <Table.Head>Actions</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {doctors.map((doctor) => (
                <Table.Row key={doctor.id}>
                  <Table.Cell className="font-medium text-gray-900">
                    {doctor.name}
                  </Table.Cell>
                  <Table.Cell>{getDepartmentName(doctor.departmentId)}</Table.Cell>
                  <Table.Cell>{doctor.title}</Table.Cell>
                  <Table.Cell>{doctor.experience} years</Table.Cell>
                  <Table.Cell>
                    <Badge
                      variant={doctor.status === 'active' ? 'success' : 'danger'}
                    >
                      {doctor.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedDoctor(doctor.id);
                          setIsScheduleModalOpen(true);
                        }}
                      >
                        <Calendar className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedDoctor(doctor.id);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={doctor.status === 'active' ? 'danger' : 'success'}
                        size="sm"
                        onClick={() => toggleDoctorStatus(doctor.id)}
                      >
                        <Power className="w-4 h-4" />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>

      {/* Add Doctor Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Doctor"
        size="lg"
      >
        {/* Add doctor form */}
      </Modal>

      {/* Edit Doctor Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Doctor"
        size="lg"
      >
        {/* Edit doctor form */}
      </Modal>

      {/* Schedule Modal */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        title="Manage Schedule"
        size="xl"
      >
        {/* Schedule management form */}
      </Modal>
    </Layout>
  );
};

export default DoctorsPage;