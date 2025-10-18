import React, { useState, useEffect, useRef } from 'react';
import './LandingPage.css';

const Chatbot = ({ user, onBack }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchHospitals();
    fetchDoctors();
  }, []);

  const fetchHospitals = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/v1/hospitals');
      if (res.ok) {
        const data = await res.json();
        setHospitals(data || []);
      }
    } catch (e) {
      console.error('Error fetching hospitals:', e);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/v1/doctors');
      if (res.ok) {
        const data = await res.json();
        setDoctors(data || []);
      }
    } catch (e) {
      console.error('Error fetching doctors:', e);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/v1/chat/message', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ message: userMsg.content })
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.result || 'No response' }]);
    } catch (e) {
      console.error('Chatbot error:', e);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error contacting chatbot. Please check if the backend is running.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('http://localhost:8080/api/v1/chat/analyze', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: form
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.result || 'No analysis result' }]);
    } catch (e) {
      console.error('File upload error:', e);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error analyzing file. Please check if you are logged in and the backend is running.' }]);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="landing-page">
      <div className="header">
        <button className="back-button" onClick={onBack}>Back</button>
        <h1>Health Assistant Chatbot</h1>
        <div style={{ flex: 1 }} />
      </div>

      <div className="content">
        <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '70vh' }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px', border: '1px solid var(--border)', borderRadius: 8 }}>
              {messages.map((m, idx) => (
                <div key={idx} style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 600 }}>{m.role === 'user' ? 'You' : 'Assistant'}</div>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{m.content}</div>
                </div>
              ))}
              {loading && <div>Thinking...</div>}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a health question..."
                className="input"
                onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
              />
              <button className="primary-button" onClick={sendMessage} disabled={loading}>Send</button>
              <label className="secondary-button" style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                {uploading ? 'Analyzing...' : 'Upload Report'}
                <input ref={fileInputRef} type="file" accept="application/pdf,text/plain,image/*" style={{ display: 'none' }} onChange={handleUpload} />
              </label>
            </div>
          </div>

          <div className="card" style={{ height: '70vh', overflowY: 'auto' }}>
            <h3>Hospitals</h3>
            <ul>
              {hospitals.map((h) => (
                <li key={h.id || h._id}>
                  <strong>{h.name}</strong>{h.city ? `, ${h.city}` : ''}
                </li>
              ))}
            </ul>
            <hr style={{ margin: '16px 0' }} />
            <h3>Doctors</h3>
            <ul>
              {doctors.map((d) => (
                <li key={d.id || d._id}>
                  <strong>{d.name}</strong>{d.specialization ? ` - ${d.specialization}` : ''}{d.city ? `, ${d.city}` : ''}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;


