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
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import TablePagination from '@mui/material/TablePagination';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';
import axios from 'axios';
import { AuditLogEntry } from './AuditTrail';

// Mock Data (In a real app, this would come from GET /backoffice/approvals)
const MOCK_APPROVALS = [
  { id: 1, ref: '025093000001', type: 'ADJUSTMENT', amount: 150.00, createdBy: 'user_ops_01', date: '2026-01-25 09:30:00', makerComment: 'Manual adjustment for failed ATM withdrawal.' },
  { id: 2, ref: '025101500002', type: 'REFUND', amount: 500.00, createdBy: 'user_ops_02', date: '2026-01-25 10:15:22', makerComment: 'Customer complaint ref: C-123. Double charge.' },
  { id: 3, ref: '024142000003', type: 'FEE_OVERRIDE', amount: 25.00, createdBy: 'user_ops_01', date: '2026-01-24 14:20:10', makerComment: 'Waiving monthly fee for VIP customer.' },
  { id: 4, ref: '024164500004', type: 'RECON_WRITE_OFF', amount: 1200.00, createdBy: 'user_ops_03', date: '2026-01-24 16:45:05', makerComment: 'Unrecoverable amount from reconciliation mismatch.' },
  { id: 5, ref: '023080000005', type: 'REVERSAL', amount: 100.00, createdBy: 'user_ops_02', date: '2026-01-23 08:00:00', makerComment: 'Incorrect transaction posted.' },
  { id: 6, ref: '023113000006', type: 'LIMIT_OVERRIDE', amount: 50000.00, createdBy: 'user_ops_01', date: '2026-01-23 11:30:45', makerComment: 'Urgent corporate transfer, one-time limit increase.' },
  { id: 7, ref: '022180000007', type: 'ADJUSTMENT', amount: 200.00, createdBy: 'user_ops_03', date: '2026-01-22 18:00:12', makerComment: 'System error correction.' },
  { id: 8, ref: '022191500008', type: 'REFUND', amount: 5000.00, createdBy: 'user_ops_01', date: '2026-01-22 19:15:00', makerComment: 'Product return refund.' },
];

// Sorting Types
type Order = 'asc' | 'desc';
interface Data {
  id: number;
  ref: string;
  type: string;
  amount: number;
  createdBy: string;
  date: string;
}

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
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  { id: 'ref', label: 'Reference No', numeric: false },
  { id: 'type', label: 'Type', numeric: false },
  { id: 'amount', label: 'Amount', numeric: true },
  { id: 'createdBy', label: 'Created By', numeric: false },
  { id: 'date', label: 'Date', numeric: false },
];

interface ApprovalsProps {
  token: string;
  currentUser: string;
  onLog: (msg: string, type: 'info' | 'success' | 'error' | 'warning') => void;
  onAudit: (log: AuditLogEntry) => void;
}

export default function Approvals({ token, currentUser, onLog, onAudit }: ApprovalsProps) {
  const [approvals, setApprovals] = React.useState(MOCK_APPROVALS);
  const [selected, setSelected] = React.useState<readonly number[]>([]);

  const [rejectDialogOpen, setRejectDialogOpen] = React.useState(false);
  const [rejectReason, setRejectReason] = React.useState('');
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<'success' | 'error'>('success');

  // Drawer State
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selectedApproval, setSelectedApproval] = React.useState<any | null>(null);

  // Filters
  const [refNo, setRefNo] = React.useState('');
  const [type, setType] = React.useState('ALL');

  // Pagination & Sorting
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [order, setOrder] = React.useState<Order>('desc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('date');

  // Filter Logic
  const filteredApprovals = approvals.filter((item) => {
    if (type !== 'ALL' && item.type !== type) return false;
    if (refNo && !item.ref.includes(refNo)) return false;
    return true;
  });

  // Sorting Logic
  const sortedApprovals = React.useMemo(() => {
     return filteredApprovals.sort(getComparator(order, orderBy));
  }, [filteredApprovals, order, orderBy]);

  // Pagination Logic
  const paginatedApprovals = sortedApprovals.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Selection Logic
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = filteredApprovals.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleCheckboxClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleRowClick = (row: any) => {
      setSelectedApproval(row);
      setDrawerOpen(true);
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  // --- API Actions ---

  const callApproveApi = async (transactionId: string, type: string) => {
    try {
      onLog(`Approving transaction ${transactionId}...`, 'info');
      await axios.post(
        `/backoffice/approve?transactionId=${transactionId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onLog(`✅ Transaction ${transactionId} approved.`, 'success');

      // Add to Audit Trail
      onAudit({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        userId: currentUser,
        role: 'SUPERVISOR',
        action: 'APPROVE',
        entityType: type,
        entityRef: transactionId,
        result: 'SUCCESS',
        channel: 'WEB',
        ipAddress: '192.168.1.10', // Simulated
        snapshot: { after: { status: 'APPROVED' } }
      });

      return true;
    } catch (err: any) {
      if (err.response && err.response.status === 403) {
        onLog(`⛔ Access Denied for ${transactionId}. Missing Role.`, 'error');
        // Log failure to audit trail too
        onAudit({
            id: Date.now(),
            timestamp: new Date().toISOString(),
            userId: currentUser,
            role: 'USER', // Assuming user role if failed
            action: 'APPROVE',
            entityType: type,
            entityRef: transactionId,
            result: 'FAILED',
            channel: 'WEB',
            ipAddress: '192.168.1.10',
            snapshot: { error: 'Access Denied' }
        });
      } else {
        onLog(`❌ Error approving ${transactionId}: ${err.message}`, 'error');
      }
      return false;
    }
  };

  const handleBulkApprove = async () => {
    const itemsToApprove = approvals.filter(item => selected.includes(item.id));
    let successCount = 0;

    for (const item of itemsToApprove) {
      const success = await callApproveApi(item.ref, item.type);
      if (success) {
        successCount++;
        // Remove from list locally on success
        setApprovals(prev => prev.filter(p => p.id !== item.id));
      }
    }

    if (successCount > 0) {
      setSnackbarMessage(`${successCount} transactions approved successfully.`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } else {
      setSnackbarMessage(`Failed to approve selected transactions.`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
    setSelected([]);
  };

  const handleSingleApprove = async (id: number, ref: string, type: string) => {
    const success = await callApproveApi(ref, type);
    if (success) {
      setApprovals(prev => prev.filter(item => item.id !== id));
      setSnackbarMessage(`Transaction ${ref} approved successfully.`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } else {
      setSnackbarMessage(`Failed to approve transaction ${ref}.`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // --- Reject Logic (Mock only for now) ---

  const handleBulkRejectOpen = () => {
    setRejectDialogOpen(true);
  };

  const handleBulkReject = () => {
    // In a real app, we would call a reject API here
    onLog(`Rejecting ${selected.length} transactions (Mock Action)`, 'warning');
    setApprovals(approvals.filter(item => !selected.includes(item.id)));
    setSnackbarMessage(`${selected.length} transactions rejected.`);
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    setRejectDialogOpen(false);
    setRejectReason('');
    setSelected([]);
  };

  const handleSingleRejectOpen = (id: number) => {
      setSelected([id]);
      setRejectDialogOpen(true);
  };

  const handleCloseRejectDialog = () => {
    setRejectDialogOpen(false);
    setRejectReason('');
  };

  // --- Sorting & Pagination ---

  const handleRequestSort = (property: keyof Data) => {
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

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" component="h2" color="primary" gutterBottom>
        Pending Approvals
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
                <TextField
                label="Reference No"
                fullWidth
                value={refNo}
                onChange={(e) => {
                    setRefNo(e.target.value);
                    setPage(0);
                }}
                placeholder="Search Ref No..."
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
            <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                    value={type}
                    label="Type"
                    onChange={(e) => {
                        setType(e.target.value as string);
                        setPage(0);
                    }}
                >
                    <MenuItem value="ALL">All</MenuItem>
                    <MenuItem value="ADJUSTMENT">Adjustment</MenuItem>
                    <MenuItem value="REVERSAL">Reversal</MenuItem>
                    <MenuItem value="REFUND">Refund</MenuItem>
                    <MenuItem value="RECON_WRITE_OFF">Recon Write Off</MenuItem>
                    <MenuItem value="FEE_OVERRIDE">Fee Override</MenuItem>
                    <MenuItem value="LIMIT_OVERRIDE">Limit Override</MenuItem>
                </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
                <Button variant="contained" fullWidth>Search</Button>
            </Grid>
        </Grid>
      </Paper>

      {/* Bulk Action Toolbar */}
      {selected.length > 0 && (
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
            mb: 1,
            borderRadius: 1
          }}
        >
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {selected.length} selected
          </Typography>

          <Stack direction="row" spacing={1}>
            <Tooltip title="Approve Selected">
                <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={handleBulkApprove}
                >
                    Approve
                </Button>
            </Tooltip>
            <Tooltip title="Reject Selected">
                <Button
                    variant="contained"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={handleBulkRejectOpen}
                >
                    Reject
                </Button>
            </Tooltip>
          </Stack>
        </Toolbar>
      )}

      {paginatedApprovals.length === 0 ? (
          <Alert severity="info">No pending approvals found matching criteria.</Alert>
      ) : (
        <Paper>
            <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="approvals table">
                <TableHead>
                    <TableRow>
                    <TableCell padding="checkbox">
                        <Checkbox
                            color="primary"
                            indeterminate={selected.length > 0 && selected.length < filteredApprovals.length}
                            checked={filteredApprovals.length > 0 && selected.length === filteredApprovals.length}
                            onChange={handleSelectAllClick}
                        />
                    </TableCell>
                    {headCells.map((headCell) => (
                        <TableCell
                            key={headCell.id}
                            align={headCell.numeric ? 'right' : 'left'}
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
                    <TableCell align="center">Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {paginatedApprovals.map((row) => {
                        const isItemSelected = isSelected(row.id);
                        return (
                            <TableRow
                                key={row.id}
                                hover
                                role="checkbox"
                                aria-checked={isItemSelected}
                                selected={isItemSelected}
                                sx={{ cursor: 'pointer' }}
                            >
                                <TableCell padding="checkbox" onClick={(event) => handleCheckboxClick(event, row.id)}>
                                    <Checkbox
                                        color="primary"
                                        checked={isItemSelected}
                                    />
                                </TableCell>
                                <TableCell component="th" scope="row" sx={{ fontFamily: 'monospace' }} onClick={() => handleRowClick(row)}>
                                {row.ref}
                                </TableCell>
                                <TableCell onClick={() => handleRowClick(row)}>
                                    <Chip label={row.type.replace(/_/g, ' ')} size="small" />
                                </TableCell>
                                <TableCell align="right" onClick={() => handleRowClick(row)}>€{row.amount.toFixed(2)}</TableCell>
                                <TableCell onClick={() => handleRowClick(row)}>{row.createdBy}</TableCell>
                                <TableCell onClick={() => handleRowClick(row)}>{row.date}</TableCell>
                                <TableCell align="center">
                                    <Stack direction="row" spacing={1} justifyContent="center">
                                        <IconButton
                                            color="success"
                                            size="small"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleSingleApprove(row.id, row.ref, row.type);
                                            }}
                                        >
                                            <CheckCircleIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            size="small"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleSingleRejectOpen(row.id);
                                            }}
                                        >
                                            <CancelIcon />
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredApprovals.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
      )}

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onClose={handleCloseRejectDialog}>
        <DialogTitle>Reject Transaction(s)</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide a reason for rejecting {selected.length > 0 ? `${selected.length} transactions` : 'this transaction'}.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="reason"
            label="Rejection Reason"
            type="text"
            fullWidth
            variant="standard"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRejectDialog}>Cancel</Button>
          <Button onClick={handleBulkReject} color="error" disabled={!rejectReason.trim()}>
            Reject
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Detail Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 400, p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Approval Details
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {selectedApproval && (
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary">Reference No</Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>{selectedApproval.ref}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Date</Typography>
                <Typography variant="body1">{selectedApproval.date}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Type</Typography>
                <Box>
                    <Chip label={selectedApproval.type.replace(/_/g, ' ')} />
                </Box>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Amount</Typography>
                <Typography variant="h6">€{selectedApproval.amount.toFixed(2)}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Created By</Typography>
                <Typography variant="body1">{selectedApproval.createdBy}</Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="caption" color="text.secondary">Maker Comment</Typography>
                <Paper variant="outlined" sx={{ p: 1, bgcolor: '#f5f5f5' }}>
                    <Typography variant="body2">{selectedApproval.makerComment}</Typography>
                </Paper>
              </Box>
            </Stack>
          )}
        </Box>
      </Drawer>
    </Box>
  );
}
