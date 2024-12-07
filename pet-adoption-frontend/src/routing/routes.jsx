import { useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './protectedRoute';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import PetManager from '@/pages/PetManagerPage';
import EventManager from '@/pages/EventManagerPage';
import FindAPetPage from '@/pages/FindAPetPage';
import Settings from '@/pages/SettingsPage';
import LocalAdoptionCenter from '@/pages/LocalAdoptionCenterPage';
import ManageAccounts from '@/pages/ManageWorkerAccountsPage';
import RegisterCenterWorker from '@/pages/RegisterCenterWorkerPage';
import AvailablePets from '@/pages/AllPetsPage';
import PreferencesPage from '@/pages/PreferencesPage';
import Messages from '@/pages/MessagePage';
import SavedPets from '@/pages/SavedPetsPage';
import Register from '@/pages/RegisterUserPage';
import Login from '@/pages/LoginPage';
import SessionExpired from '@/pages/SessionExpiredPage';
import { getAuthorityFromToken } from "@/utils/redux/tokenUtils";
import CreditsPage from '@/components/creditsContent';

const BrowserRouter = dynamic(
    () => import('react-router-dom').then((mod) => mod.BrowserRouter),
    { ssr: false }
);
export default function AppRoutes() {
    const token = useSelector((state) => state.user.token);
    const userType = getAuthorityFromToken(token);

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<ProtectedRoute>{userType === "Owner" ? <FindAPetPage /> : <PetManager />}</ProtectedRoute>} />
                    <Route path="/PetManager" element={<ProtectedRoute><PetManager /></ProtectedRoute>} />
                    <Route path="/EventManager" element={<ProtectedRoute><EventManager /></ProtectedRoute>} />
                    <Route path="/FindAPet" element={<ProtectedRoute><FindAPetPage /></ProtectedRoute>} />
                    <Route path="/Settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                    <Route path="/LocalAdoptionCenter" element={<ProtectedRoute><LocalAdoptionCenter /></ProtectedRoute>} />
                    <Route path="/ManageAccounts" element={<ProtectedRoute><ManageAccounts /></ProtectedRoute>} />
                    <Route path="/RegisterCenterWorker" element={<ProtectedRoute><RegisterCenterWorker /></ProtectedRoute>} />
                    <Route path="/AvailablePets" element={<ProtectedRoute><AvailablePets /></ProtectedRoute>} />
                    <Route path="/preferences" element={<ProtectedRoute><PreferencesPage /></ProtectedRoute>} />
                    <Route path="/Messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
                    <Route path="/credits" element={<CreditsPage />} />
                </Route>
                <Route path="/Register" element={<Register />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/session-expired" element={<SessionExpired />} />
                <Route path="*" element={<Navigate to="/Login" />} />
            </Routes>
        </BrowserRouter>
    );
}