<template>
  <header class="shadow w-screen">
    <nav>
      <nav class="flex items-center justify-between flex-wrap bg-green-400 p-6">
        <div class="flex items-center flex-shrink-0 text-white mr-6">
          <Icon class="mr-2" />
          <router-link :to="{name: 'Home'}" class="font-semibold text-xl tracking-tight">Crypto Exchanger</router-link>
        </div>
        <div class="hidden sm:block w-full block flex-grow lg:flex lg:items-center lg:w-auto">
          <div class="text-sm lg:flex-grow">
            <router-link 
              v-for="(link, index) in links" 
              :key="index" :to="link.to" 
              class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4" >
            {{ link.title }}</router-link>
          </div>
        </div>
      </nav>
    </nav>
  </header>
</template>

<script>
import Icon from '@/components/Icon'

export default {
  name: 'Navbar',
  components: {
      Icon
  },
  props: ['links']
}
</script>

<style lang="scss">

  a {
    &.router-link-exact-active {
      color: white !important;
    }
  }
</style>