export type mule_Machine = {
  hostIp: string;
  status: boolean;
  server: string;
  version: string;
  environment: string;
  cluster: string;
  PID_startTime: string;
  agentCertExpiry: string;
  PCE_certExpiry: string;
  applications: {
    status: boolean;
    name: string;
    lastDeployed: string;
  }[];
};

export const data: mule_Machine[] = [
  {
    hostIp: '10.0.1.101',
    status: true,
    server: 'mule-prod-01',
    version: '4.6.1',
    environment: 'Production',
    cluster: 'cluster-us-east',
    PID_startTime: '2024-11-15T08:23:00Z',
    agentCertExpiry: '2025-12-01',
    PCE_certExpiry: '2025-11-20',
    applications: [
      { status: true, name: 'order-management-api', lastDeployed: '2024-12-10T14:30:00Z' },
      { status: true, name: 'payment-gateway', lastDeployed: '2024-12-08T09:15:00Z' },
      { status: false, name: 'legacy-sync-service', lastDeployed: '2024-10-01T11:00:00Z' },
    ],
  },
  {
    hostIp: '10.0.1.102',
    status: true,
    server: 'mule-prod-02',
    version: '4.6.1',
    environment: 'Production',
    cluster: 'cluster-us-east',
    PID_startTime: '2024-11-15T08:25:00Z',
    agentCertExpiry: '2025-12-01',
    PCE_certExpiry: '2025-11-20',
    applications: [
      { status: true, name: 'customer-profile-api', lastDeployed: '2024-12-09T16:00:00Z' },
      { status: true, name: 'notification-service', lastDeployed: '2024-12-07T10:45:00Z' },
    ],
  },
  {
    hostIp: '10.0.2.201',
    status: false,
    server: 'mule-staging-01',
    version: '4.6.2',
    environment: 'Staging',
    cluster: 'cluster-us-west',
    PID_startTime: '2024-12-01T06:00:00Z',
    agentCertExpiry: '2026-01-15',
    PCE_certExpiry: '2026-01-10',
    applications: [
      { status: false, name: 'inventory-api', lastDeployed: '2024-12-11T13:20:00Z' },
      { status: true, name: 'reporting-service', lastDeployed: '2024-12-05T08:00:00Z' },
    ],
  },
  {
    hostIp: '10.0.3.50',
    status: true,
    server: 'mule-dev-01',
    version: '4.7.0-SNAPSHOT',
    environment: 'Development',
    cluster: 'cluster-dev',
    PID_startTime: '2024-12-10T09:10:00Z',
    agentCertExpiry: '2026-06-01',
    PCE_certExpiry: '2026-05-25',
    applications: [
      { status: true, name: 'auth-service-v2', lastDeployed: '2024-12-12T17:00:00Z' },
    ],
  },
  {
    hostIp: '10.0.1.103',
    status: true,
    server: 'mule-prod-03',
    version: '4.6.0',
    environment: 'Production',
    cluster: 'cluster-eu-west',
    PID_startTime: '2024-10-20T12:00:00Z',
    agentCertExpiry: '2025-03-15',
    PCE_certExpiry: '2025-03-01',
    applications: [
      { status: true, name: 'eu-compliance-api', lastDeployed: '2024-11-30T10:00:00Z' },
      { status: true, name: 'gdpr-service', lastDeployed: '2024-11-28T14:30:00Z' },
      { status: false, name: 'data-migration-tool', lastDeployed: '2024-09-15T08:00:00Z' },
    ],
  },
  {
    hostIp: '10.0.2.202',
    status: true,
    server: 'mule-staging-02',
    version: '4.6.2',
    environment: 'Staging',
    cluster: 'cluster-us-west',
    PID_startTime: '2024-12-02T07:30:00Z',
    agentCertExpiry: '2026-01-15',
    PCE_certExpiry: '2026-01-10',
    applications: [
      { status: true, name: 'search-api', lastDeployed: '2024-12-10T11:00:00Z' },
    ],
  },
  {
    hostIp: '10.0.4.10',
    status: false,
    server: 'mule-dr-01',
    version: '4.5.3',
    environment: 'DR',
    cluster: 'cluster-dr',
    PID_startTime: '2024-08-01T00:00:00Z',
    agentCertExpiry: '2025-01-10',
    PCE_certExpiry: '2025-01-05',
    applications: [
      { status: false, name: 'failover-router', lastDeployed: '2024-08-01T00:00:00Z' },
      { status: false, name: 'backup-sync', lastDeployed: '2024-08-01T00:00:00Z' },
    ],
  },
];