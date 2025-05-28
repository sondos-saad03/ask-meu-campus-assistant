import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import { getAIResponse } from './services/openai';
import AdminPanel from './components/AdminPanel';
import Analytics from './components/Analytics';
import ChatSearch from './components/ChatSearch';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </div>
    </Router>
  );
}

function Navigation() {
  const location = useLocation();
  
  return (
    <nav className="main-nav">
      <div className="nav-container">
        <div className="nav-logo">
          {/* طريقة 1: مسار مباشر */}
          <img 
            src="/meu-logo.png" 
            alt="جامعة الشرق الأوسط" 
            className="meu-logo"
            onError={(e) => {
              console.log('Logo loading failed, trying alternative...');
              // طريقة 2: إذا ما اشتغل، استخدم مسار كامل
              e.target.src = process.env.PUBLIC_URL + '/meu-logo.png';
              e.target.onerror = () => {
                // طريقة 3: إذا كمان ما اشتغل، اظهر نص MEU
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              };
            }}
          />
          {/* احتياطي إذا اللوغو ما ظهر - نص MEU */}
          <div className="logo-fallback" style={{
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            width: '55px',
            height: '55px',
            backgroundColor: 'white',
            borderRadius: '8px',
            fontSize: '20px',
            fontWeight: '900',
            color: '#C41E3A',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}>
            MEU
          </div>
          
          <div className="logo-text-container">
            <span className="logo-text">Ask MEU</span>
            <span className="logo-subtitle">مساعد الحرم الجامعي</span>
          </div>
        </div>
        
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <span className="nav-icon">💬</span>
            الدردشة
          </Link>
          <Link 
            to="/analytics" 
            className={`nav-link ${location.pathname === '/analytics' ? 'active' : ''}`}
          >
            <span className="nav-icon">📊</span>
            التحليلات
          </Link>
          <Link 
            to="/admin" 
            className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
          >
            <span className="nav-icon">⚙️</span>
            الإدارة
          </Link>
        </div>
      </div>
    </nav>
  );
}

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);

  // تحويل الرسائل إلى تاريخ قابل للبحث
  useEffect(() => {
    const history = [];
    messages.forEach((message, index) => {
      if (message.type === 'user') {
        history.push({
          id: `q-${index}`,
          type: 'question',
          content: message.content,
          timestamp: message.timestamp || new Date().toISOString()
        });
      } else if (message.type === 'bot') {
        history.push({
          id: `a-${index}`,
          type: 'answer',
          content: message.content,
          timestamp: message.timestamp || new Date().toISOString()
        });
      }
    });
    setChatHistory(history);
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // أمثلة الأسئلة حسب التصنيف
  const questionExamples = {
    all: [
      "كيف أسجل في المواد؟",
      "ما هي التخصصات المتاحة؟",
      "أين تقع المكتبة؟",
      "متى تبدأ الامتحانات؟"
    ],
    registration: [
      "كيف أسجل في المواد الدراسية؟",
      "ما هي رسوم التسجيل؟",
      "كيف أحصل على منحة دراسية؟",
      "متى فترة السحب والإضافة؟"
    ],
    majors: [
      "ما هي تخصصات كلية تكنولوجيا المعلومات؟",
      "كم سنة دراسة الهندسة؟",
      "ما متطلبات القبول في إدارة الأعمال؟",
      "هل يوجد تخصص طب؟"
    ],
    facilities: [
      "أين تقع المكتبة الرئيسية؟",
      "ما هي أوقات عمل الكافتيريا؟",
      "هل توجد مختبرات حاسوب؟",
      "أين أجد مواقف السيارات؟"
    ],
    exams: [
      "متى تبدأ الامتحانات النهائية؟",
      "كيف يتم توزيع الدرجات؟",
      "ما هو نظام التقديرات؟",
      "كيف أتظلم من درجة؟"
    ],
    contact: [
      "ما هو رقم هاتف الجامعة؟",
      "أين يقع مكتب القبول والتسجيل؟",
      "كيف أتواصل مع الدعم الفني؟",
      "ما هو عنوان البريد الإلكتروني؟"
    ]
  };

  const categories = [
    { id: 'all', name: 'الكل', icon: '📚' },
    { id: 'registration', name: 'التسجيل', icon: '📝' },
    { id: 'majors', name: 'التخصصات', icon: '🎓' },
    { id: 'facilities', name: 'المرافق', icon: '🏢' },
    { id: 'exams', name: 'الامتحانات', icon: '📊' },
    { id: 'contact', name: 'التواصل', icon: '📞' }
  ];

  const handleSubmit = async (question = null) => {
    const messageText = question || inputValue.trim();
    if (!messageText) return;

    const userMessage = {
      type: 'user',
      content: messageText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await getAIResponse(messageText);
      const botMessage = {
        type: 'bot',
        content: response,
        timestamp: new Date().toISOString(),
        rating: null
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        type: 'bot',
        content: 'عذراً، حدث خطأ في النظام. يرجى المحاولة مرة أخرى لاحقاً. 😔',
        timestamp: new Date().toISOString(),
        rating: null
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRating = (messageIndex, rating) => {
    setMessages(prev => prev.map((msg, index) => 
      index === messageIndex ? { ...msg, rating } : msg
    ));
  };

  const handleExampleClick = (example) => {
    handleSubmit(example);
  };

  const currentExamples = questionExamples[selectedCategory];

  // معالج نتائج البحث
  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  // إغلاق البحث
  const handleCloseSearch = () => {
    setShowSearch(false);
    setSearchResults([]);
  };

  return (
    <div className="chat-page">
      <Navigation />
      
      <div className="chat-container">
        {/* رأس الدردشة مع زر البحث */}
        <div className="chat-header">
          <div className="header-content">
            <div className="header-text">
              <h1>مساعد الحرم الجامعي MEU 🤖</h1>
              <p>اسأل عن أي شيء يتعلق بجامعة الشرق الأوسط!</p>
            </div>
            <div className="header-actions">
              <button 
                className="search-toggle-btn"
                onClick={() => setShowSearch(true)}
                title="البحث في المحادثات"
              >
                🔍 البحث
              </button>
              <button 
                className="clear-chat-btn"
                onClick={() => {
                  setMessages([]);
                  setChatHistory([]);
                }}
                title="مسح المحادثة"
              >
                🗑️ مسح
              </button>
            </div>
          </div>
        </div>

        {/* فلتر التصنيفات */}
        <div className="categories-filter">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
            </button>
          ))}
        </div>

        {/* منطقة الرسائل */}
        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="welcome-screen">
              <div className="welcome-content">
                {/* لوغو في الشاشة الترحيبية مع احتياطات */}
                <img 
                  src="/meu-logo.png" 
                  alt="جامعة الشرق الأوسط" 
                  className="welcome-meu-logo"
                  onError={(e) => {
                    e.target.src = process.env.PUBLIC_URL + '/meu-logo.png';
                    e.target.onerror = () => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'block';
                    };
                  }}
                />
                {/* احتياطي للشاشة الترحيبية */}
                <div className="welcome-logo-fallback" style={{display: 'none'}}>
                  <div className="welcome-text-logo">🏛️ MEU</div>
                </div>
                
                <h2>مرحباً بك في مساعد MEU الذكي!</h2>
                <p>اختر فئة واضغط على سؤال، أو اكتب سؤالك مباشرة:</p>
                
                <div className="example-questions">
                  <h3>أسئلة مقترحة - {categories.find(c => c.id === selectedCategory)?.name}:</h3>
                  <div className="examples-grid">
                    {currentExamples.map((example, index) => (
                      <button
                        key={index}
                        className="example-btn"
                        onClick={() => handleExampleClick(example)}
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <div key={index} className={`message ${message.type}`}>
                  <div className="message-content">
                    <div className="message-text">
                      {message.content}
                    </div>
                    {message.type === 'bot' && (
                      <div className="message-actions">
                        <div className="rating-buttons">
                          <button
                            className={`rating-btn ${message.rating === 'up' ? 'active' : ''}`}
                            onClick={() => handleRating(index, message.rating === 'up' ? null : 'up')}
                            title="مفيد"
                          >
                            👍
                          </button>
                          <button
                            className={`rating-btn ${message.rating === 'down' ? 'active' : ''}`}
                            onClick={() => handleRating(index, message.rating === 'down' ? null : 'down')}
                            title="غير مفيد"
                          >
                            👎
                          </button>
                        </div>
                        <div className="message-time">
                          {new Date(message.timestamp).toLocaleTimeString('ar-SA', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="message bot loading">
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* مربع الإدخال */}
        <div className="input-container">
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <div className="input-group">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="اكتب سؤالك هنا..."
                disabled={isLoading}
                className="chat-input"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="send-button"
              >
                {isLoading ? '⏳' : '📤'}
              </button>
            </div>
          </form>
          
          {/* اقتراحات سريعة */}
          {messages.length > 0 && (
            <div className="quick-suggestions">
              <div className="suggestions-title">اقتراحات سريعة:</div>
              <div className="suggestions-list">
                {currentExamples.slice(0, 2).map((suggestion, index) => (
                  <button
                    key={index}
                    className="suggestion-btn"
                    onClick={() => handleExampleClick(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* مكون البحث */}
      <ChatSearch
        chatHistory={chatHistory}
        onSearchResults={handleSearchResults}
        isVisible={showSearch}
        onClose={handleCloseSearch}
      />
    </div>
  );
}

export default App;