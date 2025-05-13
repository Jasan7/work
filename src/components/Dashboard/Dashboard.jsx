import React, { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import Column from '../Column/Column';
import {
    collection,
    onSnapshot,
    doc,
    updateDoc,
    query,
    where
} from 'firebase/firestore';
import { db, auth } from '../../Firebase/firebase';
import withAuth from '../../HOC/withAuth';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import AddJobForm from '../AddJobForm/AddJobForm';

const stages = ['Applied', 'Interview', 'Offer', 'Hired', 'Rejected'];

const Dashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        if (!over) return;

        const jobId = active.id;
        const newStatus = over.id;

        const job = jobs.find((job) => job.id === jobId);
        if (!job || job.status === newStatus) return;

        try {
            const jobRef = doc(db, 'jobs', jobId);
            await updateDoc(jobRef, { status: newStatus });
        } catch (err) {
            console.error('Error updating job status:', err);
        }
    };

    const getJobsByStatus = (status) => jobs.filter((job) => job.status === status);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (!user) return;

            const q = query(collection(db, 'jobs'), where('owner', '==', user.uid));
            const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
                const fetchedJobs = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setJobs(fetchedJobs);
            });

            return () => unsubscribeSnapshot();
        });

        return () => unsubscribeAuth();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.topBar}>
                <h1 className={styles.title}>Job Tracker</h1>
                <div className={styles.topBarButtons}>
                    <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
                    <button onClick={() => setIsModalOpen(true)} className={styles.addJobButton}>Add Job</button>
                </div>
            </header>

            {isModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <button onClick={() => setIsModalOpen(false)} className={styles.closeModal}>×</button>
                        <AddJobForm />
                    </div>
                </div>
            )}

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <div className={styles.dashboard}>
                    {stages.map((stage) => (
                        <Column
                            key={stage}
                            id={stage}
                            title={stage}
                            jobs={getJobsByStatus(stage)}
                        />
                    ))}
                </div>
            </DndContext>
        </div>
    );
};

export default withAuth(Dashboard);
