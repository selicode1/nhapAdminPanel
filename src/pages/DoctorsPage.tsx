import React, { useState } from 'react';
import { CircleUser, Plus, Edit, Power, Calendar } from 'lucide-react';
import { useHospital } from '../contexts/HospitalContext';
import Layout from '../components/layout/Layout';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

const DoctorsPage: React.FC = () => {
  const { doctors, departments, toggleDoctorStatus, addDoctor, updateDoctor } = useHospital();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    title: '',
    experience: '',
    departmentId: '',
    region: '',
  });
  const [scheduleData, setScheduleData] = useState({
    activeDays: [] as string[],
    offDays: [] as string[],
    shifts: [] as { day: string; startTime: string; endTime: string }[],
    shiftStartDate: '',
    shiftSwitchTimes: [] as string[],
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

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDoctor) {
      const doctor = doctors.find(d => d.id === selectedDoctor);
      if (doctor) {
        updateDoctor({
          ...doctor,
          ...formData,
          experience: parseInt(formData.experience),
        });
      }
      setIsEditModalOpen(false);
    } else {
      await addDoctor({
        ...formData,
        experience: parseInt(formData.experience),
        status: 'active',
        schedule: {
          activeDays: [],
          offDays: [],
          shifts: [],
          shiftStartDate: new Date().toISOString(),
          shiftSwitchTimes: [],
        },
      });
      setIsAddModalOpen(false);
    }
    setFormData({
      name: '',
      email: '',
      phone: '',
      title: '',
      experience: '',
      departmentId: '',
      region: '',
    });
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const doctor = doctors.find(d => d.id === selectedDoctor);
    if (doctor) {
      updateDoctor({
        ...doctor,
        schedule: scheduleData,
      });
    }
    setIsScheduleModalOpen(false);
  };

  // const DoctorForm = () => (
  //   <form onSubmit={handleSubmit} className="space-y-4">
  //     <Input
  //       label="Name"
  //       value={formData.name}
  //       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
  //       required
  //     />
  //     <Input
  //       label="Email"
  //       type="email"
  //       value={formData.email}
  //       onChange={(e) => setFormData({ ...formData, email: e.target.value })}
  //       required
  //     />
  //     <Input
  //       label="Phone"
  //       type="tel"
  //       value={formData.phone}
  //       onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
  //       required
  //     />
  //     <Input
  //       label="Title"
  //       value={formData.title}
  //       onChange={(e) => setFormData({ ...formData, title: e.target.value })}
  //       required
  //     />
  //     <Input
  //       label="Experience (years)"
  //       type="number"
  //       value={formData.experience}
  //       onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
  //       required
  //     />
  //     <Select
  //       label="Department"
  //       value={formData.departmentId}
  //       onChange={(value) => setFormData({ ...formData, departmentId: value })}
  //       options={departments.map(dept => ({
  //         value: dept.id,
  //         label: dept.name,
  //       }))}
  //       required
  //     />
  //     <Input
  //       label="Region"
  //       value={formData.region}
  //       onChange={(e) => setFormData({ ...formData, region: e.target.value })}
  //       required
  //     />
  //     <Button type="submit" fullWidth>
  //       {selectedDoctor ? 'Update Doctor' : 'Add Doctor'}
  //     </Button>
  //   </form>
  // );

  const ScheduleForm = () => (
    <form onSubmit={handleScheduleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Active Days</h3>
        <div className="grid grid-cols-2 gap-4">
          {daysOfWeek.map((day) => (
            <label key={day} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={scheduleData.activeDays.includes(day)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setScheduleData({
                      ...scheduleData,
                      activeDays: [...scheduleData.activeDays, day],
                      offDays: scheduleData.offDays.filter(d => d !== day),
                    });
                  } else {
                    setScheduleData({
                      ...scheduleData,
                      activeDays: scheduleData.activeDays.filter(d => d !== day),
                      offDays: [...scheduleData.offDays, day],
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

      <div>
        <h3 className="text-lg font-medium mb-4">Shifts</h3>
        {scheduleData.activeDays.map((day) => (
          <div key={day} className="mb-4">
            <h4 className="font-medium mb-2">{day}</h4>
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Start Time"
                value={scheduleData.shifts.find(s => s.day === day)?.startTime || ''}
                onChange={(value) => {
                  const shifts = [...scheduleData.shifts];
                  const existingShift = shifts.findIndex(s => s.day === day);
                  if (existingShift >= 0) {
                    shifts[existingShift] = { ...shifts[existingShift], startTime: value };
                  } else {
                    shifts.push({ day, startTime: value, endTime: '' });
                  }
                  setScheduleData({ ...scheduleData, shifts });
                }}
                options={timeSlots.map(time => ({ value: time, label: time }))}
              />
              <Select
                label="End Time"
                value={scheduleData.shifts.find(s => s.day === day)?.endTime || ''}
                onChange={(value) => {
                  const shifts = [...scheduleData.shifts];
                  const existingShift = shifts.findIndex(s => s.day === day);
                  if (existingShift >= 0) {
                    shifts[existingShift] = { ...shifts[existingShift], endTime: value };
                  } else {
                    shifts.push({ day, startTime: '', endTime: value });
                  }
                  setScheduleData({ ...scheduleData, shifts });
                }}
                options={timeSlots.map(time => ({ value: time, label: time }))}
              />
            </div>
          </div>
        ))}
      </div>

      <div>
        <Input
          label="Shift Start Date"
          type="date"
          value={scheduleData.shiftStartDate.split('T')[0]}
          onChange={(e) => setScheduleData({
            ...scheduleData,
            shiftStartDate: new Date(e.target.value).toISOString(),
          })}
          required
        />
      </div>

      <Button type="submit" fullWidth>
        Save Schedule
      </Button>
    </form>
  );

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
                  <Table.Cell>
                    {departments.find(d => d.id === doctor.departmentId)?.name}
                  </Table.Cell>
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
                          setScheduleData(doctor.schedule);
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
                          setFormData({
                            name: doctor.name,
                            email: doctor.email,
                            phone: doctor.phone,
                            title: doctor.title,
                            experience: doctor.experience.toString(),
                            departmentId: doctor.departmentId,
                            region: doctor.region,
                          });
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
        onClose={() => {
          setIsAddModalOpen(false);
          setFormData({
            name: '',
            email: '',
            phone: '',
            title: '',
            experience: '',
            departmentId: '',
            region: '',
          });
        }}
        title="Add New Doctor"
        size="lg"
      >
            <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <Input
        label="Phone"
        type="tel"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        required
      />
      <Input
        label="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />
      <Input
        label="Experience (years)"
        type="number"
        value={formData.experience}
        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
        required
      />
      <Select
        label="Department"
        value={formData.departmentId}
        onChange={(value) => setFormData({ ...formData, departmentId: value })}
        options={departments.map(dept => ({
          value: dept.id,
          label: dept.name,
        }))}
        required
      />
      <Input
        label="Region"
        value={formData.region}
        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
        required
      />
      <Button type="submit" fullWidth>
        {selectedDoctor ? 'Update Doctor' : 'Add Doctor'}
      </Button>
    </form>
      </Modal>

      {/* Edit Doctor Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedDoctor(null);
          setFormData({
            name: '',
            email: '',
            phone: '',
            title: '',
            experience: '',
            departmentId: '',
            region: '',
          });
        }}
        title="Edit Doctor"
        size="lg"
      >
            <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <Input
        label="Phone"
        type="tel"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        required
      />
      <Input
        label="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />
      <Input
        label="Experience (years)"
        type="number"
        value={formData.experience}
        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
        required
      />
      <Select
        label="Department"
        value={formData.departmentId}
        onChange={(value) => setFormData({ ...formData, departmentId: value })}
        options={departments.map(dept => ({
          value: dept.id,
          label: dept.name,
        }))}
        required
      />
      <Input
        label="Region"
        value={formData.region}
        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
        required
      />
      <Button type="submit" fullWidth>
        {selectedDoctor ? 'Update Doctor' : 'Add Doctor'}
      </Button>
    </form>
      </Modal>

      {/* Schedule Modal */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => {
          setIsScheduleModalOpen(false);
          setSelectedDoctor(null);
          setScheduleData({
            activeDays: [],
            offDays: [],
            shifts: [],
            shiftStartDate: '',
            shiftSwitchTimes: [],
          });
        }}
        title="Manage Schedule"
        size="xl"
      >
        <ScheduleForm />
      </Modal>
    </Layout>
  );
};

export default DoctorsPage;