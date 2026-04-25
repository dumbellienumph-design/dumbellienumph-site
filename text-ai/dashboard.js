/* ── Navigation ── */
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.dash-section');

navItems.forEach(item => {
  item.addEventListener('click', () => {
    const target = item.dataset.section;
    navItems.forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    sections.forEach(s => {
      s.classList.remove('active');
      if (s.id === target) {
        s.classList.add('active');
        // Re-trigger scroll animations
        s.querySelectorAll('.animate-on-scroll').forEach(el => {
          el.classList.remove('visible');
          void el.offsetWidth;
          el.classList.add('visible');
        });
      }
    });
  });
});

/* ── Toggle switches ── */
document.querySelectorAll('.toggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    const label = toggle.parentElement.querySelector('.toggle-label');
    if (label) {
      if (toggle.classList.contains('active')) {
        label.textContent = 'Connected';
        label.className = 'toggle-label connected';
      } else {
        label.textContent = 'Disconnected';
        label.className = 'toggle-label disconnected';
      }
    }
  });
});

/* ── Conversation list click ── */
const convoItems = document.querySelectorAll('.convo-item');
convoItems.forEach(item => {
  item.addEventListener('click', () => {
    convoItems.forEach(c => c.classList.remove('active'));
    item.classList.add('active');
  });
});

/* ── AI Slider ── */
const slider = document.getElementById('ai-personality');
if (slider) {
  const updateSlider = () => {
    const val = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.setProperty('--val', val + '%');
    const labels = slider.closest('.slider-container').querySelectorAll('.slider-labels span');
    labels.forEach(l => l.classList.remove('active'));
    if (slider.value <= 33) labels[0].classList.add('active');
    else if (slider.value <= 66) labels[1].classList.add('active');
    else labels[2].classList.add('active');
  };
  slider.addEventListener('input', updateSlider);
  updateSlider();
}

/* ── Scroll reveal ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

// Trigger animations for initially visible section
setTimeout(() => {
  document.querySelectorAll('#overview .animate-on-scroll').forEach(el => {
    el.classList.add('visible');
  });
}, 100);

/* ── Save button feedback ── */
document.querySelectorAll('.save-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const orig = btn.textContent;
    btn.textContent = '✓ Saved';
    btn.style.background = 'rgba(34,197,94,.2)';
    btn.style.color = '#4ade80';
    btn.style.boxShadow = '0 0 20px rgba(34,197,94,.2)';
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      btn.style.color = '';
      btn.style.boxShadow = '';
    }, 1500);
  });
});

/* ── Send AI reply ── */
document.querySelectorAll('.ai-btn.primary').forEach(btn => {
  btn.addEventListener('click', () => {
    const suggestion = btn.closest('.ai-suggestion');
    const msgText = suggestion.querySelector('p').textContent;
    const chatMessages = document.querySelector('.chat-messages');
    
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message outgoing';
    msgDiv.style.animation = 'fadeIn .3s ease';
    msgDiv.innerHTML = `
      <div class="message-bubble">${msgText}</div>
      <span class="message-time">Just now</span>
    `;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    btn.textContent = '✓ Sent';
    setTimeout(() => { btn.textContent = 'Send Reply'; }, 1200);
  });
});
