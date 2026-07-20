/**
 * Vuex Draft Workspace Module — in-memory comments/notes for the legal draft PDF viewer
 *
 * This is intentionally NOT backed by the database yet — it exists so that
 * comments/notes typed while reviewing a draft survive switching tabs or
 * navigating between pages within the same running session, instead of
 * being lost the moment the PDF viewer widget unmounts (which is what
 * happened when this lived as local component state). A full page reload
 * still starts fresh, same as before — nothing is persisted server-side.
 *
 * Workspaces are keyed by meetingId (the widget's existing `meetingId` prop),
 * matching how the participant app's equivalent (client-only) store works.
 *
 * @module store/modules/meeting/draft-workspace
 */

const state = () => ({
  workspaces: {}
})

function ensureWorkspace(state, key) {
  if (!state.workspaces[key]) {
    state.workspaces[key] = { comments: [], notes: [] }
  }
  return state.workspaces[key]
}

const getters = {
  workspace: (state) => (key) => {
    return state.workspaces[key] || { comments: [], notes: [] }
  }
}

const mutations = {
  addComment(state, { key, comment }) {
    ensureWorkspace(state, key).comments.push(comment)
  },
  removeComment(state, { key, id }) {
    const ws = ensureWorkspace(state, key)
    ws.comments = ws.comments.filter(c => c.id !== id)
  },
  addReply(state, { key, commentId, reply }) {
    const comment = ensureWorkspace(state, key).comments.find(c => c.id === commentId)
    if (comment) {
      if (!Array.isArray(comment.replies)) comment.replies = []
      comment.replies.push(reply)
    }
  },
  addNote(state, { key, note }) {
    ensureWorkspace(state, key).notes.unshift(note)
  },
  removeNote(state, { key, id }) {
    const ws = ensureWorkspace(state, key)
    ws.notes = ws.notes.filter(n => n.id !== id)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
