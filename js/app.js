/* === App Entry Point & Event Handlers === */
/* Depends on: data.js, state.js, render.js, animations.js */

/* -------------------------------------------------------
   View Mode Switching (Spaces vs Accordion)
   ------------------------------------------------------- */

function setViewMode(mode) {
  if (currentViewMode === mode) return;
  currentViewMode = mode;
  try {
    localStorage.setItem('jaga_view_mode', mode);
  } catch (e) {}

  animateChannelSwitch(function() {
    renderApp();
  });
}

function toggleSpaceAccordion(spaceId) {
  collapsedSpaces[spaceId] = !collapsedSpaces[spaceId];
  renderAccordionView();
}

/* -------------------------------------------------------
   Bottom Sheet (Flow 3)
   ------------------------------------------------------- */

function openSpaceSheet() {
  renderSpaceList();
  document.getElementById('sheetOverlay').classList.add('open');
  document.getElementById('bottomSheet').classList.add('open');
}

function closeSpaceSheet() {
  document.getElementById('sheetOverlay').classList.remove('open');
  document.getElementById('bottomSheet').classList.remove('open');
}

function selectSpace(spaceId) {
  if (spaceId === currentSpaceId) {
    closeSpaceSheet();
    return;
  }
  currentSpaceId = spaceId;
  closeSpaceSheet();

  // Section 8: channel list crossfade on space switch
  animateChannelSwitch(function() {
    renderApp();
  });
}

/* -------------------------------------------------------
   Chat Navigation (Flow 2)
   ------------------------------------------------------- */

function openChat(channelId) {
  currentChannelId = channelId;
  var lookup = findChannelGlobally(channelId);
  if (!lookup) return;

  var space = lookup.space;
  var channel = lookup.channel;
  currentSpaceId = space.id;

  // Clear unread for this channel
  channel.unread = 0;
  renderApp();

  // Set chat header
  document.getElementById('chatHeaderTitle').textContent = channel.name;
  document.getElementById('chatHeaderSpace').textContent = space.name;

  // Render messages
  renderChatMessages(channel);

  // Section 8: horizontal slide transition, 200ms
  document.getElementById('chatView').classList.remove('hidden-right');
  document.getElementById('channelsView').classList.add('slide-left');

  // Scroll to bottom
  setTimeout(function() {
    var area = document.getElementById('messagesArea');
    if (area) area.scrollTop = area.scrollHeight;
  }, 50);

  // Section 11: trigger demo scenario when in Бхакти-санга (Бхакти Вигьяна Госвами)
  scheduleDemoMessage();
}

function closeChat() {
  document.getElementById('chatView').classList.add('hidden-right');
  document.getElementById('channelsView').classList.remove('slide-left');
  currentChannelId = null;

  // Cancel pending demo timer if navigating away
  if (demoTimer) {
    clearTimeout(demoTimer);
    demoTimer = null;
  }

  renderApp();
}

/* -------------------------------------------------------
   Message Sending
   ------------------------------------------------------- */

function handleInputKey(e) {
  if (e.key === 'Enter') {
    sendChatMessage();
  }
}

function sendChatMessage() {
  var input = document.getElementById('chatInput');
  if (!input) return;
  var text = input.value.trim();
  if (!text || !currentChannelId) return;

  var lookup = findChannelGlobally(currentChannelId);
  if (!lookup) return;

  var channel = lookup.channel;

  var now = new Date();
  var timeStr =
    now.getHours().toString().padStart(2, '0') + ':' +
    now.getMinutes().toString().padStart(2, '0');

  // Add message to data
  channel.messages.push({
    sender: 'Вы',
    time: timeStr,
    text: text,
    isOutgoing: true
  });

  // Update channel preview
  channel.lastSender = 'Вы';
  channel.lastText = text;
  channel.time = timeStr;

  // Clear input and re-render
  input.value = '';
  renderChatMessages(channel);

  // Scroll to bottom
  var area = document.getElementById('messagesArea');
  if (area) area.scrollTop = area.scrollHeight;
}

function toggleAudioPlay(btn) {
  btn.textContent = (btn.textContent === '▶') ? '⏸' : '▶';
}

/* -------------------------------------------------------
   Demo Scenario (Section 11, Steps 7-8)
   Simulates new message in Говардхан → Киртан
   while user is viewing a Бхакти-санга chat.
   ------------------------------------------------------- */

function scheduleDemoMessage() {
  if (demoTriggered) return;
  if (currentSpaceId !== 'bhakti') return;

  demoTimer = setTimeout(function() {
    demoTriggered = true;
    demoTimer = null;

    // Find Говардхан → Киртан
    var result = findChannelGlobally('gov_kirtan');
    if (!result) return;

    var kirtan = result.channel;

    // Add a new mock message
    kirtan.messages.push({
      sender: 'Гаура Даси',
      time: '11:05',
      text: 'Какой красивый киртан! Послушала, и сердце радуется 🙏'
    });

    // Bump unread
    kirtan.unread += 1;
    kirtan.lastSender = 'Гаура Даси';
    kirtan.lastText = 'Какой красивый киртан! Послушала, и сердце радуется 🙏';
    kirtan.time = '11:05';

    // Update external badge with animation
    var badge = document.getElementById('externalBadge');
    var unreadCount = (currentViewMode === 'accordion') ? getTotalUnreadCount() : getExternalUnreadCount();
    if (unreadCount > 0 && badge) {
      badge.style.display = 'flex';
      badge.textContent = unreadCount;
      pulseBadge(badge);
    }
  }, 4000);
}

/* -------------------------------------------------------
   Initialization
   ------------------------------------------------------- */

window.addEventListener('DOMContentLoaded', function() {
  try {
    var savedMode = localStorage.getItem('jaga_view_mode');
    if (savedMode === 'spaces' || savedMode === 'accordion') {
      currentViewMode = savedMode;
    }
  } catch (e) {}

  renderApp();
});
