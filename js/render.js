/* === DOM Rendering (depends on state.js, data.js) === */

/**
 * Main render function.
 */
function renderApp() {
  renderModeSwitcher();

  if (currentViewMode === 'accordion') {
    renderAccordionMode();
  } else {
    renderSpacesMode();
  }

  // Bottom sheet sync
  renderSpaceList();
}

/**
 * Render Mode Switcher (Segmented Control).
 */
function renderModeSwitcher() {
  var container = document.getElementById('modeSwitcherContainer');
  if (!container) return;

  var isSpaces = currentViewMode === 'spaces';
  var isAccordion = currentViewMode === 'accordion';

  container.innerHTML =
    '<div class="mode-switcher">' +
      '<button class="mode-btn ' + (isSpaces ? 'active' : '') + '" onclick="setViewMode(\'spaces\')">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">' +
          '<rect x="3" y="3" width="7" height="7"></rect>' +
          '<rect x="14" y="3" width="7" height="7"></rect>' +
          '<rect x="14" y="14" width="7" height="7"></rect>' +
          '<rect x="3" y="14" width="7" height="7"></rect>' +
        '</svg>' +
        '<span>Пространства</span>' +
      '</button>' +
      '<button class="mode-btn ' + (isAccordion ? 'active' : '') + '" onclick="setViewMode(\'accordion\')">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">' +
          '<line x1="8" y1="6" x2="21" y2="6"></line>' +
          '<line x1="8" y1="12" x2="21" y2="12"></line>' +
          '<line x1="8" y1="18" x2="21" y2="18"></line>' +
          '<line x1="3" y1="6" x2="3.01" y2="6"></line>' +
          '<line x1="3" y1="12" x2="3.01" y2="12"></line>' +
          '<line x1="3" y1="18" x2="3.01" y2="18"></line>' +
        '</svg>' +
        '<span>Аккордеон</span>' +
      '</button>' +
    '</div>';
}

/**
 * Render Mode 1: Classic Isolated Spaces with Bottom Sheet.
 */
function renderSpacesMode() {
  var space = getCurrentSpace();

  // Header title & chevron
  var titleBtn = document.getElementById('spaceTitleBtn');
  if (titleBtn) {
    titleBtn.onclick = openSpaceSheet;
    titleBtn.innerHTML =
      '<span id="currentSpaceName">' + escapeHtml(space.name) + '</span>' +
      '<svg viewBox="0 0 24 24" fill="none">' +
        '<path d="M6 9l6 6 6-6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"/>' +
      '</svg>';
  }

  // Header icon button
  var iconBtn = document.getElementById('spaceIconBtn');
  if (iconBtn) iconBtn.style.display = 'flex';

  // Info pill
  var infoWrap = document.querySelector('.info-banner-wrap');
  if (infoWrap) infoWrap.style.display = 'block';
  document.getElementById('infoPillText').textContent =
    'Вы просматриваете каналы пространства «' + space.name + '»';

  // Section title
  var sectionTitle = document.querySelector('.section-title');
  if (sectionTitle) {
    sectionTitle.style.display = 'block';
    sectionTitle.textContent = 'Каналы';
  }

  // External unread badge (sum in other spaces)
  var extUnread = getExternalUnreadCount();
  var badge = document.getElementById('externalBadge');
  if (extUnread > 0) {
    badge.style.display = 'flex';
    badge.textContent = extUnread;
  } else {
    badge.style.display = 'none';
  }

  // Channel cards for current space
  renderChannelCards(space);
}

/**
 * Render Mode 2: Accordion (All spaces & channels in single list).
 */
function renderAccordionMode() {
  // Header title
  var titleBtn = document.getElementById('spaceTitleBtn');
  if (titleBtn) {
    titleBtn.onclick = null; // No need for bottom sheet in accordion mode
    titleBtn.innerHTML =
      '<span id="currentSpaceName">JAGA.CHAT</span>';
  }

  // Header icon button shows total unreads
  var iconBtn = document.getElementById('spaceIconBtn');
  if (iconBtn) iconBtn.style.display = 'flex';

  var totalUnread = getTotalUnreadCount();
  var badge = document.getElementById('externalBadge');
  if (totalUnread > 0) {
    badge.style.display = 'flex';
    badge.textContent = totalUnread;
  } else {
    badge.style.display = 'none';
  }

  // Info pill
  var infoWrap = document.querySelector('.info-banner-wrap');
  if (infoWrap) infoWrap.style.display = 'block';
  document.getElementById('infoPillText').textContent =
    'Все пространства и каналы в одном месте';

  // Hide standalone section title (each accordion card has its header)
  var sectionTitle = document.querySelector('.section-title');
  if (sectionTitle) sectionTitle.style.display = 'none';

  // Render accordion container
  renderAccordionView();
}

/**
 * Render all spaces and their channels as accordion sections.
 */
function renderAccordionView() {
  var container = document.getElementById('channelsListContainer');
  container.innerHTML = '';

  var wrap = document.createElement('div');
  wrap.className = 'accordion-container';

  SPACES_DATA.forEach(function(sp) {
    var isCollapsed = Boolean(collapsedSpaces[sp.id]);
    var spaceUnread = getSpaceUnreadCount(sp.id);

    var section = document.createElement('div');
    section.className = 'accordion-section' +
      (sp.isSystem ? ' system-level' : '') +
      (isCollapsed ? ' collapsed' : '');

    var tagHtml = sp.isSystem ? '<span class="system-tag">Главное</span>' : '';

    // Accordion Header
    var header = document.createElement('div');
    header.className = 'accordion-header';
    header.onclick = function() { toggleSpaceAccordion(sp.id); };

    header.innerHTML =
      '<div class="accordion-icon">' + sp.icon + '</div>' +
      '<div class="accordion-info">' +
        '<div class="accordion-title">' + escapeHtml(sp.name) + ' ' + tagHtml + '</div>' +
        '<div class="accordion-subtitle">' + escapeHtml(sp.subtitle) + '</div>' +
      '</div>' +
      '<div class="accordion-trailing">' +
        (spaceUnread > 0
          ? '<div class="accordion-unread">' + spaceUnread + '</div>'
          : '') +
        '<svg class="accordion-chevron" viewBox="0 0 24 24" fill="none">' +
          '<path d="M6 9l6 6 6-6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>' +
      '</div>';

    section.appendChild(header);

    // Accordion Channels List
    var channelsDiv = document.createElement('div');
    channelsDiv.className = 'accordion-channels';

    sp.channels.forEach(function(ch) {
      var card = document.createElement('div');
      card.className = 'accordion-channel-card';
      card.onclick = function(e) {
        e.stopPropagation();
        openChat(ch.id);
      };

      var iconSvg = ICONS[ch.iconType] || ICONS.chat;

      card.innerHTML =
        '<div class="accordion-channel-icon" style="background:' + ch.iconBg + ';color:' + ch.iconColor + '">' +
          iconSvg +
        '</div>' +
        '<div class="accordion-channel-info">' +
          '<div class="accordion-channel-title">' + escapeHtml(ch.name) + '</div>' +
          '<div class="accordion-channel-preview">' + escapeHtml(ch.lastSender) + ': ' + escapeHtml(ch.lastText) + '</div>' +
        '</div>' +
        '<div class="accordion-channel-meta">' +
          '<div class="accordion-channel-time">' + escapeHtml(ch.time) + '</div>' +
          (ch.unread > 0
            ? '<div class="accordion-channel-unread">' + ch.unread + '</div>'
            : '') +
        '</div>';

      channelsDiv.appendChild(card);
    });

    section.appendChild(channelsDiv);
    wrap.appendChild(section);
  });

  container.appendChild(wrap);
}

/**
 * Render channel cards for a given space (Spaces mode).
 */
function renderChannelCards(space) {
  var container = document.getElementById('channelsListContainer');
  container.innerHTML = '';

  space.channels.forEach(function(ch) {
    var card = document.createElement('div');
    card.className = 'channel-card';
    card.onclick = function() { openChat(ch.id); };

    var iconSvg = ICONS[ch.iconType] || ICONS.chat;

    card.innerHTML =
      '<div class="channel-icon-box" style="background:' + ch.iconBg + ';color:' + ch.iconColor + '">' +
        iconSvg +
      '</div>' +
      '<div class="channel-info">' +
        '<div class="channel-title">' + escapeHtml(ch.name) + '</div>' +
        '<div class="channel-preview">' + escapeHtml(ch.lastSender) + ': ' + escapeHtml(ch.lastText) + '</div>' +
      '</div>' +
      '<div class="channel-meta">' +
        '<div class="channel-time">' + escapeHtml(ch.time) + '</div>' +
        (ch.unread > 0
          ? '<div class="channel-unread">' + ch.unread + '</div>'
          : '') +
      '</div>';

    container.appendChild(card);
  });
}

/**
 * Render bottom sheet space list (Section 6.2).
 */
function renderSpaceList() {
  var container = document.getElementById('spaceListContainer');
  if (!container) return;
  container.innerHTML = '';

  SPACES_DATA.forEach(function(sp, idx) {
    if (idx === 1) {
      var header = document.createElement('div');
      header.className = 'space-section-header';
      header.textContent = 'Пространства учителей (Гуру)';
      container.appendChild(header);
    }

    var isActive = sp.id === currentSpaceId;
    var unread = getSpaceUnreadCount(sp.id);

    var item = document.createElement('div');
    item.className = 'space-item' + (sp.isSystem ? ' system-space' : '') + (isActive ? ' active' : '');
    item.onclick = function() { selectSpace(sp.id); };

    var tagHtml = sp.isSystem ? '<span class="system-tag">Главное</span>' : '';

    item.innerHTML =
      '<div class="space-item-icon">' + sp.icon + '</div>' +
      '<div class="space-item-info">' +
        '<div class="space-item-name">' + escapeHtml(sp.name) + ' ' + tagHtml + '</div>' +
        '<div class="space-item-desc">' + escapeHtml(sp.subtitle) + '</div>' +
      '</div>' +
      '<div class="space-item-trailing">' +
        (unread > 0
          ? '<div class="space-unread-badge">' + unread + '</div>'
          : '') +
        (isActive
          ? '<div class="space-check">✓</div>'
          : '') +
      '</div>';

    container.appendChild(item);
  });
}

/**
 * Render chat messages for a channel (Section 6.3).
 */
function renderChatMessages(channel) {
  var area = document.getElementById('messagesArea');
  if (!area) return;
  area.innerHTML = '';

  // Date divider
  var dateDiv = document.createElement('div');
  dateDiv.className = 'date-divider';
  dateDiv.textContent = 'Сегодня';
  area.appendChild(dateDiv);

  if (!channel.messages || channel.messages.length === 0) return;

  channel.messages.forEach(function(msg, idx) {
    var row = document.createElement('div');
    row.className = 'message-row' + (msg.isOutgoing ? ' outgoing' : '');
    // Stagger animation slightly
    row.style.animationDelay = (idx * 30) + 'ms';

    var initials = (msg.sender || 'U').split(' ').map(function(n) { return n[0]; }).join('').substring(0, 2);

    var bodyHtml;
    if (msg.isAudio) {
      var bars = [8, 14, 18, 10, 16, 12, 20, 15, 9, 17, 13, 7, 19, 11, 15, 8];
      bodyHtml =
        '<div class="msg-bubble" style="padding-bottom:6px">' +
          '<div style="font-weight:600;margin-bottom:4px">' + escapeHtml(msg.text) + '</div>' +
          '<div class="audio-card">' +
            '<button class="audio-play-btn" onclick="toggleAudioPlay(this)">▶</button>' +
            '<div class="audio-waveform">' +
              bars.map(function(h) { return '<div class="audio-bar" style="height:' + h + 'px"></div>'; }).join('') +
            '</div>' +
            '<div class="audio-duration">' + (msg.audioDuration || '32:14') + '</div>' +
          '</div>' +
        '</div>';
    } else {
      bodyHtml = '<div class="msg-bubble">' + escapeHtml(msg.text) + '</div>';
    }

    row.innerHTML =
      (!msg.isOutgoing ? '<div class="msg-avatar">' + initials + '</div>' : '') +
      '<div class="msg-content-wrap">' +
        '<div class="msg-sender-time">' +
          (!msg.isOutgoing ? '<span class="msg-sender">' + escapeHtml(msg.sender) + '</span>' : '') +
          '<span class="msg-time">' + escapeHtml(msg.time) + '</span>' +
        '</div>' +
        bodyHtml +
      '</div>';

    area.appendChild(row);
  });
}
