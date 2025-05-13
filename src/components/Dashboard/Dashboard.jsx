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
import { collection, onSnapshot, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../../Firebase/firebase';

const stages = ['Applied', 'Interview', 'Offer', 'Hired', 'Rejected'];

const Dashboard = () => {
    const [jobs, setJobs] = useState([]);

    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        if (!over) return;
      
        const jobId = active.id;
        const newStatus = over.id;
      
        const job = jobs.find((job) => job.id === jobId);
        if (!job || job.status === newStatus) return;
      
        // Update Firestore document
        try {
          const jobRef = doc(db, 'testJobs', jobId);
          await updateDoc(jobRef, { status: newStatus });
          console.log(`Updated ${jobId} to ${newStatus}`);
        } catch (err) {
          console.error('Error updating job status:', err);
        }
    };
      

    const getJobsByStatus = (status) => jobs.filter((job) => job.status === status);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'testJobs'), (snapshot) => {
            const fetchedJobs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setJobs(fetchedJobs);
        });

        return () => unsubscribe(); 
    }, []);


    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
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
    );
};

export default Dashboard;
