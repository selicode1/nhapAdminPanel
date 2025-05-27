import React, { useState } from 'react';
import { FileText, Search, Plus } from 'lucide-react';
import { useHospital } from '../contexts/HospitalContext';
import Layout from '../components/layout/Layout';
import Table from '../components/ui/Table';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

const MedicalRecordsPage: React.FC = () => {
  const { medicalRecords, doctors } = useHospital();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);

  const filteredRecords = medicalRecords.filter(
    (record) =>
      record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
            <p className="mt-1 text-sm text-gray-500">
              View and manage patient medical records
            </p>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Record
          </Button>
        </div>

        <div className="flex space-x-4">
          <Input
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
            icon={<Search className="w-4 h-4 text-gray-400" />}
          />
        </div>

        <div className="bg-white shadow rounded-lg">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Patient Name</Table.Head>
                <Table.Head>Record ID</Table.Head>
                <Table.Head>Diagnosis</Table.Head>
                <Table.Head>Assigned Doctor</Table.Head>
                <Table.Head>Last Updated</Table.Head>
                <Table.Head>Actions</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredRecords.map((record) => {
                const assignedDoctor = doctors.find(
                  (d) => d.id === record.assignedDoctorId
                );
                return (
                  <Table.Row key={record.id}>
                    <Table.Cell className="font-medium text-gray-900">
                      {record.patientName}
                    </Table.Cell>
                    <Table.Cell>{record.id}</Table.Cell>
                    <Table.Cell>{record.diagnosis}</Table.Cell>
                    <Table.Cell>{assignedDoctor?.name || 'Unassigned'}</Table.Cell>
                    <Table.Cell>
                      {new Date(record.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRecord(record.id)}
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </div>
      </div>

      {/* Add Record Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Medical Record"
      >
        {/* Add record form */}
      </Modal>

      {/* View Record Modal */}
      <Modal
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        title="Medical Record Details"
      >
        {/* Record details */}
      </Modal>
    </Layout>
  );
};

export default MedicalRecordsPage;