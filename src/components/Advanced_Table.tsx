import { useMemo } from 'react';
import { useState, useEffect } from 'react';

import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import {
  Box, Chip, Typography, Switch,
  FormControlLabel,
  Skeleton,
  Tooltip,
  
} from '@mui/material';
import { MonitorHeart, RadioButtonChecked } from '@mui/icons-material';
import { data, type mule_Machine } from './muleMachines';
import bannerImg from '../assets/banner.jpg';

/* ─── Google Font import ─────────────────────────────────────────── */
const poppinsLink = document.createElement('link');
poppinsLink.rel = 'stylesheet';
poppinsLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap';
document.head.appendChild(poppinsLink);

const POPPINS = "'Poppins', sans-serif";

const ADVANCED_ONLY_COLS = ['PID_startTime', 'agentCertExpiry'];

const StatusChip = ({ value }: { value: boolean }) => (
  <Chip
    icon={
      <RadioButtonChecked
        sx={{
          fontSize: '0.65rem !important',
          color: `${value ? '#4ade80' : '#f87171'} !important`,
          ml: '6px !important',
        }}
      />
    }

    label={value ? 'Running' : 'Stopped'}
    size="small"
    sx={{
      fontFamily: POPPINS,
      backgroundColor: value ? '#1b5e2088' : '#b71c1c88',
      color: value ? '#a5d6a7' : '#ef9a9a',
      fontWeight: 600,
      fontSize: '0.68rem',
      letterSpacing: '0.04em',
       border: `1px solid ${value ? 'rgba(74,222,128,0.35)' : 'rgba(248,113,113,0.35)'}`,
       
    }}
  />
);

const Example = () => {

  const [advancedMode, setAdvancedMode] = useState(false);
const [loadingAdvanced, setLoadingAdvanced] = useState(false);


 const handleAdvancedToggle = () => {
  if (!advancedMode) {
    // Turning ON
    setAdvancedMode(true);      // show columns immediately
    setLoadingAdvanced(true);   // start skeleton

    setTimeout(() => {
      setLoadingAdvanced(false); // show real data after 2 sec
    }, 2000);
  } else {
    // Turning OFF
    setAdvancedMode(false);
  }
};

  const columns = useMemo<MRT_ColumnDef<mule_Machine>[]>(() => {

  const baseColumns: MRT_ColumnDef<mule_Machine>[] = [
    {
      accessorKey: 'hostIp',
      header: 'Host IP',
      size: 130,
      Cell: ({ cell }) => (
        <Typography
          sx={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '0.85rem',
            fontWeight: 500,
            color: '#1976d2',
          }}
        >
          {cell.getValue<string>()}
        </Typography>
      ),
    },
    {
      accessorKey: 'server',
      header: 'Server',
      size: 160,
      Cell: ({ cell }) => (
        <Typography
          sx={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          {cell.getValue<string>()}
        </Typography>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      size: 110,
      Cell: ({ cell }) => <StatusChip value={cell.getValue<boolean>()} />,
    },
    {
      accessorKey: 'environment',
      header: 'Environment',
      size: 130,
      Cell: ({ cell }) => {
        const env = cell.getValue<string>();

        const colors: Record<string, { bg: string; text: string }> = {
          Production: { bg: '#e3f2fd', text: '#1565c0' },
          Staging: { bg: '#f3e5f5', text: '#6a1b9a' },
          Development: { bg: '#e8f5e9', text: '#2e7d32' },
          DR: { bg: '#ffebee', text: '#c62828' },
        };

        const s = colors[env] ?? { bg: '#f5f5f5', text: '#424242' };

        return (
          <Chip
            label={env}
            size="small"
            sx={{
              backgroundColor: s.bg,
              color: s.text,
              fontWeight: 600,
              fontSize: '0.75rem',
              fontFamily: 'Poppins, sans-serif',
            }}
          />
        );
      },
    },
    {
      accessorKey: 'cluster',
      header: 'Cluster',
      size: 170,
      Cell: ({ cell }) => (
        <Typography
          sx={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '0.85rem',
            color: '#546e7a',
          }}
        >
          {cell.getValue<string>()}
        </Typography>
      ),
    },
    {
      accessorKey: 'version',
      header: 'Version',
      size: 130,
      Cell: ({ cell }) => (
        <Chip
          label={cell.getValue<string>()}
          size="small"
          variant="outlined"
          sx={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '0.75rem',
          }}
        />
      ),
    },
    {
      accessorKey: 'PCE_certExpiry',
      header: 'PCE Cert Expiry',
      size: 160,
      Cell: ({ cell }) => cell.getValue<string>(),
    },
  ];


  const advancedColumns: MRT_ColumnDef<mule_Machine>[] = [
    {
      accessorKey: 'PID_startTime',
      header: 'PID Start Time',
      size: 180,
      sortingFn: 'datetime',
      Cell: ({ cell }) =>
      loadingAdvanced ? (
        <Skeleton
          variant="text"
          width={140}
          height={24}
          animation="wave"
        />
      ) : (
        new Date(cell.getValue<string>()).toLocaleString()
      ),
    },
    {
      accessorKey: 'agentCertExpiry',
      header: 'Agent Cert Expiry',
      size: 160,
       Cell: ({ cell }) =>
      loadingAdvanced ? (
        <Skeleton
          variant="text"
          width={120}
          height={24}
          animation="wave"
        />
      ) : (
        cell.getValue<string>()
      ),
    },
  ];


  return advancedMode
    ? [...baseColumns, ...advancedColumns]
    : baseColumns;
}, [advancedMode, loadingAdvanced]);

  const table = useMaterialReactTable({
    columns,
    data,
    // Disable all filter features
    enableFilters: false,
    enableColumnFilters: false,
    enableGlobalFilter: false,
    // Disable unused features for faster rendering
    enableColumnOrdering: false,
    enableGrouping: false,
    enableColumnPinning: true,
    enableFacetedValues: false,
    enableRowActions: false,
    enableRowSelection: true,

    // code for pinning
    initialState: {
      showColumnFilters: true,
      showGlobalFilter: true,
      columnPinning: {
        left: ['mrt-row-expand', 'mrt-row-select'],
        // right: ['mrt-row-actions'],
      },
    },

    enableHiding: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,


    // Keep sorting
    enableSorting: true,




    paginationDisplayMode: 'pages',
    muiPaginationProps: {
      color: 'secondary',
      rowsPerPageOptions: [5,10, 20, 30],
      shape: 'rounded',
      variant: 'outlined',
    },


    renderTopToolbar: () => (
      <Box
        sx={{
          width: '100%',
          height: 90,
          backgroundColor: '#ffffff',
          display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      px: 3,
        }}
      >
        {/* Title text */}
        <Typography
          variant="h1"
          sx={{
            fontFamily: 'Poppins, sans-serif',
            color: '#000',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            px: 3,
            fontSize: '2rem',
          }}
        >
          Mule Machine Dashboard
        </Typography>

          <FormControlLabel
  control={
    <Switch
      checked={advancedMode}
      onChange={handleAdvancedToggle}
      color="secondary"
    />
  }
  label="Advanced Monitoring"
/>
      </Box>
    ),



    muiTableHeadProps: {
      sx: {
        // Banner image behind all column headers
        backgroundImage: `url(${bannerImg})`,
        backgroundSize: 'cover',

        backgroundPosition: 'center',
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg,rgba(8,18,70,0.70) 0%,rgba(30,60,200,0.54) 45%,rgba(160,12,30,0.63) 100%)',
          pointerEvents: 'none',
        },
        '& tr': { position: 'relative', zIndex: 1 },
        '& th': { backgroundColor: 'transparent !important' },
      },
    },

    muiTableHeadRowProps: {
      sx: { backgroundColor: 'transparent' },
    },

    muiTableHeadCellProps: {
      sx: {
         fontFamily: 'Poppins, sans-serif',
        backgroundColor: 'transparent !important',
        '&[data-pinned="true"]': {
          backgroundColor: 'transparent !important',
          backdropFilter: 'none',
        },
        color: '#ffffff',
        fontWeight: 700,
        fontSize: '0.85rem',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        borderBottom: '1px solid rgba(255,255,255,0.12)',

        py: 1.8,
        // Sort label
        '& .MuiTableSortLabel-root': { color: '#fff !important' },
        '& .MuiTableSortLabel-root.Mui-active': { color: '#e0e0e0 !important' },
        '& .MuiTableSortLabel-icon': { color: '#fff !important', opacity: 0.7 },
        // Icon buttons (column menu etc.)
        '& .MuiIconButton-root': { color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff' } },
        // Any stray svgs
        '& svg': { color: '#fff' },
      },
    },


    muiTableBodyCellProps: {
  sx: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '0.85rem',
  },
},

muiTableBodyRowProps: ({ row }) => ({
  sx: {
    backgroundColor:
      row.index % 2 === 0
        ? '#ffffff'
        : '#42424317', // soft gray-blue

    transition: 'all 0.2s ease',

    '&:hover': {
      backgroundColor: '#e3f2fd', // soft blue hover
    },
  },
}),
    // Applications detail panel
    renderDetailPanel: ({ row }) => (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700, color: '#90caf9' }}>
          Applications on {row.original.server}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          {row.original.applications.map((app, idx) => (
            <Box
              key={idx}
              sx={{
                border: '1px solid',
                borderColor: app.status ? '#388e3c' : '#c62828',
                borderRadius: '8px',
                p: '10px 16px',
                minWidth: 220,
                backgroundColor: app.status ? '#1b5e2015' : '#b71c1c15',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <StatusChip value={app.status} />
                <Typography sx={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.85rem' }}>
                  {app.name}
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: '#78909c' }}>
                Last deployed: {new Date(app.lastDeployed).toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    ),
  });

  return <MaterialReactTable table={table} />;
};

export default Example;