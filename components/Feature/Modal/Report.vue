<script setup>
  import { ref, watch } from 'vue'

  const props = defineProps({ isOpen: { type: Boolean, default: false } })
  const emit = defineEmits(['close', 'submit'])

  const formData = ref({ nome: '', email: '', mensagem: '' })
  const loading = ref(false)
  const errorMsg = ref('')
  const successMsg = ref('')

  const resetState = () => {
    formData.value = { nome: '', email: '', mensagem: '' }
    loading.value = false
    errorMsg.value = ''
    successMsg.value = ''
  }

  const closeModal = () => { emit('close'); resetState() }

  const handleSubmit = async () => {
    if (loading.value) return
    loading.value = true
    errorMsg.value = ''
    successMsg.value = ''

    try {
      // Envia para o endpoint de produção
      const res = await $fetch('/api/report', {
        method: 'POST',
        body: formData.value,
      })
      if (res && res.ok) {
        successMsg.value = 'Mensagem enviada com sucesso!'
        emit('submit', { ...formData.value })
        setTimeout(() => closeModal(), 1200)
      } else {
        throw new Error('Falha ao enviar.')
      }
    } catch (err) {
      const msg = err && typeof err === 'object' ? (err.statusMessage || err.message) : ''
      errorMsg.value = msg || 'Não foi possível enviar. Tente novamente.'
    } finally {
      loading.value = false
    }
  }

  watch(() => props.isOpen, (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  })
</script>


<template>
  <!-- Modal Overlay -->
  <div
    v-if="isOpen"
    class="fixed max-h-screen max-w-screen inset-0 z-50 flex flex-col items-center justify-center bg-blue-900/90 bg-opacity-50"
    @click="!loading && closeModal()"
  >
    <!-- Modal Content -->
    <div class="relative bg-blue-600 w-full max-w-[400px] p-[50px]" @click.stop>
      <!-- Close Button -->
      <button
        @click="!loading && closeModal()"
        class="absolute top-2 right-2 md:top-4 md:right-4 transition-colors cursor-pointer"
        :disabled="loading"
      >
        <!-- seu ícone -->
        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.00098 7.31836L10.0225 5.29688L10.8662 6.81738L9.17871 8.50391L14.3975 13.7227L13.2197 14.9004L10.5156 12.2041L8.00098 7.66895V9.68164L2.77441 14.9004L1.59668 13.7227L6.81543 8.50391L1.59668 3.27734L2.77441 2.09961L8.00098 7.31836ZM14.3975 3.27734L11.3418 6.34082V3.97754L13.2197 2.09961L14.3975 3.27734Z" fill="#FFAD33"/>
        </svg>
      </button>

      <!-- Title -->
      <div class="font-bigShoulders text-white text-lg md:text-2xl uppercase mb-4 md:mb-5 pr-6 md:pr-8">
        REPORTAR INCONSISTÊNCIA NAS INFORMAÇÕES
      </div>

      <!-- Description -->
      <p class="text-white mb-5">
        Se você encontrou alguma inconsistência e deseja contribuir, entre em contato:
      </p>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4 md:space-y-5">
        <!-- Nome -->
        <div>
          <input
            v-model="formData.nome"
            type="text"
            placeholder="Nome"
            class="w-full px-3 md:px-4 py-2 md:py-3 bg-blue-500 text-white placeholder-white border-none focus:outline-none focus:ring-2 focus:ring-[#FFB74D]"
            required
          />
        </div>

        <!-- Email -->
        <div>
          <input
            v-model="formData.email"
            type="email"
            placeholder="Email"
            class="w-full px-3 md:px-4 py-2 md:py-3 bg-blue-500 text-white placeholder-white border-none focus:outline-none focus:ring-2 focus:ring-[#FFB74D]"
            required
          />
        </div>

        <!-- Mensagem -->
        <div>
          <textarea
            v-model="formData.mensagem"
            placeholder="Mensagem"
            rows="4"
            class="w-full px-3 md:px-4 py-2 md:py-3 bg-blue-500 text-white placeholder-white border-none focus:outline-none focus:ring-2 focus:ring-[#FFB74D] resize-none"
            required
          ></textarea>
        </div>

        <!-- Feedback / Ações -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <span v-if="errorMsg" class="text-red-200 text-sm">{{ errorMsg }}</span>
            <span v-if="successMsg" class="text-green-200 text-sm">{{ successMsg }}</span>

            <UiButton :disabled="loading">
              <span v-if="!loading">Enviar</span>
              <span v-else class="opacity-80">Enviando…</span>
            </UiButton>
          </div>

          <!-- Link de preview (Ethereal) -->
          <a
            v-if="previewUrl"
            :href="previewUrl"
            target="_blank"
            rel="noopener"
            class="text-xs underline text-white/90 hover:text-white self-end"
          >
            Abrir e-mail de teste (Ethereal)
          </a>
        </div>
      </form>
    </div>

    <FeatureTexturaSection :z-index="-10" />
  </div>
</template>