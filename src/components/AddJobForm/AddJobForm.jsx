import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../Firebase/firebase';
import styles from './AddJobForm.module.css'; 

const AddJobForm = () => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [logoURL, setLogoURL] = useState('');
  const [status, setStatus] = useState('Applied');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) return alert('You must be logged in.');

    try {
      await addDoc(collection(db, 'jobs'), {
        owner: user.uid,
        title,
        company,
        logoURL,
        status,
        notes,
        createdAt: serverTimestamp()
      });

      setTitle('');
      setCompany('');
      setLogoURL('');
      setStatus('Applied');
      setNotes('');
      alert('Job added!');
    } catch (error) {
      console.error('Error adding job:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.addJobModal}>
      <h2>Add New Job</h2>

      <input
        type="text"
        placeholder="Job Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        required
      />
      <input
        type="url"
        placeholder="Logo URL (optional)"
        value={logoURL}
        onChange={(e) => setLogoURL(e.target.value)}
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="Applied">Applied</option>
        <option value="Interview">Interviewing</option>
        <option value="Offer">Offer</option>
        <option value="Hired">Hired</option>
        <option value="Rejected">Rejected</option>
      </select>
      <textarea
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <button type="submit">Add Job</button>
    </form>
  );
};

export default AddJobForm;
