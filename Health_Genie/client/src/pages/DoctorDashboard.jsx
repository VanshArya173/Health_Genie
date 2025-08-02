// src/pages/DoctorDashboard.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';

const DoctorDashboard = () => {
  const doctorId = 'drsharma'; // 🔁 Replace this with dynamic auth later
  const [patientQueue, setPatientQueue] = useState([]);
  const [activeChats, setActiveChats] = useState([]);

  useEffect(() => {
    if (!doctorId) return;

    // Listen to patient queue
    const queueRef = collection(db, 'PatientQueue');
    const q = query(queueRef, where('doctorId', '==', doctorId));
    const unsubscribeQueue = onSnapshot(q, (snapshot) => {
      const patients = snapshot.docs.map(doc => doc.data().patientId);
      setPatientQueue(patients);
    });

    // Listen to active chats
    const chatRef = collection(db, 'Chats');
    const c = query(chatRef, where('doctorId', '==', doctorId));
    const unsubscribeChats = onSnapshot(c, (snapshot) => {
      const chats = snapshot.docs.map(doc => ({
        chatId: doc.id,
        ...doc.data()
      }));
      setActiveChats(chats);
    });

    return () => {
      unsubscribeQueue();
      unsubscribeChats();
    };
  }, [doctorId]);

  // ✅ Inline CSS
  const styles = {
    container: {
      padding: '30px 20px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: '#f4f7fa',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    },
    title: {
      fontSize: '2rem',
      color: '#1a202c',
      textAlign: 'center',
      marginBottom: '20px'
    },
    sectionTitle: {
      color: '#2d3748',
      borderBottom: '2px solid #e2e8f0',
      paddingBottom: '5px',
      marginTop: '30px'
    },
    list: {
      listStyleType: 'none',
      padding: 0,
      marginTop: '15px'
    },
    listItem: {
      backgroundColor: '#ffffff',
      padding: '15px',
      borderRadius: '8px',
      marginBottom: '12px',
      borderLeft: '5px solid #3182ce',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)'
    },
    link: {
      color: '#3182ce',
      textDecoration: 'none',
      marginRight: '15px'
    },
    emptyText: {
      fontStyle: 'italic',
      color: '#666',
      marginTop: '10px'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Doctor Dashboard</h1>

      <h2 style={styles.sectionTitle}>Patient Queue</h2>
      {patientQueue.length === 0 ? (
        <p style={styles.emptyText}>No patients in queue.</p>
      ) : (
        <ul style={styles.list}>
          {patientQueue.map((patientId, idx) => (
            <li key={idx} style={styles.listItem}>{patientId}</li>
          ))}
        </ul>
      )}

      <h2 style={styles.sectionTitle}>Active Chats</h2>
      {activeChats.length === 0 ? (
        <p style={styles.emptyText}>No active chats.</p>
      ) : (
        <ul style={styles.list}>
          {activeChats.map(chat => (
            <li key={chat.chatId} style={styles.listItem}>
              <strong>Chat with {chat.patientId}</strong> <br />
              <a href={`/chat/${chat.chatId}`} style={styles.link}>Open Chat</a>
              <a href={chat.meetingLink} target="_blank" rel="noreferrer" style={styles.link}>Join Meeting</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DoctorDashboard;
