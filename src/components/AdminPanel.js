import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

const AdminPanel = () => {
  const [stats, setStats] = useState({
    totalQuestions: 0,
    todayQuestions: 0,
    activeUsers: 0,
    avgResponseTime: '1.2s'
  });

  const [recentQuestions, setRecentQuestions] = useState([
    {
      id: 1,
      question: "كيف أسجل المواد؟",
      category: "تسجيل",
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 دقائق مضت
      status: "answered"
    },
    {
      id: 2,
      question: "ما هي أوقات المكتبة؟",
      category: "خدمات",
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 دقيقة مضت
      status: "answered"
    },
    {
      id: 3,
      question: "معلومات عن تخصص علوم الحاسوب",
      category: "أكاديمي",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 دقيقة مضت
      status: "pending"
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // محاكاة تحديث الإحصائيات
    const updateStats = () => {
      setStats(prev => ({
        ...prev,
        totalQuestions: prev.totalQuestions + Math.floor(Math.random() * 3),
        todayQuestions: prev.todayQuestions + Math.floor(Math.random() * 2),
        activeUsers: Math.floor(Math.random() * 50) + 10
      }));
    };

    const interval = setInterval(updateStats, 10000); // تحديث كل 10 ثواني
    return () => clearInterval(interval);
  }, []);

  const categories = ['all', 'تسجيل', 'خدمات', 'أكاديمي', 'تقني'];

  const filteredQuestions = selectedCategory === 'all' 
    ? recentQuestions 
    : recentQuestions.filter(q => q.category === selectedCategory);

  const getStatusColor = (status) => {
    switch(status) {
      case 'answered': return '#4caf50';
      case 'pending': return '#ff9800';
      case 'urgent': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `${minutes} دقيقة مضت`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ساعة مضت`;
    
    const days = Math.floor(hours / 24);
    return `${days} يوم مضى`;
  };

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <h1>📊 لوحة التحكم - Ask MEU</h1>
        <p>إدارة ومراقبة استفسارات الطلاب</p>
      </header>

      {/* الإحصائيات السريعة */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">💬</div>
            <div className="stat-info">
              <span className="stat-number">{stats.totalQuestions}</span>
              <span className="stat-label">إجمالي الأسئلة</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <span className="stat-number">{stats.todayQuestions}</span>
              <span className="stat-label">أسئلة اليوم</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <span className="stat-number">{stats.activeUsers}</span>
              <span className="stat-label">المستخدمون النشطون</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-info">
              <span className="stat-number">{stats.avgResponseTime}</span>
              <span className="stat-label">متوسط وقت الاستجابة</span>
            </div>
          </div>
        </div>
      </section>

      {/* الأسئلة الحديثة */}
      <section className="questions-section">
        <div className="section-header">
          <h2>الأسئلة الحديثة</h2>
          
          {/* فلترة حسب الفئة */}
          <div className="category-filters">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'all' ? 'الكل' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="questions-list">
          {filteredQuestions.map(question => (
            <div key={question.id} className="question-item">
              <div className="question-content">
                <div className="question-text">{question.question}</div>
                <div className="question-meta">
                  <span className="question-category">{question.category}</span>
                  <span className="question-time">{formatTime(question.timestamp)}</span>
                </div>
              </div>
              
              <div className="question-actions">
                <span 
                  className="question-status"
                  style={{ backgroundColor: getStatusColor(question.status) }}
                >
                  {question.status === 'answered' ? 'تم الرد' : 'في الانتظار'}
                </span>
                <button className="action-btn">عرض</button>
                <button className="action-btn secondary">رد</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* الإجراءات السريعة */}
      <section className="quick-actions">
        <h3>إجراءات سريعة</h3>
        <div className="actions-grid">
          <button className="action-card">
            <span className="action-icon">📝</span>
            <span>إضافة إجابة جاهزة</span>
          </button>
          
          <button className="action-card">
            <span className="action-icon">📊</span>
            <span>تقرير مفصل</span>
          </button>
          
          <button className="action-card">
            <span className="action-icon">⚙️</span>
            <span>إعدادات النظام</span>
          </button>
          
          <button className="action-card">
            <span className="action-icon">👨‍🎓</span>
            <span>إدارة المستخدمين</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;