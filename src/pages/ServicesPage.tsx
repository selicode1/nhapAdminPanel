import React, { useState } from 'react';
import { FilePlus2, MessageSquare, Edit, Trash } from 'lucide-react';
import { useHospital } from '../contexts/HospitalContext';
import Layout from '../components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

const ServicesPage: React.FC = () => {
  const { services, addService } = useHospital();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Services</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage hospital services and forum posts
            </p>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center"
          >
            <FilePlus2 className="w-4 h-4 mr-2" />
            Add Service
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{service.name}</span>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedService(service.id);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Available Days
                    </h4>
                    <p className="mt-1">{service.daysAvailable.join(', ')}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Time Slots
                    </h4>
                    <p className="mt-1">{service.timeSlots.join(', ')}</p>
                  </div>
                  {service.forumPost && (
                    <div className="pt-4 border-t">
                      <div className="flex items-center text-blue-600">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">Forum Post</span>
                      </div>
                      <h5 className="mt-2 font-medium">{service.forumPost.title}</h5>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                        {service.forumPost.content}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Add Service Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Service"
        size="lg"
      >
        {/* Add service form */}
      </Modal>

      {/* Edit Service Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Service"
        size="lg"
      >
        {/* Edit service form */}
      </Modal>
    </Layout>
  );
};

export default ServicesPage;