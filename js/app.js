/* === App Entry Point & Event Handlers === */
/* Depends on: data.js, state.js, render.js, animations.js */

/* -------------------------------------------------------
   View Mode Switching (4 Navigation Modes)
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

function selectFolderTab(tabId) {
  if (activeTabId === tabId) return;
  activeTabId = tabId;
  animateChannelSwitch(function() {
    renderTabsMode();
  });
}

function selectStoryAvatar(spaceId) {
  if (activeAvatarId === spaceId) return;
  activeAvatarId = spaceId;
  animateChannelSwitch(function() {
    renderStoriesMode();
  });
}

/* -------------------------------------------------------
   Touch Swipe Gesture Handler for Tabs Mode
   ------------------------------------------------------- */

var touchStartX = 0;
var touchStartY = 0;
var touchEndX = 0;
var touchEndY = 0;

function setupSwipeGestures() {
  var container = document.getElementById('channelsListContainer');
  if (!container) return;

  container.addEventListener('touchstart', function(e) {
    if (currentViewMode !== 'tabs') return;
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  container.addEventListener('touchend', function(e) {
    if (currentViewMode !== 'tabs') return;
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipeGesture();
  }, { passive: true });
}

function handleSwipeGesture() {
  var deltaX = touchEndX - touchStartX;
  var deltaY = touchEndY - touchStartY;

  // Ensure horizontal swipe
  if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 40) {
    var tabsList = ['all'].concat(SPACES_DATA.map(function(s) { return s.id; }));
    var currentIndex = tabsList.indexOf(activeTabId);

    if (deltaX < 0 && currentIndex < tabsList.length - 1) {
      // Swiped Left -> Next tab
      selectFolderTab(tabsList[currentIndex + 1]);
    } else if (deltaX > 0 && currentIndex > 0) {
      // Swiped Right -> Prev tab
      selectFolderTab(tabsList[currentIndex - 1]);
    }
  }
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

  // Push transition
  document.getElementById('chatView').classList.remove('hidden-right');
  document.getElementById('channelsView').classList.add('slide-left');

  // Scroll to bottom
  setTimeout(function() {
    var area = document.getElementById('messagesArea');
    if (area) area.scrollTop = area.scrollHeight;
  }, 50);

  // Trigger demo scenario
  scheduleDemoMessage();
}

function closeChat() {
  document.getElementById('chatView').classList.add('hidden-right');
  document.getElementById('channelsView').classList.remove('slide-left');
  currentChannelId = null;

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

  channel.messages.push({
    sender: 'Вы',
    time: timeStr,
    text: text,
    isOutgoing: true
  });

  channel.lastSender = 'Вы';
  channel.lastText = text;
  channel.time = timeStr;

  input.value = '';
  renderChatMessages(channel);

  var area = document.getElementById('messagesArea');
  if (area) area.scrollTop = area.scrollHeight;
}

function toggleAudioPlay(btn) {
  btn.textContent = (btn.textContent === '▶') ? '⏸' : '▶';
}

/* -------------------------------------------------------
   Demo Scenario (Section 11, Steps 7-8)
   ------------------------------------------------------- */

function scheduleDemoMessage() {
  if (demoTriggered) return;
  if (currentSpaceId !== 'bhakti') return;

  demoTimer = setTimeout(function() {
    demoTriggered = true;
    demoTimer = null;

    var result = findChannelGlobally('gov_kirtan');
    if (!result) return;

    var kirtan = result.channel;

    kirtan.messages.push({
      sender: 'Гаура Даси',
      time: '11:05',
      text: 'Какой красивый киртан! Послушала, и сердце радуется 🙏'
    });

    kirtan.unread += 1;
    kirtan.lastSender = 'Гаура Даси';
    kirtan.lastText = 'Какой красивый киртан! Послушала, и сердце радуется 🙏';
    kirtan.time = '11:05';

    var badge = document.getElementById('externalBadge');
    var unreadCount = (currentViewMode === 'spaces') ? getExternalUnreadCount() : getTotalUnreadCount();
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
    if (['spaces', 'accordion', 'tabs', 'stories'].indexOf(savedMode) !== -1) {
      currentViewMode = savedMode;
    }
  } catch (e) {}

  renderApp();
  setupSwipeGestures();
});
