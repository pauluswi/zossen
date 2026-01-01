import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TablePagination from '@mui/material/TablePagination';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import { visuallyHidden } from '@mui/utils';

// Data Interface
export interface AuditLogEntry {
  id: number;
  timestamp: string;
  userId: string;
  role: string;
  action: string;
  entityType: string;
  entityRef: string;
  result: string;
  channel: string;
  ipAddress: string;
  snapshot?: {
    before?: any;
    after?: any;
  };
}

// Sorting Types
type Order = 'asc' | 'desc';

// Comparator Functions
function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Head Cells Configuration
interface HeadCell {
  id: keyof AuditLogEntry;
  label: string;
}

const headCells: readonly HeadCell[] = [
  { id: 'timestamp', label: 'Timestamp' },
  { id: 'userId', label: 'User ID' },
  { id: 'role', label: 'Role' },
  { id: 'action', label: 'Action' },
  { id: 'entityType', label: 'Entity Type' },
  { id: 'entityRef', label: 'Entity Ref' },
  { id: 'result', label: 'Result' },
  { id: 'channel', label: 'Channel' },
];

interface AuditTrailProps {
  logs: AuditLogEntry[];
}

export default function AuditTrail({ logs }: AuditTrailProps) {
  // Filters
  const [userId, setUserId] = React.useState('');
  const [role, setRole] = React.useState('ALL');
  const [action, setAction] = React.useState('ALL');
  const [entityType, setEntityType] = React.useState('ALL');

  // Pagination & Sorting
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [order, setOrder] = React.useState<Order>('desc');
  const [orderBy, setOrderBy] = React.useState<keyof AuditLogEntry>('timestamp');

  // Drawer
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selectedLog, setSelectedLog] = React.useState<AuditLogEntry | null>(null);

  // Filter Logic
  const filteredLogs = logs.filter((log) => {
    if (userId && !log.userId.includes(userId)) return false;
    if (role !== 'ALL' && log.role !== role) return false;
    if (action !== 'ALL' && log.action !== action) return false;
    if (entityType !== 'ALL' && log.entityType !== entityType) return false;
    return true;
  });

  // Sorting Logic
  const sortedLogs = React.useMemo(() => {
     return filteredLogs.sort(getComparator(order, orderBy));
  }, [filteredLogs, order, orderBy]);

  // Pagination Logic
  const paginatedLogs = sortedLogs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleRequestSort = (property: keyof AuditLogEntry) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (log: AuditLogEntry) => {
    setSelectedLog(log);
    setDrawerOpen(true);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" component="h2" color="primary" gutterBottom>
        Audit Trail
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={2}>
                <TextField
                label="User ID"
                fullWidth
                value={userId}
                onChange={(e) => {
                    setUserId(e.target.value);
                    setPage(0);
                }}
                />
            </Grid>
            <Grid item xs={12} md={2}>
                <TextField
                label="Start Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                defaultValue="2026-01-01"
                />
            </Grid>
            <Grid item xs={12} md={2}>
                <TextField
                label="End Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                defaultValue="2026-01-31"
                />
            </Grid>
            <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                    value={role}
                    label="Role"
                    onChange={(e) => {
                        setRole(e.target.value as string);
                        setPage(0);
                    }}
                >
                    <MenuItem value="ALL">All</MenuItem>
                    <MenuItem value="OPS">OPS</MenuItem>
                    <MenuItem value="SUPERVISOR">Supervisor</MenuItem>
                    <MenuItem value="SYSTEM">System</MenuItem>
                </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                <InputLabel>Action</InputLabel>
                <Select
                    value={action}
                    label="Action"
                    onChange={(e) => {
                        setAction(e.target.value as string);
                        setPage(0);
                    }}
                >
                    <MenuItem value="ALL">All</MenuItem>
                    <MenuItem value="LOGIN">Login</MenuItem>
                    <MenuItem value="LOGOUT">Logout</MenuItem>
                    <MenuItem value="CREATE">Create</MenuItem>
                    <MenuItem value="UPDATE">Update</MenuItem>
                    <MenuItem value="APPROVE">Approve</MenuItem>
                    <MenuItem value="REJECT">Reject</MenuItem>
                    <MenuItem value="EXECUTE">Execute</MenuItem>
                    <MenuItem value="VIEW">View</MenuItem>
                </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                <InputLabel>Entity Type</InputLabel>
                <Select
                    value={entityType}
                    label="Entity Type"
                    onChange={(e) => {
                        setEntityType(e.target.value as string);
                        setPage(0);
                    }}
                >
                    <MenuItem value="ALL">All</MenuItem>
                    <MenuItem value="TRANSACTION">Transaction</MenuItem>
                    <MenuItem value="APPROVAL">Approval</MenuItem>
                    <MenuItem value="RECON_RESULT">Recon Result</MenuItem>
                    <MenuItem value="ADJUSTMENT">Adjustment</MenuItem>
                    <MenuItem value="USER_SESSION">User Session</MenuItem>
                </Select>
                </FormControl>
            </Grid>
        </Grid>
      </Paper>

      {logs.length === 0 ? (
          <Alert severity="info">No audit records found. Waiting for system events...</Alert>
      ) : (
        <Paper>
            <TableContainer>
                <Table sx={{ minWidth: 750 }} aria-label="audit trail table">
                <TableHead>
                    <TableRow>
                    {headCells.map((headCell) => (
                        <TableCell
                            key={headCell.id}
                            sortDirection={orderBy === headCell.id ? order : false}
                        >
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={() => handleRequestSort(headCell.id)}
                            >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                                ) : null}
                            </TableSortLabel>
                        </TableCell>
                    ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {paginatedLogs.map((row) => (
                        <TableRow
                            key={row.id}
                            hover
                            onClick={() => handleRowClick(row)}
                            sx={{ cursor: 'pointer' }}
                        >
                            <TableCell>{row.timestamp}</TableCell>
                            <TableCell sx={{ fontFamily: 'monospace' }}>{row.userId}</TableCell>
                            <TableCell><Chip label={row.role} size="small" /></TableCell>
                            <TableCell><Chip label={row.action} size="small" variant="outlined" /></TableCell>
                            <TableCell>{row.entityType.replace(/_/g, ' ')}</TableCell>
                            <TableCell sx={{ fontFamily: 'monospace' }}>{row.entityRef}</TableCell>
                            <TableCell>
                                <Chip
                                    label={row.result}
                                    color={row.result === 'SUCCESS' ? 'success' : 'error'}
                                    size="small"
                                />
                            </TableCell>
                            <TableCell>{row.channel}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredLogs.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
      )}

      {/* Detail Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 450, p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Audit Log Details
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {selectedLog && (
            <Stack spacing={2}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Timestamp</Typography>
                    <Typography variant="body1">{selectedLog.timestamp}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">User ID</Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>{selectedLog.userId}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Role</Typography>
                    <div><Chip label={selectedLog.role} size="small" /></div>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">IP Address</Typography>
                    <Typography variant="body1">{selectedLog.ipAddress}</Typography>
                </Grid>
              </Grid>

              <Divider />

              <Grid container spacing={1}>
                <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Action</Typography>
                    <div><Chip label={selectedLog.action} size="small" variant="outlined" /></div>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Result</Typography>
                    <div><Chip label={selectedLog.result} color={selectedLog.result === 'SUCCESS' ? 'success' : 'error'} size="small" /></div>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Entity Type</Typography>
                    <Typography variant="body1">{selectedLog.entityType.replace(/_/g, ' ')}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Entity Ref</Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>{selectedLog.entityRef}</Typography>
                </Grid>
              </Grid>

              {selectedLog.snapshot && (
                  <>
                    <Divider />
                    <Typography variant="h6" gutterBottom>Data Snapshot</Typography>
                    {selectedLog.snapshot.before && (
                        <Box>
                            <Typography variant="subtitle2">Before</Typography>
                            <Paper variant="outlined" sx={{ p: 1, bgcolor: '#fff0f0', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                                <pre style={{ margin: 0 }}>{JSON.stringify(selectedLog.snapshot.before, null, 2)}</pre>
                            </Paper>
                        </Box>
                    )}
                    {selectedLog.snapshot.after && (
                        <Box>
                            <Typography variant="subtitle2">After</Typography>
                            <Paper variant="outlined" sx={{ p: 1, bgcolor: '#e8f5e9', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                                <pre style={{ margin: 0 }}>{JSON.stringify(selectedLog.snapshot.after, null, 2)}</pre>
                            </Paper>
                        </Box>
                    )}
                  </>
              )}
            </Stack>
          )}
        </Box>
      </Drawer>
    </Box>
  );
}
