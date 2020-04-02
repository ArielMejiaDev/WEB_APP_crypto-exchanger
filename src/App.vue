<template>
  <div id="app">
    <Navbar :links="links" />
    <router-view/>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'

export default {
  name: 'Home',
  components: {
    Navbar,
  },
  data() {
    return {
      links: [
        { title: 'BTC', to: { name:'coin-detail', params: { id:'bitcoin' } } },
        { title: 'ETH', to: { name:'coin-detail', params: { id:'ethereum' } } },
        { title: 'XRP', to: { name:'coin-detail', params: { id:'ripple' } } },
      ]
    }
  }
}
</script>

