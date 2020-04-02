<template>
  <main class="">
    <bounce-loader class="mx-auto mt-56" :loading="loading" :color="'#68d391'" :size="100"></bounce-loader>
    <Table v-if="!loading" class="mx-auto mt-10" :assets="assets" />
  </main>
</template>

<script>
// import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import api from '@/api'
import Table from '@/components/Table'

export default {
  name: 'Home',
  components: {
    Table,
  },
  data() {
    return {
      assets: [],
      loading: false
    }
  },
  created() {
    this.loading = true
    api.getAssets().then(assets => this.assets = assets).finally(() => this.loading = false)
  }
}
</script>
