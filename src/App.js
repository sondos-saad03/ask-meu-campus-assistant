import React, { useState } from 'react';

function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleAskQuestion = () => {
    if (question.trim()) {
      setAnswer(`شكراً لسؤالك: "${question}". هذه إجابة تجريبية من Ask-MEU!`);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
      <h1 style={{ color: '#1e3a8a' }}>Ask-MEU</h1>
      <p>مساعدك الذكي للحياة الجامعية في جامعة الشرق الأوسط</p>
      
      <div style={{ margin: '20px 0' }}>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="اسأل سؤالك هنا..."
          rows="4"
          style={{ width: '100%', maxWidth: '500px', padding: '10px' }}
        />
      </div>
      
      <button 
        onClick={handleAskQuestion}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#1e3a8a', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        احصل على الإجابة
      </button>

      {answer && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#f0f8ff', 
          borderRadius: '5px',
          maxWidth: '500px',
          margin: '20px auto'
        }}>
          <h3>الإجابة:</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default App;