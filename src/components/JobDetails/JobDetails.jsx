import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../Firebase/firebase';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      const jobRef = doc(db, 'jobs', id);
      const jobSnap = await getDoc(jobRef);
      if (jobSnap.exists()) {
        setJob({ id: jobSnap.id, ...jobSnap.data() });
      } else {
        alert('Job not found');
        navigate('/dashboard');
      }
      setLoading(false);
    };
    fetchJob();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const jobRef = doc(db, 'jobs', id);
    await updateDoc(jobRef, {
      title: job.title,
      company: job.company,
      logoURL: job.logoURL,
      status: job.status,
      notes: job.notes,
    });
    setEditing(false);
    alert('Job updated');
  };

  if (loading) return <p>Loading...</p>;
  if (!job) return <p>Job not found</p>;

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <h2>Job Details</h2>

      {editing ? (
        <>
          <input
            name="title"
            value={job.title}
            onChange={handleChange}
            placeholder="Job Title"
          />
          <input
            name="company"
            value={job.company}
            onChange={handleChange}
            placeholder="Company"
          />
          <input
            name="logoURL"
            value={job.logoURL}
            onChange={handleChange}
            placeholder="Logo URL"
          />
          <select name="status" value={job.status} onChange={handleChange}>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Hired">Hired</option>
            <option value="Rejected">Rejected</option>
          </select>
          <textarea
            name="notes"
            value={job.notes}
            onChange={handleChange}
            placeholder="Notes"
          />
          <button onClick={handleSave}>Save</button>
        </>
      ) : (
        <>
          <p><strong>Title:</strong> {job.title}</p>
          <p><strong>Company:</strong> {job.company}</p>
          {job.logoURL && (
            <img src={job.logoURL} alt="logo" style={{ width: 100, height: 100 }} />
          )}
          <p><strong>Status:</strong> {job.status}</p>
          <p><strong>Notes:</strong> {job.notes}</p>
          <button onClick={() => setEditing(true)}>Edit</button>
        </>
      )}

      <button onClick={() => navigate('/dashboard')}>Back</button>
    </div>
  );
};

export default JobDetails;
