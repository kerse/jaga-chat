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

/**
 * Accordion toggle: CSS-only collapse/expand without full re-render.
 * Preserves scroll position and enables chevron transition.
 */
function toggleSpaceAccordion(spaceId) {
  collapsedSpaces[spaceId] = !collapsedSpaces[spaceId];

  var section = document.querySelector('.accordion-section[data-space-id="' + spaceId + '"]');
  if (section) {
    section.classList.toggle('collapsed', collapsedSpaces[spaceId]);
  }
}

function selectFolderTab(tabId) {
  if (activeTabId === tabId) return;
  activeTabId = tabId;

  // Only crossfade the channel list, not the sticky tabs bar
  animateChannelSwitch(function() {
    renderTabsContent();
  });

  // Update tabs bar visuals without full re-render
  var tabs = document.querySelectorAll('.folder-tab');
  var tabsList = ['all'].concat(SPACES_DATA.map(function(s) { return s.id; }));
  tabs.forEach(function(tab, i) {
    tab.classList.toggle('active', tabsList[i] === tabId);
  });

  // Scroll active tab into view
  var activetab = document.querySelector('.folder-tab.active');
  if (activetab) activetab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

function selectStoryAvatar(spaceId) {
  if (activeAvatarId === spaceId) return;
  activeAvatarId = spaceId;

  // Only crossfade the channel list, not the sticky avatar rail
  animateChannelSwitch(function() {
    var currentAvatarSpace = SPACES_DATA.find(function(s) { return s.id === activeAvatarId; }) || SPACES_DATA[0];
    var container = document.getElementById('channelsListContainer');
    container.innerHTML = '';
    currentAvatarSpace.channels.forEach(function(ch) {
      container.appendChild(createChannelCard(ch, null));
    });
  });

  // Update avatar visuals without full re-render
  var avatars = document.querySelectorAll('.avatar-item');
  avatars.forEach(function(av) {
    av.classList.remove('active');
  });
  // Find and activate the right one
  SPACES_DATA.forEach(function(sp, i) {
    if (sp.id === spaceId && avatars[i]) {
      avatars[i].classList.add('active');
      avatars[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  });
}

/* -------------------------------------------------------
   Touch Swipe Gesture Handler for Tabs Mode
   ------------------------------------------------------- */

var touchStartX = 0;
var touchStartY = 0;
var touchSwipeTarget = null;

function setupSwipeGestures() {
  var container = document.getElementById('channelsListContainer');
  if (!container) return;

  container.addEventListener('touchstart', function(e) {
    if (currentViewMode !== 'tabs') return;

    // Don't intercept swipes on the folder tabs bar itself
    var target = e.target;
    while (target && target !== container) {
      if (target.classList && target.classList.contains('folder-tabs')) return;
      target = target.parentElement;
    }

    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    touchSwipeTarget = container;
  }, { passive: true });

  container.addEventListener('touchend', function(e) {
    if (currentViewMode !== 'tabs' || !touchSwipeTarget) return;
    touchSwipeTarget = null;

    var deltaX = e.changedTouches[0].screenX - touchStartX;
    var deltaY = e.changedTouches[0].screenY - touchStartY;

    // Must be a clear horizontal swipe (not vertical scroll)
    if (Math.abs(deltaX) > 60 && Math.abs(deltaY) < 40) {
      var tabsList = ['all'].concat(SPACES_DATA.map(function(s) { return s.id; }));
      var currentIndex = tabsList.indexOf(activeTabId);

      if (deltaX < 0 && currentIndex < tabsList.length - 1) {
        selectFolderTab(tabsList[currentIndex + 1]);
      } else if (deltaX > 0 && currentIndex > 0) {
        selectFolderTab(tabsList[currentIndex - 1]);
      }
    }
  }, { passive: true });
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

  // Only update currentSpaceId in Spaces mode (avoid cross-mode state pollution)
  if (currentViewMode === 'spaces') {
    currentSpaceId = space.id;
  }

  // Clear unread for this channel
  channel.unread = 0;

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

  // Re-render to update unread badges after reading a channel
  renderApp();
}

/* -------------------------------------------------------
   Message Sending
   ------------------------------------------------------- */

function handleInputKey(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
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
   Simulates new message in Говардхан → Киртан
   while user is viewing a Бхакти-санга chat.
   ------------------------------------------------------- */

function scheduleDemoMessage() {
  if (demoTriggered) return;

  // Check if the opened channel belongs to the Bhakti space
  var lookup = currentChannelId ? findChannelGlobally(currentChannelId) : null;
  if (!lookup || lookup.space.id !== 'bhakti') return;

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

    // If user currently has gov_kirtan open, append the message live
    if (currentChannelId === 'gov_kirtan') {
      renderChatMessages(kirtan);
      var area = document.getElementById('messagesArea');
      if (area) area.scrollTop = area.scrollHeight;
    }

    // Re-render the background channel list to update badges
    renderApp();
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
