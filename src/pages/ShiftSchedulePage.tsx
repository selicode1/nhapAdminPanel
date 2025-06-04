import React, { useState } from 'react';
import { Search, Edit } from 'lucide-react';
import { useHospital } from '../contexts/HospitalContext';
import Layout from '../components/layout/Layout';
import Table from '../components/ui/Table';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Select from '../components/ui/Select';

const ShiftSchedulePage: React.FC = () => {
  const { doctors, departments, updateDoctor } = useHospital();
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [scheduleData, setScheduleData] = useState({
    shiftType: 'morning',
    workingDays: 5,
    offDays: 2,
    totalShifts: 1,
    shiftStartTime: '09:00',
    rotationFrequency: 7,
  });

  const shiftTypes = [
    { value: 'morning', label: 'Morning Shift (6 AM - 2 PM)' },
    { value: 'afternoon', label: 'Afternoon Shift (2 PM - 10 PM)' },
    { value: 'evening', label: 'Evening Shift (10 PM - 6 AM)' },
    { value: 'full', label: 'Full Day (9 AM - 5 PM)' },
  ];

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      departments.find(d => d.id === doctor.departmentId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const doctor = doctors.find(d => d.id === selectedDoctor);
    if (doctor) {
      const shiftTimes = {
        morning: { start: '06:00', end: '14:00' },
        afternoon: { start: '14:00', end: '22:00' },
        evening: { start: '22:00', end: '06:00' },
        full: { start: '09:00', end: '17:00' },
      };

      const selectedShift = shiftTimes[scheduleData.shiftType as keyof typeof shiftTimes];

      updateDoctor({
        ...doctor,
        schedule: {
          activeDays: Array.from({ length: scheduleData.workingDays }, (_, i) => 
            ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][i]
          ),
          offDays: Array.from({ length: scheduleData.offDays }, (_, i) => 
            ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][scheduleData.workingDays + i]
          ),
          shifts: Array.from({ length: scheduleData.workingDays }, (_, i) => ({
            day: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][i],
            startTime: selectedShift.start,
            endTime: selectedShift.end,
          })),
          shiftStartDate: new Date().toISOString(),
          shiftSwitchTimes: [selectedShift.start, selectedShift.end],
        },
      });
    }
    setIsEditModalOpen(false);
  };

  const getShiftDisplay = (doctor: typeof doctors[0]) => {
    if (doctor.schedule.shifts.length === 0) return 'No shifts assigned';
    
    const shift = doctor.schedule.shifts[0];
    const startTime = new Date(`2000-01-01T${shift.startTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endTime = new Date(`2000-01-01T${shift.endTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return `${startTime} - ${endTime}`;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shift Schedule</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage doctor shift schedules and rotations
          </p>
        </div>

        <div className="flex space-x-4">
          <Input
            placeholder="Search doctors or departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
            // icon={<Search className="w-4 h-4 text-gray-400" />}
          />
        </div>

        <div className="bg-white shadow rounded-lg">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Doctor Name</Table.Head>
                <Table.Head>Department</Table.Head>
                <Table.Head>Current Shift</Table.Head>
                <Table.Head>Working Days</Table.Head>
                <Table.Head>Off Days</Table.Head>
                <Table.Head>Actions</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredDoctors.map((doctor) => (
                <Table.Row key={doctor.id}>
                  <Table.Cell className="font-medium text-gray-900">
                    {doctor.name}
                  </Table.Cell>
                  <Table.Cell>
                    {departments.find(d => d.id === doctor.departmentId)?.name}
                  </Table.Cell>
                  <Table.Cell>{getShiftDisplay(doctor)}</Table.Cell>
                  <Table.Cell>{doctor.schedule.activeDays.join(', ')}</Table.Cell>
                  <Table.Cell>{doctor.schedule.offDays.join(', ')}</Table.Cell>
                  <Table.Cell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedDoctor(doctor.id);
                        setScheduleData({
                          shiftType: 'morning',
                          workingDays: doctor.schedule.activeDays.length,
                          offDays: doctor.schedule.offDays.length,
                          totalShifts: doctor.schedule.shifts.length,
                          shiftStartTime: doctor.schedule.shifts[0]?.startTime || '09:00',
                          rotationFrequency: 7,
                        });
                        setIsEditModalOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>

      {/* Edit Schedule Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedDoctor(null);
        }}
        title="Edit Shift Schedule"
        size="lg"
      >
        <form onSubmit={handleScheduleSubmit} className="space-y-6">
          <Select
            label="Shift Type"
            value={scheduleData.shiftType}
            onChange={(value) => setScheduleData({ ...scheduleData, shiftType: value })}
            options={shiftTypes}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              label="Working Days"
              min={1}
              max={7}
              value={scheduleData.workingDays}
              onChange={(e) => setScheduleData({ ...scheduleData, workingDays: parseInt(e.target.value) })}
            />
            <Input
              type="number"
              label="Off Days"
              min={0}
              max={7}
              value={scheduleData.offDays}
              onChange={(e) => setScheduleData({ ...scheduleData, offDays: parseInt(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              label="Total Shifts"
              min={1}
              max={3}
              value={scheduleData.totalShifts}
              onChange={(e) => setScheduleData({ ...scheduleData, totalShifts: parseInt(e.target.value) })}
            />
            <Input
              type="number"
              label="Rotation Frequency (days)"
              min={1}
              value={scheduleData.rotationFrequency}
              onChange={(e) => setScheduleData({ ...scheduleData, rotationFrequency: parseInt(e.target.value) })}
            />
          </div>

          <Input
            type="time"
            label="Shift Start Time"
            value={scheduleData.shiftStartTime}
            onChange={(e) => setScheduleData({ ...scheduleData, shiftStartTime: e.target.value })}
          />

          <Button type="submit" fullWidth>
            Save Schedule
          </Button>
        </form>
      </Modal>
    </Layout>
  );
};

export default ShiftSchedulePage;