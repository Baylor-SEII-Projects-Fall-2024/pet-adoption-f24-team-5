import React from 'react';
import Head from 'next/head'
import { Button, Card, CardContent, Stack, Typography } from '@mui/material'
import styles from '@/styles/Home.module.css'
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function IndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/home');
  }, [router]);

  return null;
}
