/* === DOM Rendering (depends on state.js, data.js) === */

/**
 * Main render: header, info pill, badge, channel cards.
 */
function renderApp() {
  var space = getCurrentSpace();

  // Header title
  document.getElementById('currentSpaceName').textContent = space.name;

  // Info pill
  document.getElementById('infoPillText').textContent =
    'Вы просматриваете каналы пространства «' + space.name + '»';

  // External unread badge (Section 6.4)
  var extUnread = getExternalUnreadCount();
  var badge = document.getElementById('externalBadge');
  if (extUnread > 0) {
    badge.style.display = 'flex';
    badge.textContent = extUnread;
  } else {
    badge.style.display = 'none';
  }

  // Channel cards
  renderChannelCards(space);

  // Space list (keep in sync if sheet is open)
  renderSpaceList();
}

/**
 * Render channel cards for a given space.
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
