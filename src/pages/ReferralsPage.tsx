import React from 'react';
import { RefreshCw, Check, X } from 'lucide-react';
import { useHospital } from '../contexts/HospitalContext';
import Layout from '../components/layout/Layout';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const ReferralsPage: React.FC = () => {
  const { referrals, updateReferralStatus } = useHospital();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Badge variant="success">Accepted</Badge>;
      case 'declined':
        return <Badge variant="danger">Declined</Badge>;
      default:
        return <Badge variant="warning">Pending</Badge>;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Referrals</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage incoming patient referrals
          </p>
        </div>

        <div className="bg-white shadow rounded-lg">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Patient Name</Table.Head>
                <Table.Head>Contact</Table.Head>
                <Table.Head>Reason</Table.Head>
                <Table.Head>Referring Doctor</Table.Head>
                <Table.Head>Hospital</Table.Head>
                <Table.Head>Status</Table.Head>
                <Table.Head>Actions</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {referrals.map((referral) => (
                <Table.Row key={referral.id}>
                  <Table.Cell className="font-medium text-gray-900">
                    {referral.patientName}
                  </Table.Cell>
                  <Table.Cell>{referral.patientNumber}</Table.Cell>
                  <Table.Cell>{referral.reason}</Table.Cell>
                  <Table.Cell>{referral.referringDoctor}</Table.Cell>
                  <Table.Cell>{referral.referringHospital}</Table.Cell>
                  <Table.Cell>{getStatusBadge(referral.status)}</Table.Cell>
                  <Table.Cell>
                    {referral.status === 'pending' && (
                      <div className="flex space-x-2">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() =>
                            updateReferralStatus(referral.id, 'accepted')
                          }
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() =>
                            updateReferralStatus(referral.id, 'declined')
                          }
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </Layout>
  );
};

export default ReferralsPage;