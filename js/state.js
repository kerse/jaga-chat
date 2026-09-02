/* === Application State (depends on data.js) === */

var currentSpaceId = 'general';
var currentChannelId = null;
var demoTriggered = false;
var demoTimer = null;

// View Mode: 'spaces' | 'accordion' | 'tabs' | 'stories'
var currentViewMode = 'accordion';
var collapsedSpaces = {}; // spaceId -> boolean (true = collapsed)

// State for Tabs mode ('all' or spaceId)
var activeTabId = 'all';

// State for Stories mode (spaceId)
var activeAvatarId = 'general';

function getCurrentSpace() {
  return SPACES_DATA.find(function(s) { return s.id === currentSpaceId; }) || SPACES_DATA[0];
}

function findChannelGlobally(channelId) {
  for (var i = 0; i < SPACES_DATA.length; i++) {
    var ch = SPACES_DATA[i].channels.find(function(c) { return c.id === channelId; });
    if (ch) return { space: SPACES_DATA[i], channel: ch };
  }
  return null;
}

function getExternalUnreadCount() {
  var count = 0;
  SPACES_DATA.forEach(function(s) {
    if (s.id !== currentSpaceId) {
      s.channels.forEach(function(c) {
        count += (c.unread || 0);
      });
    }
  });
  return count;
}

function getTotalUnreadCount() {
  var count = 0;
  SPACES_DATA.forEach(function(s) {
    s.channels.forEach(function(c) {
      count += (c.unread || 0);
    });
  });
  return count;
}

function getSpaceUnreadCount(spaceId) {
  var space = SPACES_DATA.find(function(s) { return s.id === spaceId; });
  if (!space) return 0;
  return space.channels.reduce(function(acc, c) { return acc + (c.unread || 0); }, 0);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
