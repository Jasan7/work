import React from 'react';
import styles from './JobCard.module.css';
import { useDraggable } from '@dnd-kit/core';
import { useNavigate } from 'react-router-dom';

const JobCard = ({ job }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: job.id,
    });

    const style = {
        transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : undefined,
    };

    const navigate = useNavigate();

    const handleDoubleClick = () => {
        navigate(`/job/${job.id}`);
    };

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            onDoubleClick={handleDoubleClick}
            style={style}
            className={styles.jobCard}
        >
            {job.logoURL && (
                <img src={job.logoURL} alt={job.company} />
            )}
            <h3>{job.title}</h3>
            <p>{job.company}</p>
        </div>
    );
};

export default JobCard;
