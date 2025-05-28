import React, { useState, useEffect } from 'react';
import './Analytics.css';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('today');
  const [stats, setStats] = useState({
    totalQuestions: 247,
    answeredQuestions: 235,
    avgResponseTime: '1.8s',
    userSatisfaction: 4.3,
    activeUsers: 89,
    topCategories: [
      { name: 'التسجيل', count: 45, percentage: 32 },
      { name: 'الخدمات الأكاديمية', count: 38, percentage: 27 },
      { name: 'المكتبة', count: 28, percentage: 20 },
      { name: 'التخصصات', count: 21, percentage: 15 },
      { name: 'أخرى', count: 8, percentage: 6 }
    ]
  });

  const [chartData, setChartData] = useState({
    daily: [
      { day: 'السبت', questions: 35, answers: 32 },
      { day: 'الأحد', questions: 42, answers: 40 },
      { day: 'الاثنين', questions: 38, answers: 36 },
      { day: 'الثلاثاء', questions: 45, answers: 43 },
      { day: 'الأربعاء', questions: 40, answers: 38 },
      { day: 'الخميس', questions: 47, answers: 46 },
      { day: 'الجمعة', questions: 0, questions: 0 }
    ],
    hourly: [
      { hour: '8:00', count: 12 },
      { hour: '9:00', count: 25 },
      { hour: '10:00', count: 35 },
      { hour: '11:00', count: 42 },
      { hour: '12:00', count: 38 },
      { hour: '13:00', count: 28 },
      { hour: '14:00', count: 45 },
      { hour: '15:00', count: 40 },
      { hour: '16:00', count: 30 },
      { hour: '17:00', count: 15 }
    ]
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'question',
      content: 'كيف أسجل مادة اختيارية؟',
      user: 'طالب #1234',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      status: 'answered'
    },
    {
      id: 2,
      type: 'question',
      content: 'ما هي مواعيد الامتحانات النهائية؟',
      user: 'طالب #5678',
      timestamp: new Date(Date.now() - 1000 * 60 * 12),
      status: 'answered'
    },
    {
      id: 3,
      type: 'question',
      content: 'معلومات عن منحة التميز الأكاديمي',
      user: 'طالب #9012',
      timestamp: new Date(Date.now() - 1000 * 60 * 18),
      status: 'pending'
    }
  ]);

  useEffect(() => {
    // محاكاة تحديث البيانات كل 30 ثانية
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        activeUsers: Math.floor(Math.random() * 20) + 70,
        totalQuestions: prev.totalQuestions + Math.floor(Math.random() * 3)
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `${minutes} دقيقة مضت`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ساعة مضت`;
    
    return 'أكثر من يوم';
  };

  const getStatusColor = (status) => {
    return status === 'answered' ? '#4caf50' : '#ff9800';
  };

  return (
    <div className="analytics-container">
      <header className="analytics-header">
        <h1>📈 تحليلات وإحصائيات Ask MEU</h1>
        <p>مراقبة الأداء وتحليل استخدام النظام</p>
        
        {/* فلترة حسب الوقت */}
        <div className="time-filters">
          <button 
            className={`time-btn ${timeRange === 'today' ? 'active' : ''}`}
            onClick={() => setTimeRange('today')}
          >
            اليوم
          </button>
          <button 
            className={`time-btn ${timeRange === 'week' ? 'active' : ''}`}
            onClick={() => setTimeRange('week')}
          >
            هذا الأسبوع
          </button>
          <button 
            className={`time-btn ${timeRange === 'month' ? 'active' : ''}`}
            onClick={() => setTimeRange('month')}
          >
            هذا الشهر
          </button>
        </div>
      </header>

      {/* الإحصائيات الرئيسية */}
      <section className="main-stats">
        <div className="stat-card-large">
          <div className="stat-icon">💬</div>
          <div className="stat-details">
            <span className="stat-number">{stats.totalQuestions}</span>
            <span className="stat-label">إجمالي الأسئلة</span>
            <span className="stat-change">↗️ +12% من الأسبوع الماضي</span>
          </div>
        </div>

        <div className="stat-card-large">
          <div className="stat-icon">✅</div>
          <div className="stat-details">
            <span className="stat-number">{stats.answeredQuestions}</span>
            <span className="stat-label">الأسئلة المُجابة</span>
            <span className="stat-change">
              📊 {Math.round((stats.answeredQuestions / stats.totalQuestions) * 100)}% معدل الإجابة
            </span>
          </div>
        </div>

        <div className="stat-card-large">
          <div className="stat-icon">⚡</div>
          <div className="stat-details">
            <span className="stat-number">{stats.avgResponseTime}</span>
            <span className="stat-label">متوسط وقت الاستجابة</span>
            <span className="stat-change">⬇️ تحسن 0.3 ثانية</span>
          </div>
        </div>

        <div className="stat-card-large">
          <div className="stat-icon">⭐</div>
          <div className="stat-details">
            <span className="stat-number">{stats.userSatisfaction}</span>
            <span className="stat-label">تقييم المستخدمين</span>
            <span className="stat-change">🌟 من أصل 5 نجوم</span>
          </div>
        </div>
      </section>

      {/* الرسوم البيانية */}
      <section className="charts-section">
        <div className="chart-container">
          <h3>📊 الأسئلة اليومية</h3>
          <div className="simple-chart">
            {chartData.daily.map((item, index) => (
              <div key={index} className="chart-bar">
                <div 
                  className="bar-fill"
                  style={{ height: `${(item.questions / 50) * 100}%` }}
                ></div>
                <span className="bar-label">{item.day}</span>
                <span className="bar-value">{item.questions}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-container">
          <h3>🕐 توزيع الأسئلة حسب الساعة</h3>
          <div className="simple-chart horizontal">
            {chartData.hourly.map((item, index) => (
              <div key={index} className="chart-row">
                <span className="row-label">{item.hour}</span>
                <div className="row-bar">
                  <div 
                    className="row-fill"
                    style={{ width: `${(item.count / 50) * 100}%` }}
                  ></div>
                </div>
                <span className="row-value">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* أهم الفئات */}
      <section className="categories-section">
        <h3>🏷️ أكثر الفئات استفساراً</h3>
        <div className="categories-grid">
          {stats.topCategories.map((category, index) => (
            <div key={index} className="category-card">
              <div className="category-info">
                <span className="category-name">{category.name}</span>
                <span className="category-count">{category.count} سؤال</span>
              </div>
              <div className="category-progress">
                <div 
                  className="progress-fill"
                  style={{ width: `${category.percentage}%` }}
                ></div>
              </div>
              <span className="category-percentage">{category.percentage}%</span>
            </div>
          ))}
        </div>
      </section>

      {/* النشاط الحديث */}
      <section className="activity-section">
        <h3>🔄 النشاط الحديث</h3>
        <div className="activity-list">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">
                {activity.type === 'question' ? '❓' : '💬'}
              </div>
              <div className="activity-content">
                <div className="activity-text">{activity.content}</div>
                <div className="activity-meta">
                  <span>{activity.user}</span>
                  <span>{formatTime(activity.timestamp)}</span>
                </div>
              </div>
              <div 
                className="activity-status"
                style={{ backgroundColor: getStatusColor(activity.status) }}
              >
                {activity.status === 'answered' ? 'تم الرد' : 'في انتظار'}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* معلومات إضافية */}
      <section className="additional-info">
        <div className="info-card">
          <h4>📱 إحصائيات الجهاز</h4>
          <div className="device-stats">
            <div className="device-item">
              <span>الهاتف المحمول</span>
              <span>65%</span>
            </div>
            <div className="device-item">
              <span>سطح المكتب</span>
              <span>30%</span>
            </div>
            <div className="device-item">
              <span>الجهاز اللوحي</span>
              <span>5%</span>
            </div>
          </div>
        </div>

        <div className="info-card">
          <h4>🌐 أكثر المتصفحات استخداماً</h4>
          <div className="browser-stats">
            <div className="browser-item">
              <span>Chrome</span>
              <span>72%</span>
            </div>
            <div className="browser-item">
              <span>Safari</span>
              <span>18%</span>
            </div>
            <div className="browser-item">
              <span>Firefox</span>
              <span>10%</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Analytics;