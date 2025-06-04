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
  const { services, addService, updateService } = useHospital();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    daysAvailable: [] as string[],
    timeSlots: '',
    forumPost: {
      title: '',
      content: '',
    },
  });

  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  // const timeSlots = Array.from({ length: 24 }, (_, i) => {
  //   const hour = i.toString().padStart(2, '0');
  //   return `${hour}:00`;
  // });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedService) {
      const service = services.find(s => s.id === selectedService);
      if (service) {
        updateService({
          ...service,
          ...formData,
          forumPost: formData.forumPost.title && formData.forumPost.content
            ? {
                id: service.forumPost?.id || `post-${Date.now()}`,
                title: formData.forumPost.title,
                content: formData.forumPost.content,
                createdAt: service.forumPost?.createdAt || new Date().toISOString(),
              }
            : undefined,
        });
      }
      setIsEditModalOpen(false);
    } else {
      await addService({
        ...formData,
        forumPost: formData.forumPost.title && formData.forumPost.content
          ? {
              id: `post-${Date.now()}`,
              title: formData.forumPost.title,
              content: formData.forumPost.content,
              createdAt: new Date().toISOString(),
            }
          : undefined,
      });
      setIsAddModalOpen(false);
    }
    setFormData({
      name: '',
      daysAvailable: [],
      timeSlots: '',
      forumPost: {
        title: '',
        content: '',
      },
    });
  };

  // const ServiceForm = () => (
  //   <form onSubmit={handleSubmit} className="space-y-6">
  //     <Input
  //       label="Service Name"
  //       value={formData.name}
  //       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
  //       required
  //     />

  //     <div>
  //       <label className="block text-sm font-medium text-gray-700 mb-2">
  //         Available Days
  //       </label>
  //       <div className="grid grid-cols-2 gap-4">
  //         {daysOfWeek.map((day) => (
  //           <label key={day} className="flex items-center space-x-2">
  //             <input
  //               type="checkbox"
  //               checked={formData.daysAvailable.includes(day)}
  //               onChange={(e) => {
  //                 if (e.target.checked) {
  //                   setFormData({
  //                     ...formData,
  //                     daysAvailable: [...formData.daysAvailable, day],
  //                   });
  //                 } else {
  //                   setFormData({
  //                     ...formData,
  //                     daysAvailable: formData.daysAvailable.filter(d => d !== day),
  //                   });
  //                 }
  //               }}
  //               className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
  //             />
  //             <span>{day}</span>
  //           </label>
  //         ))}
  //       </div>
  //     </div>


  //     <Input
  //       label="Time Slots (e.g., 09:00-17:00)"
  //       value={formData.timeSlots}
  //       onChange={(e) => setFormData({ ...formData, timeSlots: e.target.value })}
  //       required
  //     />


  //     {/* <div className="space-y-4">
  //       <h3 className="text-lg font-medium">Forum Post (Optional)</h3>
  //       <Input
  //         label="Post Title"
  //         value={formData.forumPost.title}
  //         onChange={(e) =>
  //           setFormData({
  //             ...formData,
  //             forumPost: { ...formData.forumPost, title: e.target.value },
  //           })
  //         }
  //       />
  //       <div>
  //         <label className="block text-sm font-medium text-gray-700 mb-2">
  //           Post Content
  //         </label>
  //         <textarea
  //           value={formData.forumPost.content}
  //           onChange={(e) =>
  //             setFormData({
  //               ...formData,
  //               forumPost: { ...formData.forumPost, content: e.target.value },
  //             })
  //           }
  //           rows={4}
  //           className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
  //         />
  //       </div>
  //     </div> */}

  //     <Button type="submit" fullWidth>
  //       {selectedService ? 'Update Service' : 'Add Service'}
  //     </Button>
  //   </form>
  // );

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
                        setFormData({
                          name: service.name,
                          daysAvailable: service.daysAvailable,
                          timeSlots: service.timeSlots,
                          forumPost: {
                            title: service.forumPost?.title || '',
                            content: service.forumPost?.content || '',
                          },
                        });
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
                    <p className="mt-1">{service.timeSlots}</p>
                  </div>
                  {service.forumPost && (
                    <div className="pt-4 border-t">
                      <div className="flex items-center text-blue-600">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">Forum Post</span>
                      </div>
                      <h5 className="mt-2 font-medium">
                        {service.forumPost.title}
                      </h5>
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
        onClose={() => {
          setIsAddModalOpen(false);
          setFormData({
            name: '',
            daysAvailable: [],
            timeSlots: '',
            forumPost: {
              title: '',
              content: '',
            },
          });
        }}
        title="Add New Service"
        size="lg"
      >
            <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Service Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Available Days
        </label>
        <div className="grid grid-cols-2 gap-4">
          {daysOfWeek.map((day) => (
            <label key={day} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.daysAvailable.includes(day)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({
                      ...formData,
                      daysAvailable: [...formData.daysAvailable, day],
                    });
                  } else {
                    setFormData({
                      ...formData,
                      daysAvailable: formData.daysAvailable.filter(d => d !== day),
                    });
                  }
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>{day}</span>
            </label>
          ))}
        </div>
      </div>


      <Input
        label="Time Slots (e.g., 09:00-17:00)"
        value={formData.timeSlots}
        onChange={(e) => setFormData({ ...formData, timeSlots: e.target.value })}
        required
      />


      <div className="space-y-4">
        <h3 className="text-lg font-medium">Forum Post (Optional)</h3>
        <Input
          label="Post Title"
          value={formData.forumPost.title}
          onChange={(e) =>
            setFormData({
              ...formData,
              forumPost: { ...formData.forumPost, title: e.target.value },
            })
          }
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Post Content
          </label>
          <textarea
            value={formData.forumPost.content}
            onChange={(e) =>
              setFormData({
                ...formData,
                forumPost: { ...formData.forumPost, content: e.target.value },
              })
            }
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <Button type="submit" fullWidth>
        {selectedService ? 'Update Service' : 'Add Service'}
      </Button>
    </form>
      </Modal>

      {/* Edit Service Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedService(null);
          setFormData({
            name: '',
            daysAvailable: [],
            timeSlots: '',
            forumPost: {
              title: '',
              content: '',
            },
          });
        }}
        title="Edit Service"
        size="lg"
      >
            <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Service Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Available Days
        </label>
        <div className="grid grid-cols-2 gap-4">
          {daysOfWeek.map((day) => (
            <label key={day} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.daysAvailable.includes(day)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({
                      ...formData,
                      daysAvailable: [...formData.daysAvailable, day],
                    });
                  } else {
                    setFormData({
                      ...formData,
                      daysAvailable: formData.daysAvailable.filter(d => d !== day),
                    });
                  }
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>{day}</span>
            </label>
          ))}
        </div>
      </div>


      <Input
        label="Time Slots (e.g., 09:00-17:00)"
        value={formData.timeSlots}
        onChange={(e) => setFormData({ ...formData, timeSlots: e.target.value })}
        required
      />


      <div className="space-y-4">
        <h3 className="text-lg font-medium">Forum Post (Optional)</h3>
        <Input
          label="Post Title"
          value={formData.forumPost.title}
          onChange={(e) =>
            setFormData({
              ...formData,
              forumPost: { ...formData.forumPost, title: e.target.value },
            })
          }
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Post Content
          </label>
          <textarea
            value={formData.forumPost.content}
            onChange={(e) =>
              setFormData({
                ...formData,
                forumPost: { ...formData.forumPost, content: e.target.value },
              })
            }
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <Button type="submit" fullWidth>
        {selectedService ? 'Update Service' : 'Add Service'}
      </Button>
    </form>
      </Modal>
    </Layout>
  );
};

export default ServicesPage;