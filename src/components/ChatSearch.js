import React, { useState, useEffect } from 'react';
import './ChatSearch.css';

const ChatSearch = ({ chatHistory, onSearchResults, isVisible, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchType, setSearchType] = useState('all'); // all, questions, answers
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, relevance

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      onSearchResults([]);
      return;
    }

    const filtered = chatHistory.filter(item => {
      const matchesType = searchType === 'all' || 
                         (searchType === 'questions' && item.type === 'question') ||
                         (searchType === 'answers' && item.type === 'answer');
      
      const matchesSearch = item.content.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesType && matchesSearch;
    });

    // ترتيب النتائج
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.timestamp) - new Date(a.timestamp);
      } else if (sortBy === 'oldest') {
        return new Date(a.timestamp) - new Date(b.timestamp);
      } else { // relevance
        const aRelevance = countMatches(a.content, searchTerm);
        const bRelevance = countMatches(b.content, searchTerm);
        return bRelevance - aRelevance;
      }
    });

    setSearchResults(sorted);
    onSearchResults(sorted);
  }, [searchTerm, searchType, sortBy, chatHistory, onSearchResults]);

  const countMatches = (text, term) => {
    const regex = new RegExp(term.toLowerCase(), 'g');
    return (text.toLowerCase().match(regex) || []).length;
  };

  const highlightText = (text, term) => {
    if (!term) return text;
    
    const regex = new RegExp(`(${term})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? <mark key={index}>{part}</mark> : part
    );
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return 'اليوم ' + date.toLocaleTimeString('ar-SA', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (days === 1) {
      return 'أمس ' + date.toLocaleTimeString('ar-SA', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (days < 7) {
      return `منذ ${days} أيام`;
    } else {
      return date.toLocaleDateString('ar-SA');
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    onSearchResults([]);
  };

  if (!isVisible) return null;

  return (
    <div className="chat-search-overlay">
      <div className="chat-search-container">
        <div className="search-header">
          <h3>🔍 البحث في المحادثات</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* شريط البحث */}
        <div className="search-bar">
          <div className="search-input-container">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث في المحادثات..."
              className="search-input"
              autoFocus
            />
            {searchTerm && (
              <button className="clear-search-btn" onClick={clearSearch}>
                ✕
              </button>
            )}
          </div>
        </div>

        {/* فلاتر البحث */}
        <div className="search-filters">
          <div className="filter-group">
            <label>نوع البحث:</label>
            <select 
              value={searchType} 
              onChange={(e) => setSearchType(e.target.value)}
              className="filter-select"
            >
              <option value="all">الكل</option>
              <option value="questions">الأسئلة فقط</option>
              <option value="answers">الإجابات فقط</option>
            </select>
          </div>

          <div className="filter-group">
            <label>ترتيب:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="newest">الأحدث أولاً</option>
              <option value="oldest">الأقدم أولاً</option>
              <option value="relevance">الأكثر صلة</option>
            </select>
          </div>
        </div>

        {/* نتائج البحث */}
        <div className="search-results">
          {searchTerm === '' ? (
            <div className="search-placeholder">
              <div className="placeholder-icon">🔍</div>
              <p>ابدأ بكتابة كلمة البحث للعثور على المحادثات السابقة</p>
              <div className="search-tips">
                <h4>نصائح البحث:</h4>
                <ul>
                  <li>استخدم كلمات مفتاحية بسيطة</li>
                  <li>يمكنك البحث في الأسئلة والإجابات</li>
                  <li>البحث غير حساس لحالة الأحرف</li>
                </ul>
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🤷‍♂️</div>
              <p>لم يتم العثور على نتائج لـ "{searchTerm}"</p>
              <small>جرب كلمات بحث مختلفة أو قم بتغيير فلاتر البحث</small>
            </div>
          ) : (
            <>
              <div className="results-header">
                <span>النتائج: {searchResults.length}</span>
              </div>
              <div className="results-list">
                {searchResults.map((item, index) => (
                  <div key={index} className={`result-item ${item.type}`}>
                    <div className="result-type">
                      {item.type === 'question' ? '❓ سؤال' : '💬 إجابة'}
                    </div>
                    <div className="result-content">
                      {highlightText(item.content, searchTerm)}
                    </div>
                    <div className="result-time">
                      {formatTime(item.timestamp)}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* إحصائيات البحث */}
        {searchResults.length > 0 && (
          <div className="search-stats">
            <div className="stat-item">
              <span>إجمالي النتائج:</span>
              <span>{searchResults.length}</span>
            </div>
            <div className="stat-item">
              <span>الأسئلة:</span>
              <span>{searchResults.filter(r => r.type === 'question').length}</span>
            </div>
            <div className="stat-item">
              <span>الإجابات:</span>
              <span>{searchResults.filter(r => r.type === 'answer').length}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSearch;