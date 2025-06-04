import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  FolderPlus, 
  Users, 
  CircleUser, 
  FilePlus2, 
  Bell, 
  Star, 
  RefreshCw
} from 'lucide-react';
import { useHospital } from '../contexts/HospitalContext';
import Layout from '../components/layout/Layout';
import MetricsCard from '../components/dashboard/MetricsCard';
import ActionCard from '../components/dashboard/ActionCard';
import NotificationPreview from '../components/dashboard/NotificationPreview';
import { db } from "../firebase"; // adjust path if needed
import { collection, getCountFromServer, query, where } from "firebase/firestore";

const DashboardPage: React.FC = () => {
  const { hospital, notifications } = useHospital();
    const [metrics, setMetrics] = useState({
    totalMedicalRecords: 0,
    totalDepartments: 0,
    totalUsers: 0,
    totalDoctors: 0,
  });
  

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [medicalSnap, deptSnap, usersSnap, doctorsSnap] = await Promise.all([
          getCountFromServer(collection(db, "medicalRecords")),
          getCountFromServer(query(collection(db, "departments"), where("hospitalId", '==', hospital?.id))),
          getCountFromServer(query(collection(db, "users"), where("hospitalId", '==', hospital?.id))),
          // getCountFromServer(query(collection(db, "users"),where("hospitalId", '==', hospital?.id), where("Role", "==", true)))
          getCountFromServer(query(collection(db, "doctors"),where("hospitalId", '==', hospital?.id),))
        ]);

        setMetrics({
          totalMedicalRecords: medicalSnap.data().count,
          totalDepartments: deptSnap.data().count,
          totalUsers: usersSnap.data().count,
          totalDoctors: doctorsSnap.data().count,
        });
      } catch (err) {
        console.error("Failed to fetch metrics:", err);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome section */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome to {hospital?.name} Admin Panel
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Here's what's happening with your hospital today.
          </p>
        </div>

        {/* Metrics section */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <MetricsCard
            title="Medical Records"
            value={metrics?.totalMedicalRecords || 0}
            icon={<FileText className="h-6 w-6" />}
            // change={{ value: 12, isPositive: true }}
          />
          <MetricsCard
            title="Departments"
            value={metrics?.totalDepartments || 0}
            icon={<FolderPlus className="h-6 w-6" />}
          />
          <MetricsCard
            title="Users"
            value={metrics?.totalUsers || 0}
            icon={<Users className="h-6 w-6" />}
            // change={{ value: 8, isPositive: true }}
          />
          <MetricsCard
            title="Doctors"
            value={metrics?.totalDoctors || 0}
            icon={<CircleUser className="h-6 w-6" />}
            // change={{ value: 5, isPositive: true }}
          />
        </div>

        {/* Quick actions section */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <ActionCard
              title="Add Department"
              description="Create a new department in your hospital"
              icon={<FolderPlus className="h-6 w-6" />}
              path="/departments/new"
            />
            <ActionCard
              title="Manage Users"
              description="Add, edit, or manage user accounts"
              icon={<Users className="h-6 w-6" />}
              path="/users"
            />
            <ActionCard
              title="View Medical Records"
              description="Access and manage patient medical records"
              icon={<FileText className="h-6 w-6" />}
              path="/medical-records"
            />
            <ActionCard
              title="Manage Doctors"
              description="Add, edit, or manage doctor profiles"
              icon={<CircleUser className="h-6 w-6" />}
              path="/doctors"
            />
            <ActionCard
              title="Add Services"
              description="Create new hospital services and forum posts"
              icon={<FilePlus2 className="h-6 w-6" />}
              path="/services/new"
            />
            <ActionCard
              title="View Referrals"
              description="Manage incoming patient referrals"
              icon={<RefreshCw className="h-6 w-6" />}
              path="/referrals"
            />
          </div>
        </div>

        {/* Bottom section */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Notifications preview */}
          <NotificationPreview notifications={notifications} />

          {/* Hospital ratings summary */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Hospital Ratings
                </h3>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="ml-1 text-lg font-semibold text-gray-900">4.2</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-500">Excellent (5)</div>
                      <div className="text-sm font-medium text-gray-500">35%</div>
                    </div>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-500">Good (4)</div>
                      <div className="text-sm font-medium text-gray-500">45%</div>
                    </div>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-500">Average (3)</div>
                      <div className="text-sm font-medium text-gray-500">15%</div>
                    </div>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-500">Poor (1-2)</div>
                      <div className="text-sm font-medium text-gray-500">5%</div>
                    </div>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '5%' }}></div>
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => window.location.href = '/ratings'}
                  >
                    View detailed ratings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;