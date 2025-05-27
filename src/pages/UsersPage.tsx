import React, { useState } from 'react';
import { Users as UsersIcon, UserPlus, Edit, Power } from 'lucide-react';
import { useHospital } from '../contexts/HospitalContext';
import Layout from '../components/layout/Layout';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';

const UsersPage: React.FC = () => {
  const { users, toggleUserStatus } = useHospital();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your hospital's users and their access
            </p>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>

        <div className="bg-white shadow rounded-lg">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Name</Table.Head>
                <Table.Head>Email</Table.Head>
                <Table.Head>Phone</Table.Head>
                <Table.Head>Role</Table.Head>
                <Table.Head>Status</Table.Head>
                <Table.Head>Actions</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {users.map((user) => (
                <Table.Row key={user.id}>
                  <Table.Cell className="font-medium text-gray-900">
                    {user.name}
                  </Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.phone}</Table.Cell>
                  <Table.Cell>
                    <Badge variant={user.role === 'doctor' ? 'info' : 'default'}>
                      {user.role}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge
                      variant={user.status === 'active' ? 'success' : 'danger'}
                    >
                      {user.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user.id);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={user.status === 'active' ? 'danger' : 'success'}
                        size="sm"
                        onClick={() => toggleUserStatus(user.id)}
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

      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New User"
      >
        {/* Add user form */}
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User"
      >
        {/* Edit user form */}
      </Modal>
    </Layout>
  );
};

export default UsersPage;