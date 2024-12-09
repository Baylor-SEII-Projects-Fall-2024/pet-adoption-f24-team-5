import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
} from '@mui/material';
import { Link } from 'react-router-dom';
import TitleBar from '@/components/titleBar/TitleBar';
import { useSelector } from 'react-redux';
import { API_URL } from '@/constants';
import axios from '../utils/redux/axiosConfig';
import { getSubjectFromToken } from '@/utils/redux/tokenUtils';
import { getCenterID } from '@/utils/user/center/getCenterID';
import { getEmployees } from '@/utils/user/employee/getEmployees';
import { deleteEmployee } from '@/utils/user/employee/deleteEmployee';

const ManageAccounts = () => {
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);

    const token = useSelector((state) => state.user.token);

    useEffect(() => {
        const loadData = async () => {
            if (token) {
                const id = await getCenterID(token);
                if (id) {
                    const employees = await getEmployees(token, id);
                    setEmployees(employees);
                    setIsLoading(false);
                }
            }
        };

        loadData();
    }, [token]);

    const handleDeleteClick = (employee) => {
        setEmployeeToDelete(employee);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteEmployee(token, employeeToDelete.id);
            setEmployees((prevEmployees) =>
                prevEmployees.filter((employee) => employee.id !== employeeToDelete.id)
            );
            setDeleteDialogOpen(false);
            setEmployeeToDelete(null);
        } catch (err) {
            console.error('Failed to delete employee:', err);
            setError('Failed to delete employee');
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setEmployeeToDelete(null);
    };

    return (
        <>
            <Box sx={{
                minHeight: '92vh',
                bgcolor: 'background.default',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                pt: 4
            }}>
                <Typography
                    variant="h4"
                    sx={{
                        color: 'text.primary',
                        fontWeight: 600,
                        mb: 3
                    }}
                >
                    Manage Center Workers
                </Typography>

                <Button
                    variant="contained"
                    component={Link}
                    to="/RegisterCenterWorker"
                    sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        borderRadius: '24px',
                        px: 4,
                        py: 1.5,
                        mb: 4,
                        '&:hover': {
                            bgcolor: 'primary.dark'
                        }
                    }}
                >
                    Create Center Worker Account
                </Button>

                {isLoading ? (
                    <CircularProgress />
                ) : error ? (
                    <Typography color="error">
                        {error}
                    </Typography>
                ) : employees.length === 0 ? (
                    <Box sx={{
                        width: '100%',
                        maxWidth: 800,
                        mx: 'auto',
                        p: 4,
                        bgcolor: 'background.paper',
                        borderRadius: '16px',
                        boxShadow: '0 2px 4px rgba(139,115,85,0.1)',
                        textAlign: 'center'
                    }}>
                        <Typography
                            variant="h6"
                            sx={{
                                color: 'text.primary',
                                mb: 2
                            }}
                        >
                            No workers found
                        </Typography>
                        <Typography
                            sx={{
                                color: 'text.secondary',
                                mb: 3
                            }}
                        >
                            Create a new worker account to get started
                        </Typography>
                    </Box>
                ) : (
                    <List sx={{
                        width: '100%',
                        maxWidth: 800,
                        mx: 'auto',
                        bgcolor: 'background.paper',
                        borderRadius: '16px',
                        boxShadow: '0 2px 4px rgba(139,115,85,0.1)',
                        overflow: 'hidden'
                    }}>
                        {employees.map((employee) => (
                            <ListItem
                                key={employee.id}
                                sx={{
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                    '&:last-child': {
                                        borderBottom: 'none'
                                    }
                                }}
                            >
                                <ListItemText
                                    primary={
                                        <Typography
                                            sx={{
                                                color: 'text.primary',
                                                fontWeight: 500
                                            }}
                                        >
                                            {`${employee.firstName} ${employee.lastName}`}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography
                                            variant="body2"
                                            sx={{ color: 'text.secondary' }}
                                        >
                                            {`Email: ${employee.emailAddress} | Phone: ${employee.phoneNumber}`}
                                        </Typography>
                                    }
                                />
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleDeleteClick(employee)}
                                    sx={{
                                        ml: 2,
                                        borderRadius: '24px',
                                        borderColor: 'error.main',
                                        color: 'error.main',
                                        '&:hover': {
                                            bgcolor: 'error.50',
                                            borderColor: 'error.dark'
                                        }
                                    }}
                                >
                                    Delete
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                )}
            </Box>

            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        boxShadow: '0 4px 12px rgba(139,115,85,0.1)',
                    }
                }}
            >
                <DialogTitle sx={{
                    color: 'text.primary',
                    fontWeight: 600,
                    pb: 1
                }}>
                    Confirm Delete
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: 'text.secondary' }}>
                        Are you sure you want to delete the account for{' '}
                        <strong>{employeeToDelete?.firstName} {employeeToDelete?.lastName}</strong>?
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 1 }}>
                    <Button
                        onClick={handleDeleteCancel}
                        variant="outlined"
                        sx={{
                            borderRadius: '24px',
                            borderColor: 'secondary.main',
                            color: 'text.primary',
                            '&:hover': {
                                borderColor: 'secondary.dark',
                                bgcolor: 'secondary.lighter'
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        variant="contained"
                        color="error"
                        sx={{
                            borderRadius: '24px',
                            '&:hover': {
                                bgcolor: 'error.dark'
                            }
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ManageAccounts;
