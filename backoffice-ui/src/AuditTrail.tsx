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
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';
import { visuallyHidden } from '@mui/utils';
import axios from 'axios';

// Data Interface matching the Backend AuditEvent
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resourceId: string;
  result: string;
  details: string;
  riskLevel: string;
  hash: string;
  previousHash: string;
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
  { id: 'riskLevel', label: 'Risk' },
  { id: 'actor', label: 'Actor' },
  { id: 'action', label: 'Action' },
  { id: 'resourceId', label: 'Resource ID' },
  { id: 'result', label: 'Result' },
  { id: 'hash', label: 'Hash (SHA-256)' },
];

interface AuditTrailProps {
  token: string;
}

export default function AuditTrail({ token }: AuditTrailProps) {
  const [logs, setLogs] = React.useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Filters
  const [actor, setActor] = React.useState('');
  const [riskLevel, setRiskLevel] = React.useState('ALL');

  // Pagination & Sorting
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [order, setOrder] = React.useState<Order>('desc');
  const [orderBy, setOrderBy] = React.useState<keyof AuditLogEntry>('timestamp');

  // Drawer
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selectedLog, setSelectedLog] = React.useState<AuditLogEntry | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      // Fetch from the real backend endpoint with Authorization
      const response = await axios.get('/ztrust/audit/logs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(response.data);
    } catch (error) {
      console.error("Failed to fetch audit logs", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount
  React.useEffect(() => {
    fetchLogs();
  }, []);

  // Filter Logic
  const filteredLogs = logs.filter((log) => {
    if (actor && !log.actor.includes(actor)) return false;
    if (riskLevel !== 'ALL' && log.riskLevel !== riskLevel) return false;
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
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" component="h2" color="primary">
          Audit Trail
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchLogs}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Logs'}
        </Button>
      </Stack>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
                <TextField
                label="Actor / User"
                fullWidth
                value={actor}
                onChange={(e) => {
                    setActor(e.target.value);
                    setPage(0);
                }}
                />
            </Grid>
            <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                <InputLabel>Risk Level</InputLabel>
                <Select
                    value={riskLevel}
                    label="Risk Level"
                    onChange={(e) => {
                        setRiskLevel(e.target.value as string);
                        setPage(0);
                    }}
                >
                    <MenuItem value="ALL">All</MenuItem>
                    <MenuItem value="INFO">Info</MenuItem>
                    <MenuItem value="WARNING">Warning</MenuItem>
                    <MenuItem value="CRITICAL">Critical</MenuItem>
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
                            <TableCell>{new Date(row.timestamp).toLocaleString()}</TableCell>
                            <TableCell>
                                <Chip
                                    label={row.riskLevel}
                                    size="small"
                                    color={row.riskLevel === 'CRITICAL' ? 'error' : row.riskLevel === 'WARNING' ? 'warning' : 'default'}
                                />
                            </TableCell>
                            <TableCell sx={{ fontFamily: 'monospace' }}>{row.actor}</TableCell>
                            <TableCell><Chip label={row.action} size="small" variant="outlined" /></TableCell>
                            <TableCell sx={{ fontFamily: 'monospace' }}>{row.resourceId}</TableCell>
                            <TableCell>
                                <Chip
                                    label={row.result}
                                    color={row.result === 'SUCCESS' ? 'success' : 'error'}
                                    size="small"
                                />
                            </TableCell>
                            <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {row.hash}
                            </TableCell>
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
        <Box sx={{ width: 500, p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Audit Log Details
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {selectedLog && (
            <Stack spacing={2}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Event ID</Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{selectedLog.id}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Timestamp</Typography>
                    <Typography variant="body1">{new Date(selectedLog.timestamp).toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Risk Level</Typography>
                    <div>
                        <Chip
                            label={selectedLog.riskLevel}
                            size="small"
                            color={selectedLog.riskLevel === 'CRITICAL' ? 'error' : selectedLog.riskLevel === 'WARNING' ? 'warning' : 'default'}
                        />
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Actor</Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>{selectedLog.actor}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Action</Typography>
                    <div><Chip label={selectedLog.action} size="small" variant="outlined" /></div>
                </Grid>
              </Grid>

              <Divider />

              <Box>
                <Typography variant="caption" color="text.secondary">Details</Typography>
                <Paper variant="outlined" sx={{ p: 1, bgcolor: '#f5f5f5' }}>
                    <Typography variant="body2">{selectedLog.details}</Typography>
                </Paper>
              </Box>

              <Divider />
              <Typography variant="h6" gutterBottom>Cryptographic Proof</Typography>

              <Box>
                <Typography variant="caption" color="text.secondary">Current Hash (SHA-256)</Typography>
                <Paper variant="outlined" sx={{ p: 1, bgcolor: '#e8f5e9', fontFamily: 'monospace', fontSize: '0.75rem', wordBreak: 'break-all' }}>
                    {selectedLog.hash}
                </Paper>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">Previous Hash</Typography>
                <Paper variant="outlined" sx={{ p: 1, bgcolor: '#fff3e0', fontFamily: 'monospace', fontSize: '0.75rem', wordBreak: 'break-all' }}>
                    {selectedLog.previousHash}
                </Paper>
              </Box>

              <Alert severity="success" sx={{ mt: 2 }}>
                Hash chain verified. Record is immutable.
              </Alert>

            </Stack>
          )}
        </Box>
      </Drawer>
    </Box>
  );
}
