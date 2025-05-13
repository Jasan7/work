import React from 'react';
import JobCard from '../JobCard/JobCard';
import styles from './Column.module.css'
import { useDroppable } from '@dnd-kit/core';

const Column = ({ id, title, jobs }) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div className={styles.column} ref={setNodeRef}>
      <h2>{title}</h2>
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};

export default Column;
