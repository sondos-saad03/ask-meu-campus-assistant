import React, { useState, useEffect } from 'react';
import './Settings.css';

const Settings = ({ theme, setTheme, onClearHistory, chatHistory }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    saveHistory: true,
    autoSuggestions: true,
    soundEffects: false,
    language: 'ar'
  });

  const [exportFormat, setExportFormat] = useState('txt');

  useEffect(() => {
    // تحميل الإعدادات المحفوظة
    const savedSettings = localStorage.getItem('askMEUSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('askMEUSettings', JSON.stringify(newSettings));
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('askMEUTheme', newTheme);
  };

  const exportChatHistory = () => {
    if (chatHistory.length === 0) {
      alert('لا يوجد محادثات لتصديرها!');
      return;
    }

    const exportData = chatHistory.map(item => ({
      type: item.type === 'question' ? 'سؤال' : 'إجابة',
      content: item.content,
      time: item.timestamp.toLocaleString('ar-SA')
    }));

    if (exportFormat === 'json') {
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ask-meu-chat-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
    } else {
      let textData = 'تاريخ المحادثات - Ask MEU\n';
      textData += '================================\n\n';
      
      exportData.forEach((item, index) => {
        textData += `${index + 1}. ${item.type}: ${item.content}\n`;
        textData += `   الوقت: ${item.time}\n\n`;
      });

      const dataBlob = new Blob([textData], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ask-meu-chat-${new Date().toISOString().split('T')[0]}.txt`;
      link.click();
    }
  };

  const clearAllData = () => {
    if (window.confirm('هل أنت متأكد من حذف جميع البيانات؟ هذا الإجراء لا يمكن التراجع عنه.')) {
      localStorage.removeItem('askMEUChatHistory');
      localStorage.removeItem('askMEUSettings');
      localStorage.removeItem('askMEUTheme');
      onClearHistory();
      alert('تم حذف جميع البيانات بنجاح!');
    }
  };

  const getStorageSize = () => {
    let total = 0;
    for (let key in localStorage) {
      if (key.startsWith('askMEU')) {
        total += localStorage[key].length;
      }
    }
    return (total / 1024).toFixed(2); // KB
  };

  return (
    <div className={`settings-container ${theme}`}>
      <header className="settings-header">
        <h1>⚙️ إعدادات Ask MEU</h1>
        <p>تخصيص تجربة استخدام المساعد الذكي</p>
      </header>

      {/* إعدادات المظهر */}
      <section className="settings-section">
        <h3>🎨 المظهر والتخصيص</h3>
        
        <div className="setting-item">
          <label>السمة (Theme)</label>
          <div className="theme-selector">
            <button
              className={`theme-btn light ${theme === 'light' ? 'active' : ''}`}
              onClick={() => handleThemeChange('light')}
            >
              ☀️ فاتح
            </button>
            <button
              className={`theme-btn dark ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => handleThemeChange('dark')}
            >
              🌙 داكن
            </button>
            <button
              className={`theme-btn auto ${theme === 'auto' ? 'active' : ''}`}
              onClick={() => handleThemeChange('auto')}
            >
              🔄 تلقائي
            </button>
          </div>
        </div>

        <div className="setting-item">
          <label>اللغة</label>
          <select
            value={settings.language}
            onChange={(e) => handleSettingChange('language', e.target.value)}
            className="setting-select"
          >
            <option value="ar">العربية</option>
            <option value="en">English</option>
          </select>
        </div>
      </section>

      {/* إعدادات الوظائف */}
      <section className="settings-section">
        <h3>🔧 إعدادات الوظائف</h3>
        
        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => handleSettingChange('notifications', e.target.checked)}
            />
            تفعيل الإشعارات
          </label>
          <small>إشعارات عند وصول إجابات جديدة</small>
        </div>

        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={settings.saveHistory}
              onChange={(e) => handleSettingChange('saveHistory', e.target.checked)}
            />
            حفظ تاريخ المحادثات
          </label>
          <small>حفظ المحادثات تلقائياً في المتصفح</small>
        </div>

        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={settings.autoSuggestions}
              onChange={(e) => handleSettingChange('autoSuggestions', e.target.checked)}
            />
            الاقتراحات التلقائية
          </label>
          <small>عرض اقتراحات أسئلة ذكية</small>
        </div>

        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={settings.soundEffects}
              onChange={(e) => handleSettingChange('soundEffects', e.target.checked)}
            />
            الأصوات والتأثيرات
          </label>
          <small>تشغيل أصوات عند التفاعل</small>
        </div>
      </section>

      {/* إدارة البيانات */}
      <section className="settings-section">
        <h3>💾 إدارة البيانات</h3>
        
        <div className="data-stats">
          <div className="stat-item">
            <span>عدد المحادثات المحفوظة:</span>
            <span className="stat-value">{chatHistory.length}</span>
          </div>
          <div className="stat-item">
            <span>حجم البيانات المخزنة:</span>
            <span className="stat-value">{getStorageSize()} KB</span>
          </div>
        </div>

        <div className="data-actions">
          <div className="export-section">
            <label>تصدير المحادثات:</label>
            <div className="export-controls">
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="export-format"
              >
                <option value="txt">ملف نصي (.txt)</option>
                <option value="json">JSON (.json)</option>
              </select>
              <button
                onClick={exportChatHistory}
                className="export-btn"
                disabled={chatHistory.length === 0}
              >
                📥 تصدير
              </button>
            </div>
          </div>

          <div className="danger-zone">
            <h4>⚠️ منطقة الخطر</h4>
            <button
              onClick={clearAllData}
              className="danger-btn"
            >
              🗑️ حذف جميع البيانات
            </button>
            <small>سيتم حذف جميع المحادثات والإعدادات نهائياً</small>
          </div>
        </div>
      </section>

      {/* معلومات التطبيق */}
      <section className="settings-section">
        <h3>ℹ️ معلومات التطبيق</h3>
        
        <div className="app-info">
          <div className="info-item">
            <span>الإصدار:</span>
            <span>1.0.0</span>
          </div>
          <div className="info-item">
            <span>آخر تحديث:</span>
            <span>{new Date().toLocaleDateString('ar-SA')}</span>
          </div>
          <div className="info-item">
            <span>المطور:</span>
            <span>فريق جامعة الشرق الأوسط</span>
          </div>
        </div>

        <div className="support-links">
          <a href="mailto:info@meu.edu.jo" className="support-link">
            📧 تواصل معنا
          </a>
          <a href="https://meu.edu.jo" className="support-link" target="_blank" rel="noopener noreferrer">
            🌐 موقع الجامعة
          </a>
        </div>
      </section>
    </div>
  );
};

export default Settings;