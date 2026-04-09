  // Clock
  function updateClocks() {
    const now = new Date();
    const fmt = d => d.toTimeString().slice(0,5);
    const utc2 = new Date(now.toLocaleString('en-US', {timeZone:'UTC'}));
    utc2.setHours(utc2.getHours()+2);
    document.getElementById('clock-server').textContent = fmt(utc2);
    document.getElementById('clock-local').textContent = fmt(now);
  }
  updateClocks();
  setInterval(updateClocks, 1000);
 
  // Tab switching
  function openTab(name, el) {
    document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    document.querySelectorAll('.content-overlay').forEach(o => o.classList.remove('visible'));
    document.getElementById('overlay-' + name).classList.add('visible');
  }
 
  function closeOverlay() {
    document.querySelectorAll('.content-overlay').forEach(o => o.classList.remove('visible'));
    document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
  }
 
  // Course tab toggle
  document.querySelectorAll('.course-tab').forEach(ct => {
    ct.addEventListener('click', () => {
      document.querySelectorAll('.course-tab').forEach(c => c.classList.remove('active'));
      ct.classList.add('active');
    });
  });
 
  // Settings toggles
  function toggleSetting(el) {
    if (el.classList.contains('on')) {
      el.classList.replace('on','off');
      el.textContent = '✕';
    } else {
      el.classList.replace('off','on');
      el.textContent = '✓';
    }
  }
 
  // Glitch effect on char frame click
  document.getElementById('charFrame').addEventListener('click', function() {
    this.style.filter = 'hue-rotate(90deg) brightness(1.4)';
    setTimeout(() => this.style.filter = '', 300);
  });