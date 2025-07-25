import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import CustHeader from './CustHeader';
import { io } from 'socket.io-client';
import axios from 'axios';

const SOCKET_URL = 'http://localhost:4000';

const MessageDriver = () => {
  const { driverId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    // Fetch message history
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${SOCKET_URL}/api/messages/${driverId}`);
        if (res.data.success) {
          setMessages(res.data.messages);
        }
      } catch (err) {
        setMessages([]);
      }
    };
    fetchHistory();

    // Connect to socket
    socketRef.current = io(SOCKET_URL);
    socketRef.current.emit('joinChat', { driverId });

    socketRef.current.on('receiveMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [driverId]);

  const handleSend = () => {
    if (input.trim()) {
      const msg = { driverId, from: 'customer', text: input };
      socketRef.current.emit('sendMessage', msg);
      setInput('');
    }
  };

  return (
    <div>
      <CustHeader />
      <div style={{ maxWidth: 600, margin: '40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: 24 }}>
        <h2 style={{ color: '#594842', marginBottom: 18 }}>Message Your Rider</h2>
        <div style={{ minHeight: 220, maxHeight: 320, overflowY: 'auto', background: '#f9f9f9', borderRadius: 8, padding: 16, marginBottom: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ alignSelf: msg.from === 'customer' ? 'flex-end' : 'flex-start', background: msg.from === 'customer' ? '#f4c7c1' : '#e2e8f0', color: '#594842', borderRadius: 16, padding: '8px 16px', maxWidth: '70%' }}>
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            style={{ flex: 1, padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          />
          <button
            onClick={handleSend}
            style={{ background: '#f4c7c1', color: '#594842', border: 'none', borderRadius: 8, padding: '0 20px', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageDriver; 