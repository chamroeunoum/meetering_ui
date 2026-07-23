<template>
  <div
    class="draft-pdf-section font-ktr"
    :class="mode === 'page' ? 'mode-page bg-secondary' : ''"
  >
    <!-- Header -->
    <div class="draft-header bg-card border border-default" :class="mode === 'page' ? 'header-page' : ''">
      <div class="header-row">
        <div class="header-left">
          <router-link
            v-if="mode === 'page' && meetingId"
            :to="{ name: 'MeetingDetail', params: { id: meetingId } }"
            class="back-link text-secondary"
          >
            <svg class="icon-md" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M10.295 19.716a1 1 0 0 0 1.404-1.424l-5.37-5.292h13.67a1 1 0 0 0 0-2H6.336L11.7 5.707a1 1 0 0 0-1.404-1.424l-6.924 6.822a1.25 1.25 0 0 0 0 1.79l6.924 6.822z" fill="currentColor"/></g></svg>
          </router-link>
          <div class="file-icon border-default text-secondary">
            <svg class="icon-lg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M8.75 11.5a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5zm0 2.75a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5zm0 2.75a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5z" fill="currentColor"/></g></svg>
          </div>
          <div class="header-meta">
            <h1 class="font-moul header-title text-primary">{{ displayTitle }}</h1>
            <div class="header-tags">
              <n-tag v-if="statusLabel" :type="statusTagType" size="small" round strong>{{ statusLabel }}</n-tag>
              <span class="text-muted">v{{ activeVersion.version_number }}</span>
              <span v-if="regulator" class="text-muted">{{ regulator }}</span>
            </div>
          </div>
        </div>

        <div class="header-actions">
          <n-tag v-if="pdfSource" size="small" type="error" round>PDF</n-tag>
          <n-button size="small" @click="downloadFile">ទាញយក</n-button>
          <n-button v-if="pdfSource && canUpload" size="small" @click="openUploadDocumentModal">ផ្ទុកជំនួសឯកសារ</n-button>
          <n-badge :value="comments.length" :max="99" :show="comments.length > 0" :offset="[-4, 4]">
            <n-button size="small" :type="showComments ? 'primary' : 'default'" @click="toggleComments">មើលមតិ PDF</n-button>
          </n-badge>
          <n-button v-if="mode !== 'page'" size="small" @click="enterFullscreen">មើលពេញអេក្រង់</n-button>
        </div>
      </div>

      <n-alert v-if="lockBanner" :type="lockBanner.type" :show-icon="true" class="lock-banner">
        <div class="lock-banner-row">
          <span>{{ lockBanner.text }}</span>
          <n-button v-if="lockBanner.showLatestBtn" size="tiny" type="warning" secondary @click="goToLatestVersion">ត្រឡប់ទៅកំណែបច្ចុប្បន្ន</n-button>
        </div>
      </n-alert>
    </div>

    <!-- Bring an existing draft document from a meeting version -->
    <n-modal
      v-model:show="showVersionDocumentModal"
      preset="card"
      title="យកឯកសារពីកំណែកិច្ចប្រជុំ"
      style="max-width: 560px"
      :mask-closable="false"
    >
      <n-form label-placement="top">
        <n-form-item label="ឈ្មោះឯកសារ" required>
          <n-input
            v-model:value="versionDocumentForm.name"
            placeholder="សេចក្តីព្រាងគោលនយោបាយទូរគមនាគមន៍"
          />
        </n-form-item>
        <n-form-item label="ជ្រើសរើសកំណែកិច្ចប្រជុំ" required>
          <n-select
            v-model:value="versionDocumentForm.version"
            :options="meetingVersionOptions"
            placeholder="ជ្រើសរើសកំណែ"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <div class="modal-actions">
          <n-button @click="showVersionDocumentModal = false">បោះបង់</n-button>
          <n-button
            type="primary"
            :disabled="!versionDocumentForm.name.trim() || !versionDocumentForm.version"
            @click="confirmVersionDocument"
          >
            យកឯកសារ
          </n-button>
        </div>
      </template>
    </n-modal>

    <!-- Upload a new PDF + DOCX pair -->
    <n-modal
      v-model:show="showUploadDocumentModal"
      preset="card"
      title="ផ្ទុកឯកសារសេចក្តីព្រាងថ្មី"
      style="max-width: 640px"
      :mask-closable="false"
    >
      <n-form label-placement="top">
        <n-form-item label="ឈ្មោះឯកសារ" required>
          <n-input
            v-model:value="uploadDocumentForm.name"
            placeholder="សេចក្តីព្រាងគោលនយោបាយទូរគមនាគមន៍"
          />
        </n-form-item>
        <div class="document-upload-grid">
          <n-form-item label="ឯកសារ PDF" required>
            <n-upload
              v-model:file-list="pdfFileList"
              :default-upload="false"
              :max="1"
              accept=".pdf,application/pdf"
              @update:file-list="onPdfFileListChange"
            >
              <n-upload-dragger>
                <div class="upload-label">ជ្រើសរើសឯកសារ PDF</div>
                <div class="upload-hint">ត្រូវតែមានឯកសារ .pdf</div>
              </n-upload-dragger>
            </n-upload>
          </n-form-item>
          <n-form-item label="ឯកសារ DOCX" required>
            <n-upload
              v-model:file-list="docxFileList"
              :default-upload="false"
              :max="1"
              accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              @update:file-list="onDocxFileListChange"
            >
              <n-upload-dragger>
                <div class="upload-label">ជ្រើសរើសឯកសារ DOCX</div>
                <div class="upload-hint">ត្រូវតែមានឯកសារ .docx</div>
              </n-upload-dragger>
            </n-upload>
          </n-form-item>
        </div>
        <n-alert v-if="uploadValidationMessage" type="warning" :show-icon="true">
          {{ uploadValidationMessage }}
        </n-alert>
      </n-form>
      <template #footer>
        <div class="modal-actions">
          <n-button @click="showUploadDocumentModal = false">បោះបង់</n-button>
          <n-button type="primary" :loading="uploadingDocument" :disabled="!canConfirmUpload" @click="confirmUploadedDocument">
            បញ្ជាក់
          </n-button>
        </div>
      </template>
    </n-modal>

    <!-- Viewer shell -->
    <div
      ref="viewerShell"
      class="draft-pdf-shell border border-default"
      :class="[
        isFullscreen ? 'is-fullscreen' : '',
        mode === 'page' ? 'shell-page' : ''
      ]"
    >
      <!-- Fullscreen toolbar (header is hidden behind the fixed-position shell in fullscreen) -->
      <div v-if="isFullscreen" class="fullscreen-bar bg-card border-default">
        <span class="fullscreen-bar-title font-moul text-primary">{{ displayTitle }}</span>
        <div class="fullscreen-bar-actions">
          <n-tag v-if="pdfSource" size="small" type="error" round>PDF</n-tag>
          <n-button size="small" @click="downloadFile">ទាញយក</n-button>
          <n-button circle secondary :type="showComments ? 'primary' : 'default'" size="small" @click="toggleComments">
            <template #icon>
              <svg class="icon-md" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="14" y1="4" x2="14" y2="20"/></g></svg>
            </template>
          </n-button>
          <n-button circle secondary type="error" size="small" @click="exitFullscreen">
            <template #icon>
              <svg class="icon-md" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2zm3.53 6.47a.75.75 0 0 0-1.06 0L12 10.94L9.53 8.47a.75.75 0 0 0-1.06 1.06L10.94 12l-2.47 2.47a.75.75 0 1 0 1.06 1.06L12 13.06l2.47 2.47a.75.75 0 1 0 1.06-1.06L13.06 12l2.47-2.47a.75.75 0 0 0 0-1.06z" fill="currentColor"/></g></svg>
            </template>
          </n-button>
        </div>
      </div>

      <div class="shell-body">
      <!-- Main file pane -->
      <div ref="pdfPane" class="pdf-pane" @mouseup="onTextSelect">
        <!-- DOCX fallback -->
        <div v-if="fileTab === 'docx'" class="pdf-empty-wrap">
          <n-empty description="ឯកសារប្រភេទ DOCX មិនអាចបង្ហាញដោយផ្ទាល់បានទេ">
            <template #extra>
              <n-button type="primary" size="small" @click="downloadFile">ទាញយកឯកសារ DOCX</n-button>
            </template>
          </n-empty>
        </div>

        <template v-else>
          <div class="pdf-page-bar bg-card border-default">
            <div class="pdf-page-nav text-secondary">
              <n-button size="tiny" quaternary circle :disabled="currentPage <= 1" @click="currentPage--">‹</n-button>
              <span>ទំព័រ {{ currentPage }} / {{ totalPages || '—' }}</span>
              <n-button size="tiny" quaternary circle :disabled="currentPage >= totalPages" @click="currentPage++">›</n-button>
            </div>
            <span class="text-muted">{{ pageComments.length }} មតិនៅទំព័រនេះ</span>
          </div>

          <div v-if="!pdfSource" class="pdf-empty-wrap">
            <n-empty description="មិនទាន់មានឯកសារសេចក្តីព្រាង">
              <template #extra>
                <div v-if="canUpload" class="empty-document-actions">
                  <n-button type="info" secondary @click="openVersionDocumentModal">
                    យកឯកសារពីកំណែកិច្ចប្រជុំ
                  </n-button>
                  <n-button type="primary" @click="openUploadDocumentModal">
                    ផ្ទុកឯកសារថ្មី
                  </n-button>
                </div>
                <div v-if="canUpload" class="empty-document-hint">
                  ឯកសារ PDF នឹងបង្ហាញនៅទីនេះ ហើយ DOCX នឹងរក្សាទុកជាមួយឯកសារ។
                </div>
                <div v-else class="empty-document-hint">
                  មិនអាចផ្ទុកឯកសារបានទេ — កិច្ចប្រជុំនេះបានផ្សាយ ឬបានបញ្ចប់ហើយ។
                </div>
              </template>
            </n-empty>
          </div>

          <div v-else ref="pdfHost" class="pdf-host">
            <div ref="pageWrap" class="page-wrap bg-card">
              <vue-pdf-embed
                ref="pdfEmbed"
                text-layer
                :source="pdfSource"
                :page="currentPage"
                :width="pdfWidth || undefined"
                class="pdf-embed"
                @loaded="onPdfLoaded"
                @rendered="onPdfRendered"
                @rendering-failed="onPdfError"
              />

              <div class="highlight-layer">
                <div
                  v-for="(r, ri) in pendingHighlightRects"
                  :key="'pending-' + ri"
                  class="highlight-box highlight-pending"
                  :style="{ left: r.x + '%', top: r.y + '%', width: r.w + '%', height: r.h + '%' }"
                />
                <template v-for="c in pageComments" :key="'hl-' + c.id">
                  <div
                    v-for="(r, ri) in (selectedCommentId === c.id ? (c.rects || []) : [])"
                    :key="c.id + '-' + ri"
                    class="highlight-box highlight-active"
                    :style="{ left: r.x + '%', top: r.y + '%', width: r.w + '%', height: r.h + '%' }"
                  />
                </template>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Floating Add Comment tip -->
      <Teleport to="body">
        <div
          v-if="addCommentTip.visible && fileTab === 'pdf'"
          class="selection-tip"
          :style="{ left: addCommentTip.x + 'px', top: addCommentTip.y + 'px' }"
          @mousedown.stop
        >
          <button type="button" class="selection-tip-btn" @click="startCommentFromSelection">Add Comment</button>
          <button type="button" class="selection-tip-btn selection-tip-close" @click="dismissTip">✕</button>
        </div>
      </Teleport>

      <!-- Right sidebar -->
      <aside v-if="showComments" class="draft-sidebar bg-card border-default" :class="isFullscreen || mode === 'page' ? 'sidebar-full' : ''">
        <n-tabs
          v-model:value="sidebarTab"
          type="line"
          size="small"
          justify-content="space-evenly"
          class="sidebar-tabs"
          :pane-wrapper-style="paneWrapperStyle"
          :pane-style="paneStyle"
        >
          <!-- Comments -->
          <n-tab-pane name="comment" :tab="`មតិ (${comments.length})`">
            <!-- List view: all comments -->
            <template v-if="!openThread">
              <n-scrollbar class="pane-scroll">
                <n-empty v-if="comments.length === 0" class="pane-empty" description="ជ្រើសអត្ថបទក្នុង PDF រួចចុច Add Comment ឬសរសេរផ្ទាល់ខាងក្រោម" />
                <div
                  v-for="c in comments"
                  :key="c.id"
                  class="list-item"
                  :class="{ 'list-item-active': selectedCommentId === c.id }"
                  @click="openCommentThread(c)"
                >
                  <n-avatar round size="small" class="item-avatar">{{ (c.creator || '?').charAt(0) }}</n-avatar>
                  <div class="item-body">
                    <div class="item-head">
                      <span class="item-author text-primary">{{ c.creator }}</span>
                      <span class="item-time text-muted">{{ c.created_at }}</span>
                    </div>
                    <div v-if="c.selected_text" class="item-quote line-clamp-2">"{{ c.selected_text }}"</div>
                    <p class="item-text text-secondary line-clamp-2">{{ c.comment }}</p>
                    <div class="item-foot">
                      <span class="text-muted">ទំ. {{ c.page_number }}</span>
                      <span class="text-muted">{{ c.replies.length ? `ឆ្លើយតប ${c.replies.length}` : 'គ្មានការឆ្លើយតប' }}</span>
                    </div>
                  </div>
                </div>
              </n-scrollbar>

              <div class="composer border-default">
                <div v-if="pendingQuote" class="quote-chip">
                  <span class="quote-chip-text line-clamp-2">"{{ pendingQuote.text }}"</span>
                  <n-button quaternary circle size="tiny" @click="clearPendingQuote">✕</n-button>
                </div>
                <div class="composer-row">
                  <n-input
                    ref="commentInput"
                    v-model:value="commentDraftText"
                    type="textarea"
                    :autosize="{ minRows: 1, maxRows: 4 }"
                    placeholder="សរសេរមតិយោបល់... (Enter ដើម្បីផ្ញើ)"
                    :disabled="!effectiveEditable"
                    @keydown.enter="handleCommentEnter"
                  />
                  <n-button
                    circle
                    type="primary"
                    :disabled="!effectiveEditable || !commentDraftText.trim()"
                    @click="submitComment"
                  >
                    <template #icon><SendIcon /></template>
                  </n-button>
                </div>
              </div>
            </template>

            <!-- Thread view: one comment + its full conversation -->
            <template v-else>
              <div class="thread-header border-default">
                <n-button text size="small" @click="closeThread">
                  <template #icon>
                    <svg class="icon-sm" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M10.295 19.716a1 1 0 0 0 1.404-1.424l-5.37-5.292h13.67a1 1 0 0 0 0-2H6.336L11.7 5.707a1 1 0 0 0-1.404-1.424l-6.924 6.822a1.25 1.25 0 0 0 0 1.79l6.924 6.822z" fill="currentColor"/></g></svg>
                  </template>
                  ត្រឡប់ទៅមតិទាំងអស់
                </n-button>
                <n-button v-if="effectiveEditable" text type="error" size="tiny" @click="removeComment(openThread.id)">លុបមតិនេះ</n-button>
              </div>

              <n-scrollbar class="pane-scroll">
                <div class="thread-root">
                  <n-avatar round size="small" class="item-avatar">{{ (openThread.creator || '?').charAt(0) }}</n-avatar>
                  <div class="item-body">
                    <div class="item-head">
                      <span class="item-author text-primary">{{ openThread.creator }}</span>
                      <span class="item-time text-muted">{{ openThread.created_at }}</span>
                    </div>
                    <div v-if="openThread.selected_text" class="item-quote">"{{ openThread.selected_text }}"</div>
                    <p class="item-text text-secondary">{{ openThread.comment }}</p>
                    <div class="item-foot"><span class="text-muted">ទំ. {{ openThread.page_number }}</span></div>
                  </div>
                </div>

                <div class="reply-list">
                  <n-empty v-if="openThread.replies.length === 0" class="pane-empty" description="មិនទាន់មានការឆ្លើយតប" />
                  <div v-for="r in openThread.replies" :key="r.id" class="reply-item">
                    <n-avatar round :size="20" class="item-avatar">{{ (r.creator || '?').charAt(0) }}</n-avatar>
                    <div class="item-body">
                      <div class="item-head">
                        <span class="item-author text-primary">{{ r.creator }}</span>
                        <span class="item-time text-muted">{{ r.created_at }}</span>
                      </div>
                      <p class="item-text text-secondary">{{ r.text }}</p>
                    </div>
                  </div>
                </div>
              </n-scrollbar>

              <div class="composer border-default">
                <div class="composer-row">
                  <n-input
                    v-model:value="replyDraftText"
                    type="textarea"
                    :autosize="{ minRows: 1, maxRows: 4 }"
                    placeholder="សរសេរការឆ្លើយតប... (Enter ដើម្បីផ្ញើ)"
                    :disabled="!effectiveEditable"
                    @keydown.enter="handleReplyEnter($event, openThread)"
                  />
                  <n-button
                    circle
                    type="primary"
                    :disabled="!effectiveEditable || !replyDraftText.trim()"
                    @click="submitReply(openThread)"
                  >
                    <template #icon><SendIcon /></template>
                  </n-button>
                </div>
              </div>
            </template>
          </n-tab-pane>

          <!-- History / Version control -->
          <n-tab-pane name="history" tab="ប្រវត្តិ">
            <n-scrollbar class="pane-scroll">
              <n-empty v-if="versions.length === 0" class="pane-empty" description="មិនទាន់មានប្រវត្តិ" />
              <n-timeline v-else class="version-timeline">
                <n-timeline-item
                  v-for="v in versions"
                  :key="v.id"
                  :type="v.id === activeVersion.id ? 'success' : 'default'"
                  class="version-item"
                  :class="{ 'version-item-active': v.id === selectedVersionId }"
                  @click="selectVersion(v)"
                >
                  <template #header>
                    <div class="version-item-header">
                      <span class="version-number text-primary">v{{ v.version_number }}</span>
                      <n-tag size="tiny" :type="v.status === 'final' ? 'success' : 'info'" round>{{ v.status === 'final' ? 'ចុងក្រោយ' : 'កំពុងដំណើរការ' }}</n-tag>
                      <n-tag v-if="v.id === versions[0].id" size="tiny" type="success" round>បច្ចុប្បន្ន</n-tag>
                    </div>
                  </template>
                  <div class="version-message text-secondary">{{ v.message }}</div>
                  <div class="version-meta text-muted">{{ v.actor }} · {{ v.created_at }}</div>
                </n-timeline-item>
              </n-timeline>
            </n-scrollbar>
          </n-tab-pane>
        </n-tabs>
      </aside>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, nextTick, onMounted, onBeforeUnmount, h } from 'vue'
import { useStore } from 'vuex'
import { useMessage } from 'naive-ui'
import { getUser } from '@plugins/authentication'
import VuePdfEmbed from 'vue-pdf-embed'
import 'vue-pdf-embed/dist/styles/textLayer.css'

const SAMPLE_PDF = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'

function nowStamp() {
  return new Date().toISOString().slice(0, 16).replace('T', ' ')
}

function getOrderedSelectionText(range, textLayer) {
  if (!textLayer) return (range.toString() || '').replace(/\s+/g, ' ').trim()
  const spans = Array.from(textLayer.querySelectorAll('span')).filter(span => {
    if (!span.textContent) return false
    try { return range.intersectsNode(span) } catch (e) { return false }
  })
  if (!spans.length) return (range.toString() || '').replace(/\s+/g, ' ').trim()
  spans.sort((a, b) => {
    const ra = a.getBoundingClientRect()
    const rb = b.getBoundingClientRect()
    if (Math.abs(ra.top - rb.top) > 4) return ra.top - rb.top
    return ra.left - rb.left
  })
  const browserText = (range.toString() || '').replace(/\s+/g, ' ').trim()
  const orderedText = spans.map(s => s.textContent || '').join('').replace(/\s+/g, ' ').trim()
  if (browserText && orderedText.includes(browserText)) return browserText
  if (orderedText && browserText.includes(orderedText)) return orderedText
  return browserText || orderedText
}

function getMockVersions(currentVersion = 4) {
  const version = Math.max(1, parseInt(currentVersion) || 1)
  const versions = [
    { id: 4, version_number: 4, status: 'progressing', message: 'កែសម្រួលតាមមតិយោបល់ពីក្រសួងសេដ្ឋកិច្ច — ត្រៀមដាក់អនុម័តក្នុងកិច្ចប្រជុំនេះ', actor: 'H.E. សុខ ហេង', created_at: '2026-07-05 09:20', pdf_url: '' },
    { id: 3, version_number: 3, status: 'final', message: 'កែសម្រួលផ្នែកវិសាលភាព និងបន្ថែមទិន្នន័យថវិកា', actor: 'អ្នកស្រី ចន្ថា សុគន្ធ', created_at: '2026-06-28 14:10', pdf_url: '' },
    { id: 2, version_number: 2, status: 'final', message: 'បញ្ចូលមតិពីក្រុមការងារបច្ចេកទេស', actor: 'លោក ដារ៉ា មករា', created_at: '2026-06-15 10:00', pdf_url: '' },
    { id: 1, version_number: 1, status: 'final', message: 'សេចក្តីព្រាងដំបូង — រៀបចំដោយក្រុមការងារគតិយុត្ត', actor: 'ក្រុមការងារគតិយុត្ត', created_at: '2026-06-01 09:00', pdf_url: '' }
  ]
  if (version > 4) {
    versions.unshift({
      id: version,
      version_number: version,
      status: 'progressing',
      message: `បន្តកិច្ចប្រជុំទៅកំណែទី ${version}`,
      actor: 'អ្នកប្រើប្រាស់បច្ចុប្បន្ន',
      created_at: nowStamp(),
      pdf_url: '',
      docx_url: ''
    })
  }
  return versions.filter(item => item.version_number <= version)
}

const SendIcon = {
  render() {
    return h('svg', { class: 'icon-sm', xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24' }, [
      h('path', { fill: 'currentColor', d: 'M3.4 20.4l17.45-7.48a1 1 0 0 0 0-1.84L3.4 3.6a1 1 0 0 0-1.39 1.09L4.1 12L2 18.31a1 1 0 0 0 1.4 1.09z' })
    ])
  }
}

export default {
  name: 'DraftPdfSection',
  components: { VuePdfEmbed, SendIcon },
  props: {
    mode: { type: String, default: 'embedded' }, // embedded | page
    pdfUrl: { type: String, default: '' },
    docxUrl: { type: String, default: '' },
    editable: { type: Boolean, default: true },
    title: { type: String, default: 'សេចក្តីព្រាង' },
    version: { type: [String, Number], default: '' },
    status: { type: String, default: '' },
    regulator: { type: String, default: '' },
    meetingId: { type: [String, Number], default: '' },
    legalDraftId: { type: [String, Number], default: '' },
    canUpload: { type: Boolean, default: true },
    startWithSidebar: { type: Boolean, default: false }
  },
  setup(props) {
    const message = useMessage()
    const store = useStore()
    // In-memory only (see store/modules/meeting/draft-workspace.js) — survives
    // switching tabs/navigating within the session, resets on a full reload.
    const currentUserName = computed(() => {
      const u = getUser()
      const name = u ? `${u.lastname || ''} ${u.firstname || ''}`.trim() : ''
      return name || 'អ្នកប្រើប្រាស់'
    })
    const displayTitle = ref(props.title || 'សេចក្តីព្រាង')
    const localPdfUrl = ref('')
    const localDocxUrl = ref('')
    const showVersionDocumentModal = ref(false)
    const showUploadDocumentModal = ref(false)
    const versionDocumentForm = reactive({
      name: props.title || 'សេចក្តីព្រាង',
      version: Math.max(1, parseInt(props.version) || 1)
    })
    const uploadDocumentForm = reactive({
      name: props.title || 'សេចក្តីព្រាង'
    })
    const pdfFileList = ref([])
    const docxFileList = ref([])
    const selectedPdfFile = ref(null)
    const selectedDocxFile = ref(null)
    const temporaryDocumentStore = reactive({
      name: '',
      pdf_name: '',
      pdf_url: '',
      docx_name: '',
      docx_url: ''
    })
    let uploadedPdfObjectUrl = ''
    let uploadedDocxObjectUrl = ''
    const pdfEmbed = ref(null)
    const pdfPane = ref(null)
    const pdfHost = ref(null)
    const pageWrap = ref(null)
    const viewerShell = ref(null)
    const commentInput = ref(null)

    const fileTab = ref('pdf')
    const showComments = ref(props.mode === 'page' || props.startWithSidebar)
    const sidebarTab = ref('comment')
    const isFullscreen = ref(false)
    const currentPage = ref(1)
    const totalPages = ref(0)
    const selectedCommentId = ref(null)
    // Comments (annotation + pole + pole comments) are persisted for real —
    // loaded from/saved to the backend.
    const comments = ref([])

    function mapPoleToComment(pole, annotationsById) {
      const ann = annotationsById?.get(pole.annotation_id)
      return {
        id: pole.id,
        annotationId: pole.annotation_id,
        page_number: pole.page_number || 1,
        selected_text: pole.annotation_text || '',
        comment: pole.description || '',
        creator: pole.creator?.name || 'អ្នកប្រើប្រាស់',
        created_at: pole.created_at,
        // The schema stores one box per annotation (not per selection line),
        // so a multi-line highlight collapses back to a single rect on reload.
        rects: ann ? [{ x: ann.x, y: ann.y, w: ann.width, h: ann.height }] : [],
        replies: (pole.comments || []).map((c) => ({
          id: c.id,
          text: c.comment,
          creator: c.creator?.name || 'អ្នកប្រើប្រាស់',
          created_at: c.created_at
        }))
      }
    }

    async function loadDraftSocial() {
      if (!props.legalDraftId) { comments.value = []; return }
      try {
        const res = await store.dispatch('legalDraft/read', { id: props.legalDraftId })
        const record = res.data?.record
        if (!record) return
        const annotationsById = new Map((record.annotations || []).map((a) => [a.id, a]))
        comments.value = (record.poles || []).map((p) => mapPoleToComment(p, annotationsById))

        // The stored files live outside the public disk, so fetch their real
        // content through the authenticated endpoint instead of trusting
        // record.pdf_url/docx_url (which point at a non-public path).
        if (record.pdf_file) {
          store.dispatch('legalDraft/readFile', { id: props.legalDraftId, file_type: 'pdf' })
            .then((r) => { if (r.data?.ok) localPdfUrl.value = r.data.data })
            .catch(() => {})
        }
        if (record.docx_file) {
          store.dispatch('legalDraft/readFile', { id: props.legalDraftId, file_type: 'docx' })
            .then((r) => { if (r.data?.ok) localDocxUrl.value = r.data.data })
            .catch(() => {})
        }
      } catch (e) {
        comments.value = []
      }
    }
    const versions = ref([])
    const selectedVersionId = ref(null)
    const pdfWidth = ref(0)
    const commentDraftText = ref('')
    const pendingQuote = ref(null)
    const openThreadId = ref(null)
    const replyDraftText = ref('')
    let resizeObserver = null

    const meetingVersionOptions = computed(() =>
      versions.value.map(item => ({
        label: `កិច្ចប្រជុំ កំណែទី ${item.version_number}`,
        value: item.version_number
      }))
    )
    const isValidPdf = computed(() => {
      const file = selectedPdfFile.value
      if (!file) return false
      return file.type === 'application/pdf' || /\.pdf$/i.test(file.name || '')
    })
    const isValidDocx = computed(() => {
      const file = selectedDocxFile.value
      if (!file) return false
      return file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || /\.docx$/i.test(file.name || '')
    })
    const canConfirmUpload = computed(() =>
      Boolean(uploadDocumentForm.name.trim() && isValidPdf.value && isValidDocx.value)
    )
    const uploadValidationMessage = computed(() => {
      if (!pdfFileList.value.length && !docxFileList.value.length) return ''
      if (!isValidPdf.value) return 'សូមជ្រើសរើសឯកសារ PDF ត្រឹមត្រូវ។'
      if (!isValidDocx.value) return 'សូមជ្រើសរើសឯកសារ DOCX ត្រឹមត្រូវ។'
      return ''
    })

    const paneWrapperStyle = { flex: '1', display: 'flex', flexDirection: 'column', minHeight: '0' }
    const paneStyle = { flex: '1', display: 'flex', flexDirection: 'column', minHeight: '0', overflow: 'hidden' }

    const addCommentTip = reactive({ visible: false, x: 0, y: 0 })
    const selectionDraft = reactive({ text: '', page_number: 1, rects: [] })

    const activeVersion = computed(() => {
      if (versions.value.length) return versions.value.find(v => v.id === selectedVersionId.value) || versions.value[0]
      return { id: null, version_number: props.version || 1, status: props.status || '', pdf_url: '' }
    })
    const isLatestVersion = computed(() => !versions.value.length || activeVersion.value.id === versions.value[0].id)
    const effectiveEditable = computed(() => props.editable && isLatestVersion.value)

    const lockBanner = computed(() => {
      if (!isLatestVersion.value) {
        return {
          type: 'warning',
          text: `អ្នកកំពុងមើលកំណែ v${activeVersion.value.version_number} — សូមត្រឡប់ទៅកំណែបច្ចុប្បន្នដើម្បីបន្ថែមមតិ។`,
          showLatestBtn: true
        }
      }
      if (!props.editable) {
        return { type: 'warning', text: 'មិនអាចបន្ថែមមតិបានទេនៅពេលនេះ — អាចមើលបានតែប៉ុណ្ណោះ។', showLatestBtn: false }
      }
      return null
    })

    const pdfSource = computed(() => {
      if (localPdfUrl.value) return localPdfUrl.value
      const versionUrl = (activeVersion.value?.pdf_url || '').trim()
      if (versionUrl && versionUrl !== '#') return versionUrl
      const url = (props.pdfUrl || '').trim()
      if (!url || url === '#') return ''
      return url
    })

    const openThread = computed(() => comments.value.find(c => c.id === openThreadId.value) || null)

    const pageComments = computed(() => comments.value.filter(c => c.page_number === currentPage.value))
    const pendingHighlightRects = computed(() => {
      if (!pendingQuote.value || pendingQuote.value.page_number !== currentPage.value) return []
      return pendingQuote.value.rects || []
    })

    const statusLabel = computed(() => {
      const m = { new: 'ថ្មី', progressing: 'កំពុងដំណើរការ', finished: 'បញ្ចប់', final: 'ចុងក្រោយ' }
      return m[activeVersion.value.status] || activeVersion.value.status || ''
    })
    const statusTagType = computed(() => {
      const m = { new: 'warning', progressing: 'info', finished: 'success', final: 'success' }
      return m[activeVersion.value.status] || 'default'
    })

    function updatePdfWidth() {
      const el = pdfHost.value || pdfPane.value
      if (!el) return
      const w = Math.floor(el.clientWidth - 8)
      if (w > 100 && w !== pdfWidth.value) pdfWidth.value = w
    }

    function onPdfLoaded(pdf) {
      totalPages.value = pdf?.numPages || 0
      nextTick(updatePdfWidth)
    }
    function onPdfRendered() {
      pageWrap.value?.querySelector('.textLayer')?.classList.add('pdf-text-selectable')
    }
    function onPdfError(err) {
      console.error(err)
      message.error('មិនអាចបង្ហាញ PDF បានទេ')
    }

    function toggleComments() {
      showComments.value = !showComments.value
      if (showComments.value) sidebarTab.value = 'comment'
      nextTick(updatePdfWidth)
    }

    function enterFullscreen() {
      isFullscreen.value = true
      showComments.value = true
      document.body.style.overflow = 'hidden'
      nextTick(updatePdfWidth)
    }
    function exitFullscreen() {
      isFullscreen.value = false
      document.body.style.overflow = ''
      nextTick(updatePdfWidth)
    }

    function documentBaseName() {
      return (displayTitle.value || 'សេចក្តីព្រាង')
        .replace(/[\\/:*?"<>|]+/g, '-')
        .trim()
    }

    function triggerDownload(url, fileName) {
      if (!url || url === '#') return false
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      link.target = '_blank'
      link.rel = 'noopener'
      document.body.appendChild(link)
      link.click()
      link.remove()
      return true
    }

    function downloadFile() {
      const pdfUrl = temporaryDocumentStore.pdf_url || localPdfUrl.value || activeVersion.value?.pdf_url || props.pdfUrl
      const docxUrl = temporaryDocumentStore.docx_url || localDocxUrl.value || props.docxUrl
      const baseName = documentBaseName()
      const downloadedPdf = triggerDownload(
        pdfUrl,
        temporaryDocumentStore.pdf_name || `${baseName}.pdf`
      )
      const downloadedDocx = triggerDownload(
        docxUrl,
        temporaryDocumentStore.docx_name || `${baseName}.docx`
      )
      if (downloadedPdf && downloadedDocx) {
        message.success('កំពុងទាញយកឯកសារ PDF និង DOCX')
      } else {
        message.info('ត្រូវមានឯកសារ PDF និង DOCX ទាំងពីរ ដើម្បីទាញយក។')
      }
    }

    function openVersionDocumentModal() {
      versionDocumentForm.name = displayTitle.value
      versionDocumentForm.version = activeVersion.value?.version_number || Math.max(1, parseInt(props.version) || 1)
      showVersionDocumentModal.value = true
    }

    function confirmVersionDocument() {
      const selectedVersion = versions.value.find(
        item => item.version_number === versionDocumentForm.version
      )
      if (!selectedVersion || !versionDocumentForm.name.trim()) return
      revokeUploadedObjectUrls()
      displayTitle.value = versionDocumentForm.name.trim()
      selectedVersionId.value = selectedVersion.id
      localPdfUrl.value = selectedVersion.pdf_url || props.pdfUrl || SAMPLE_PDF
      uploadedDocxObjectUrl = URL.createObjectURL(new Blob(
        [`ឯកសារ DOCX គំរូសម្រាប់កិច្ចប្រជុំកំណែទី ${selectedVersion.version_number}`],
        { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
      ))
      localDocxUrl.value = selectedVersion.docx_url || props.docxUrl || uploadedDocxObjectUrl
      const baseName = documentBaseName()
      Object.assign(temporaryDocumentStore, {
        name: displayTitle.value,
        pdf_name: `${baseName}.pdf`,
        pdf_url: localPdfUrl.value,
        docx_name: `${baseName}.docx`,
        docx_url: localDocxUrl.value
      })
      fileTab.value = 'pdf'
      currentPage.value = 1
      showVersionDocumentModal.value = false
      message.success(`បានយកឯកសារពីកិច្ចប្រជុំកំណែទី ${selectedVersion.version_number}`)
    }

    function openUploadDocumentModal() {
      uploadDocumentForm.name = displayTitle.value
      pdfFileList.value = []
      docxFileList.value = []
      selectedPdfFile.value = null
      selectedDocxFile.value = null
      showUploadDocumentModal.value = true
    }

    function onPdfFileListChange(fileList) {
      pdfFileList.value = fileList.slice(-1)
      selectedPdfFile.value = pdfFileList.value[0]?.file || null
    }

    function onDocxFileListChange(fileList) {
      docxFileList.value = fileList.slice(-1)
      selectedDocxFile.value = docxFileList.value[0]?.file || null
    }

    function revokeUploadedObjectUrls() {
      if (uploadedPdfObjectUrl) URL.revokeObjectURL(uploadedPdfObjectUrl)
      if (uploadedDocxObjectUrl) URL.revokeObjectURL(uploadedDocxObjectUrl)
      uploadedPdfObjectUrl = ''
      uploadedDocxObjectUrl = ''
    }

    const uploadingDocument = ref(false)
    async function confirmUploadedDocument() {
      if (!canConfirmUpload.value) return
      if (!props.legalDraftId) {
        message.error('មិនអាចផ្ទុកឯកសារបានទេ — មិនទាន់មានសេចក្តីព្រាងនេះឡើយ។')
        return
      }
      uploadingDocument.value = true
      try {
        const pdfForm = new FormData()
        pdfForm.append('id', props.legalDraftId)
        pdfForm.append('file_type', 'pdf')
        pdfForm.append('file', selectedPdfFile.value)
        const pdfRes = await store.dispatch('legalDraft/uploadFile', pdfForm)

        const docxForm = new FormData()
        docxForm.append('id', props.legalDraftId)
        docxForm.append('file_type', 'docx')
        docxForm.append('file', selectedDocxFile.value)
        const docxRes = await store.dispatch('legalDraft/uploadFile', docxForm)

        if (!pdfRes.data?.ok || !docxRes.data?.ok) throw new Error('upload failed')

        // The backend has now safely stored both files (verified above). For
        // the immediate on-screen preview, use local blob URLs from the same
        // files we just uploaded — the backend's own file_url isn't publicly
        // reachable; reopening this draft later re-fetches the real content
        // through legalDraft/readFile (see loadDraftSocial).
        revokeUploadedObjectUrls()
        uploadedPdfObjectUrl = URL.createObjectURL(selectedPdfFile.value)
        uploadedDocxObjectUrl = URL.createObjectURL(selectedDocxFile.value)
        displayTitle.value = uploadDocumentForm.name.trim()
        localPdfUrl.value = uploadedPdfObjectUrl
        localDocxUrl.value = uploadedDocxObjectUrl
        const baseName = documentBaseName()
        Object.assign(temporaryDocumentStore, {
          name: displayTitle.value,
          pdf_name: selectedPdfFile.value.name || `${baseName}.pdf`,
          pdf_url: uploadedPdfObjectUrl,
          docx_name: selectedDocxFile.value.name || `${baseName}.docx`,
          docx_url: uploadedDocxObjectUrl
        })
        fileTab.value = 'pdf'
        currentPage.value = 1
        showUploadDocumentModal.value = false
        message.success('បានផ្ទុកឯកសារ PDF និង DOCX ដោយជោគជ័យ')
      } catch (e) {
        message.error('មិនអាចផ្ទុកឯកសារបានទេ')
      } finally {
        uploadingDocument.value = false
      }
    }

    function onKeydown(e) {
      if (e.key === 'Escape') {
        if (addCommentTip.visible) dismissTip()
        else if (pendingQuote.value) clearPendingQuote()
        else if (isFullscreen.value) exitFullscreen()
      }
    }

    function getRelativeRects(range, wrapEl) {
      const wrapRect = wrapEl.getBoundingClientRect()
      if (!wrapRect.width || !wrapRect.height) return []
      return Array.from(range.getClientRects())
        .filter(r => r.width > 1 && r.height > 1)
        .map(r => ({
          x: ((r.left - wrapRect.left) / wrapRect.width) * 100,
          y: ((r.top - wrapRect.top) / wrapRect.height) * 100,
          w: (r.width / wrapRect.width) * 100,
          h: (r.height / wrapRect.height) * 100
        }))
    }

    function onTextSelect() {
      if (fileTab.value !== 'pdf') return
      const sel = window.getSelection()
      if (!sel || sel.isCollapsed || !sel.rangeCount) {
        // A plain click on the PDF (not dragging a new selection) clears
        // whichever comment was active, so its highlight disappears too.
        selectedCommentId.value = null
        return
      }
      const wrap = pageWrap.value
      if (!wrap) return
      const anchor = sel.anchorNode
      if (!anchor || !wrap.contains(anchor)) return
      const range = sel.getRangeAt(0)
      const text = getOrderedSelectionText(range, wrap.querySelector('.textLayer'))
      if (!text) return
      const rects = getRelativeRects(range, wrap)
      if (!rects.length) return
      const last = range.getBoundingClientRect()
      const tipWidth = 140
      let x = last.left + last.width / 2 - tipWidth / 2
      let y = last.bottom + 8
      x = Math.min(Math.max(x, 8), window.innerWidth - tipWidth - 8)
      if (y + 44 > window.innerHeight) y = Math.max(last.top - 44, 8)
      selectionDraft.text = text
      selectionDraft.page_number = currentPage.value
      selectionDraft.rects = rects
      addCommentTip.visible = true
      addCommentTip.x = x
      addCommentTip.y = y
    }

    function dismissTip() {
      addCommentTip.visible = false
      window.getSelection()?.removeAllRanges()
    }

    function startCommentFromSelection() {
      if (!selectionDraft.text) return
      pendingQuote.value = {
        text: selectionDraft.text,
        page_number: selectionDraft.page_number,
        rects: [...selectionDraft.rects]
      }
      addCommentTip.visible = false
      showComments.value = true
      sidebarTab.value = 'comment'
      selectedCommentId.value = null
      openThreadId.value = null
      window.getSelection()?.removeAllRanges()
      nextTick(() => {
        setTimeout(() => commentInput.value?.focus?.(), 50)
      })
    }

    function clearPendingQuote() {
      pendingQuote.value = null
    }

    function handleCommentEnter(e) {
      if (e.shiftKey) return
      e.preventDefault()
      submitComment()
    }

    // The backend stores one box per annotation, not one per selected line, so
    // a multi-line selection is saved as the smallest box that fully covers
    // every line's rect — otherwise only the first line would survive a reload.
    function boundingRectOf(rects) {
      if (!rects || !rects.length) return null
      const minX = Math.min(...rects.map(r => r.x))
      const minY = Math.min(...rects.map(r => r.y))
      const maxRight = Math.max(...rects.map(r => r.x + r.w))
      const maxBottom = Math.max(...rects.map(r => r.y + r.h))
      return { x: minX, y: minY, w: maxRight - minX, h: maxBottom - minY }
    }

    async function submitComment() {
      if (!effectiveEditable.value) {
        message.warning('មិនអាចបន្ថែមមតិបានទេនៅពេលនេះ')
        return
      }
      const text = commentDraftText.value.trim()
      if (!text || !props.legalDraftId) return
      const quote = pendingQuote.value
      const boundingRect = boundingRectOf(quote?.rects)
      try {
        const annRes = await store.dispatch('legalDraft/createAnnotation', {
          legal_draft_id: props.legalDraftId,
          page_number: quote ? quote.page_number : currentPage.value,
          x: boundingRect?.x || 0,
          y: boundingRect?.y || 0,
          width: boundingRect?.w || 0,
          height: boundingRect?.h || 0,
          selected_text: quote ? quote.text : '',
          note: text
        })
        const annotation = annRes.data?.record
        if (!annotation) throw new Error('annotation failed')

        const poleRes = await store.dispatch('legalDraft/createPole', {
          legal_draft_id: props.legalDraftId,
          annotation_id: annotation.id,
          title: (quote ? quote.text : text).slice(0, 50),
          description: text
        })
        const pole = poleRes.data?.record
        if (!pole) throw new Error('pole failed')

        const item = {
          id: pole.id,
          annotationId: annotation.id,
          page_number: quote ? quote.page_number : currentPage.value,
          selected_text: quote ? quote.text : '',
          comment: text,
          creator: currentUserName.value,
          created_at: nowStamp(),
          rects: quote ? [...quote.rects] : [],
          replies: []
        }
        comments.value.unshift(item)
        selectedCommentId.value = item.id
        commentDraftText.value = ''
        pendingQuote.value = null
        message.success('បានរក្សាទុកមតិ')
      } catch (e) {
        message.error('មិនអាចរក្សាទុកមតិបានទេ')
      }
    }

    function focusComment(c) {
      selectedCommentId.value = c.id
      fileTab.value = 'pdf'
      if (c.page_number) currentPage.value = c.page_number
    }

    async function removeComment(id) {
      const target = comments.value.find((c) => c.id === id)
      try {
        if (target?.annotationId) {
          await store.dispatch('legalDraft/deleteAnnotation', { id: target.annotationId })
        } else {
          await store.dispatch('legalDraft/deletePole', { id })
        }
        comments.value = comments.value.filter((c) => c.id !== id)
        if (selectedCommentId.value === id) selectedCommentId.value = null
        if (openThreadId.value === id) openThreadId.value = null
        message.success('បានលុបមតិ')
      } catch (e) {
        message.error('មិនអាចលុបមតិបានទេ')
      }
    }

    // Each comment opens its own dedicated thread panel — replies never show inline in the list.
    function openCommentThread(c) {
      focusComment(c)
      openThreadId.value = c.id
      replyDraftText.value = ''
    }

    function closeThread() {
      openThreadId.value = null
      replyDraftText.value = ''
    }

    async function submitReply(c) {
      if (!effectiveEditable.value) {
        message.warning('មិនអាចឆ្លើយតបបានទេនៅពេលនេះ')
        return
      }
      const text = replyDraftText.value.trim()
      if (!text) return
      try {
        const res = await store.dispatch('legalDraft/addPoleComment', { pole_id: c.id, comment: text })
        const saved = res.data?.record
        c.replies.push({
          id: saved?.id || Date.now(),
          text,
          creator: currentUserName.value,
          created_at: nowStamp()
        })
        replyDraftText.value = ''
        // Composer stays open in the thread panel so the user can keep replying.
        message.success('បានផ្ញើការឆ្លើយតប')
      } catch (e) {
        message.error('មិនអាចផ្ញើការឆ្លើយតបបានទេ')
      }
    }

    function handleReplyEnter(e, c) {
      if (e.shiftKey) return
      e.preventDefault()
      submitReply(c)
    }

    function selectVersion(v) {
      selectedVersionId.value = v.id
      fileTab.value = 'pdf'
      currentPage.value = 1
      dismissTip()
      pendingQuote.value = null
    }
    function goToLatestVersion() {
      if (versions.value[0]) selectVersion(versions.value[0])
    }

    watch(() => props.pdfUrl, () => {
      currentPage.value = 1
      dismissTip()
      clearPendingQuote()
    })
    watch(() => props.title, value => {
      if (value) displayTitle.value = value
    })
    watch(() => props.version, value => {
      revokeUploadedObjectUrls()
      versions.value = getMockVersions(value)
      selectedVersionId.value = versions.value[0]?.id ?? null
      versionDocumentForm.version = Math.max(1, parseInt(value) || 1)
      localPdfUrl.value = ''
      localDocxUrl.value = ''
      Object.assign(temporaryDocumentStore, {
        name: '',
        pdf_name: '',
        pdf_url: '',
        docx_name: '',
        docx_url: ''
      })
      currentPage.value = 1
    })

    watch(() => props.legalDraftId, () => { loadDraftSocial() })

    onMounted(() => {
      loadDraftSocial()
      versions.value = getMockVersions(props.version)
      selectedVersionId.value = versions.value[0]?.id ?? null
      document.addEventListener('keydown', onKeydown)
      nextTick(() => {
        updatePdfWidth()
        if (typeof ResizeObserver !== 'undefined') {
          resizeObserver = new ResizeObserver(() => updatePdfWidth())
          if (pdfPane.value) resizeObserver.observe(pdfPane.value)
          if (pdfHost.value) resizeObserver.observe(pdfHost.value)
        }
      })
    })

    onBeforeUnmount(() => {
      document.removeEventListener('keydown', onKeydown)
      document.body.style.overflow = ''
      resizeObserver?.disconnect?.()
      revokeUploadedObjectUrls()
    })

    return {
      pdfEmbed, pdfPane, pdfHost, pageWrap, viewerShell, commentInput,
      displayTitle, showVersionDocumentModal, showUploadDocumentModal,
      versionDocumentForm, uploadDocumentForm, meetingVersionOptions,
      pdfFileList, docxFileList, uploadValidationMessage, canConfirmUpload,
      fileTab, showComments, sidebarTab, isFullscreen, currentPage, totalPages,
      selectedCommentId, comments, versions, selectedVersionId, activeVersion,
      isLatestVersion, effectiveEditable, lockBanner,
      pdfWidth, pdfSource, pageComments, pendingHighlightRects,
      statusLabel, statusTagType, paneWrapperStyle, paneStyle,
      addCommentTip, pendingQuote, commentDraftText,
      openThreadId, openThread, replyDraftText,
      onPdfLoaded, onPdfRendered, onPdfError, toggleComments,
      enterFullscreen, exitFullscreen, downloadFile, onTextSelect,
      openVersionDocumentModal, confirmVersionDocument,
      openUploadDocumentModal, onPdfFileListChange, onDocxFileListChange, confirmUploadedDocument, uploadingDocument,
      dismissTip, startCommentFromSelection, clearPendingQuote,
      handleCommentEnter, submitComment,
      focusComment, removeComment, selectVersion, goToLatestVersion,
      openCommentThread, closeThread, submitReply, handleReplyEnter
    }
  }
}
</script>

<style scoped>
/* ─── Layout shells ────────────────────────────────────── */
.mode-page { min-height: 100vh; display: flex; flex-direction: column; }
.draft-header { border-radius: 8px; margin-bottom: 12px; flex: none; }
.header-page { border-radius: 0; border-left: 0; border-right: 0; border-top: 0; }

.header-row { padding: 12px 16px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; }
.header-left { display: flex; align-items: center; gap: 12px; min-width: 0; }
.back-link { flex: none; }
.file-icon { width: 40px; height: 40px; border-radius: 8px; border-width: 1px; border-style: solid; display: flex; align-items: center; justify-content: center; flex: none; }
.header-meta { min-width: 0; }
.header-title { font-size: 1rem; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.header-tags { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; font-size: 0.75rem; margin-top: 2px; }
.header-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.modal-actions { display: flex; justify-content: flex-end; gap: 8px; }
.document-upload-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.upload-label { font-weight: 700; margin-bottom: 4px; }
.upload-hint { color: var(--text-muted); font-size: 0.75rem; }
.empty-document-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
.empty-document-hint { max-width: 520px; margin-top: 12px; color: var(--text-muted); font-size: 0.78rem; line-height: 1.6; }

@media (max-width: 640px) {
  .document-upload-grid { grid-template-columns: 1fr; }
  .empty-document-actions { flex-direction: column; }
}

.lock-banner { border-radius: 0; border-left: 0; border-right: 0; border-bottom: 0; }
.lock-banner-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; }

.draft-pdf-shell { position: relative; display: flex; flex-direction: column; border-radius: 8px; overflow: hidden; background-color: var(--bg-secondary); flex: 1; height: 720px; }
.draft-pdf-shell.is-fullscreen { position: fixed; inset: 0; z-index: 1000; border-radius: 0; border: 0; height: auto; }
.draft-pdf-shell.shell-page { border-radius: 0; border-left: 0; border-right: 0; border-bottom: 0; height: auto; min-height: 0; }

.fullscreen-bar { flex: none; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 8px 16px; border-bottom-width: 1px; border-bottom-style: solid; }
.fullscreen-bar-title { font-size: 0.95rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.fullscreen-bar-actions { display: flex; align-items: center; gap: 8px; flex: none; }

.shell-body { flex: 1; display: flex; min-height: 0; overflow: hidden; }

.pdf-pane { flex: 1; position: relative; overflow: auto; }
.pdf-empty-wrap { display: flex; align-items: center; justify-content: center; min-height: 420px; padding: 32px; }
.pdf-page-bar { position: sticky; top: 0; z-index: 10; border-bottom-width: 1px; border-bottom-style: solid; padding: 8px 16px; display: flex; align-items: center; justify-content: space-between; font-size: 0.8rem; }
.pdf-page-nav { display: flex; align-items: center; gap: 8px; }
.pdf-host { position: relative; margin: 16px auto; width: 100%; max-width: 900px; padding: 0 8px; }
.page-wrap { position: relative; width: 100%; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12); }
.pdf-embed { width: 100%; }

.highlight-layer { pointer-events: none; position: absolute; inset: 0; z-index: 1; }
.highlight-box { position: absolute; border-radius: 2px; }
.highlight-pending { background-color: rgba(59, 130, 246, 0.35); box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.7) inset; }
.highlight-active { background-color: rgba(245, 158, 11, 0.5); box-shadow: 0 0 0 1px rgba(245, 158, 11, 0.8) inset; }

/* ─── Selection tooltip (intentionally theme-independent dark pill) ── */
.selection-tip { position: fixed; z-index: 2000; display: flex; align-items: center; gap: 4px; background: #1f2937; border-radius: 6px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); padding: 4px; }
.selection-tip-btn { border: 0; background: transparent; color: #fff; font-size: 0.7rem; font-weight: 700; border-radius: 4px; padding: 6px 10px; cursor: pointer; white-space: nowrap; }
.selection-tip-btn:hover { background: rgba(255, 255, 255, 0.12); }
.selection-tip-close { opacity: 0.7; padding: 6px 8px; }

/* ─── Sidebar ──────────────────────────────────────────── */
.draft-sidebar { width: 22rem; flex: none; border-left-width: 1px; border-left-style: solid; display: flex; flex-direction: column; max-height: 720px; }
.draft-sidebar.sidebar-full { height: 100%; max-height: none; }
.sidebar-tabs { flex: 1; display: flex; flex-direction: column; min-height: 0; }
.pane-scroll { flex: 1; min-height: 0; }
.pane-empty { padding: 48px 16px; }

.list-item { display: flex; gap: 10px; padding: 12px 16px; border-bottom: 1px solid var(--border-color); cursor: pointer; }
.list-item:hover { background-color: color-mix(in srgb, var(--text-primary) 4%, transparent); }
.list-item-static { cursor: default; }
.list-item-static:hover { background-color: transparent; }
.list-item-active { background-color: color-mix(in srgb, #f59e0b 12%, transparent); border-left: 3px solid #f59e0b; padding-left: 13px; }
.item-avatar { flex: none; margin-top: 2px; }
.item-body { flex: 1; min-width: 0; }
.item-head { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; margin-bottom: 4px; }
.item-author { font-size: 0.75rem; font-weight: 700; }
.item-time { font-size: 0.7rem; flex: none; }
.item-quote { font-size: 0.7rem; font-style: italic; background-color: color-mix(in srgb, #f59e0b 10%, transparent); border: 1px solid color-mix(in srgb, #f59e0b 25%, transparent); border-radius: 4px; padding: 4px 8px; margin-bottom: 6px; }
.item-text { font-size: 0.8rem; white-space: pre-wrap; margin: 0; }
.item-foot { display: flex; align-items: center; justify-content: space-between; margin-top: 8px; font-size: 0.7rem; }
/* ─── Comment thread panel ─────────────────────────────── */
.thread-header { flex: none; display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 6px 8px; border-bottom-width: 1px; border-bottom-style: solid; }
.thread-root { display: flex; gap: 10px; padding: 16px; border-bottom: 1px solid var(--border-color); }
.reply-list { padding: 12px 16px 16px; display: flex; flex-direction: column; gap: 14px; }
.reply-item { display: flex; gap: 8px; }

/* ─── Composer (bottom-docked input) ──────────────────── */
.composer { flex: none; border-top-width: 1px; border-top-style: solid; padding: 10px 12px; }
.composer-row { display: flex; align-items: flex-end; gap: 8px; }
.composer-row :deep(.n-input) { flex: 1; }
.quote-chip { display: flex; align-items: flex-start; justify-content: space-between; gap: 6px; background-color: color-mix(in srgb, #3b82f6 8%, transparent); border: 1px solid color-mix(in srgb, #3b82f6 25%, transparent); border-radius: 6px; padding: 6px 8px; margin-bottom: 8px; }
.quote-chip-text { font-size: 0.75rem; font-style: italic; color: var(--text-secondary); }

/* ─── Version timeline ─────────────────────────────────── */
.version-timeline { padding: 16px; }
.version-item { cursor: pointer; }
.version-item :deep(.n-timeline-item-content) { padding-bottom: 4px; }
.version-item-active :deep(.n-timeline-item-content__title) { color: #f59e0b; }
.version-item-header { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.version-number { font-weight: 700; font-size: 0.8rem; }
.version-message { font-size: 0.78rem; margin: 4px 0; }
.version-meta { font-size: 0.7rem; }

/* ─── Icons ────────────────────────────────────────────── */
.icon-sm { width: 14px; height: 14px; }
.icon-md { width: 20px; height: 20px; }
.icon-lg { width: 28px; height: 28px; }

.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

/* ─── PDF text layer (functional, not theme-dependent) ─── */
.draft-pdf-shell :deep(.textLayer),
.draft-pdf-shell :deep(.textLayer *) {
  -webkit-user-select: text !important;
  -moz-user-select: text !important;
  -ms-user-select: text !important;
  user-select: text !important;
}
.draft-pdf-shell :deep(.vue-pdf-embed__page) { position: relative !important; }
.draft-pdf-shell :deep(.vue-pdf-embed__page canvas) { display: block; }
.draft-pdf-shell :deep(.textLayer) {
  z-index: 2 !important;
  pointer-events: auto !important;
  opacity: 1 !important;
  font-family: sans-serif !important;
  font-size: unset !important;
  line-height: 1 !important;
  cursor: text;
}
.draft-pdf-shell :deep(.textLayer span),
.draft-pdf-shell :deep(.textLayer br) {
  color: transparent !important;
  cursor: text;
  font-family: inherit !important;
  pointer-events: auto !important;
}
.draft-pdf-shell :deep(.textLayer ::selection),
.draft-pdf-shell :deep(.textLayer span::selection) {
  background: rgba(59, 130, 246, 0.4);
}
</style>
