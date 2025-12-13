// Custom Modal Manager
const ModalManager = {
  overlay: null,
  confirmCallback: null,

  init () {
    this.overlay = document.getElementById('confirmModal')
    if (!this.overlay) return

    const cancelBtn = document.getElementById('modalCancel')
    const confirmBtn = document.getElementById('modalConfirm')

    if (cancelBtn) cancelBtn.addEventListener('click', () => this.close())
    if (confirmBtn) confirmBtn.addEventListener('click', () => this.confirm())

    // Close on overlay click
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close()
      }
    })

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.overlay.classList.contains('active')) {
        this.close()
      }
    })
  },

  show ({
    title,
    message,
    detailLabel = null,
    detailValue = null,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    type = 'danger',
    onConfirm
  }) {
    if (!this.overlay) this.init()
    if (!this.overlay) return

    document.getElementById('modalTitle').textContent = title
    document.getElementById('modalMessage').textContent = message

    const detailBox = document.getElementById('modalDetailBox')
    if (detailLabel && detailValue) {
      document.getElementById('modalDetailLabel').textContent = detailLabel
      document.getElementById('modalDetailValue').textContent = detailValue
      detailBox.style.display = 'block'
    } else {
      detailBox.style.display = 'none'
    }

    // Update button texts
    document.getElementById('modalConfirm').querySelector('span').textContent = confirmText
    document.getElementById('modalCancel').querySelector('span').textContent = cancelText

    // Update modal type (danger or warning)
    const icon = document.querySelector('.modal-icon')
    const confirmBtn = document.getElementById('modalConfirm')

    icon.className = 'modal-icon ' + type
    if (type === 'danger') {
      icon.innerHTML = '<i class="bi bi-exclamation-triangle-fill"></i>'
      confirmBtn.className = 'modal-btn modal-btn-danger'
    } else if (type === 'warning') {
      icon.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i>'
      confirmBtn.className = 'modal-btn modal-btn-primary'
    }

    this.confirmCallback = onConfirm
    this.overlay.classList.add('active')
    document.body.style.overflow = 'hidden'
  },

  close () {
    if (!this.overlay) return
    this.overlay.classList.remove('active')
    document.body.style.overflow = ''
    this.confirmCallback = null

    // Reset loading state
    const confirmBtn = document.getElementById('modalConfirm')
    if (confirmBtn) {
      confirmBtn.classList.remove('loading')
      confirmBtn.disabled = false
    }
  },

  async confirm () {
    if (this.confirmCallback) {
      const confirmBtn = document.getElementById('modalConfirm')
      confirmBtn.classList.add('loading')
      confirmBtn.disabled = true

      try {
        await this.confirmCallback()
        this.close()
      } catch (error) {
        confirmBtn.classList.remove('loading')
        confirmBtn.disabled = false
        // Keep modal open on error so user can see the error message
      }
    }
  }
}

// Initialize modal on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  ModalManager.init()
})
