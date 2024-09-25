import React from 'react';
import Head from 'next/head';
import { Card, CardContent, Stack, Typography } from '@mui/material';

export default function AdoptionCenterPage() {
    return (
        <>
            <Head>
                <title>Adoption Center</title>
            </Head>

            <main>
                <Stack sx={{ paddingTop: 4 }} alignItems="center">
                    <Stack direction="row" gap={2}>
                        <Card
                            sx={{
                                width: 300,
                                backgroundColor: '#3f51b5',
                                color: '#fff',
                                transition: '0.3s',
                                '&:hover': {
                                    boxShadow: 8,  // Dynamically increase shadow on hover
                                    transform: 'scale(1.05)',  // Slightly scale the card on hover
                                }
                            }}
                            elevation={4}
                        >
                            <CardContent>
                                <Typography variant="h5" align="center">
                                    Adoption Center 1
                                </Typography>
                                <Typography variant="body2" align="center">
                                    Put Adoption Center 1 info here.
                                </Typography>
                            </CardContent>
                        </Card>

                        <Card
                            sx={{
                                width: 300,
                                backgroundColor: '#3f51b5',
                                color: '#fff',
                                transition: '0.3s',
                                '&:hover': {
                                    boxShadow: 8,  // Dynamically increase shadow on hover
                                    transform: 'scale(1.05)',  // Slightly scale the card on hover
                                }
                            }}
                            elevation={4}
                        >
                            <CardContent>
                                <Typography variant="h5" align="center">
                                    Adoption Center 2
                                </Typography>
                                <Typography variant="body2" align="center">
                                    Put Adoption Center 2 info here.
                                </Typography>
                            </CardContent>
                        </Card>

                        <Card
                            sx={{
                                width: 300,
                                backgroundColor: '#3f51b5',
                                color: '#fff',
                                transition: '0.3s',
                                '&:hover': {
                                    boxShadow: 8,  // Dynamically increase shadow on hover
                                    transform: 'scale(1.05)',  // Slightly scale the card on hover
                                }
                            }}
                            elevation={4}
                        >
                            <CardContent>
                                <Typography variant="h5" align="center">
                                    Adoption Center 3
                                </Typography>
                                <Typography variant="body2" align="center">
                                    Put Adoption Center 3 info here.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Stack>
                </Stack>
            </main>
        </>
    );
}
