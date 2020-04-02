<template>

  <table>
    <thead>
      <tr class="bg-gray-100 border-b-2 border-gray-400">
        <th></th>
        <th :class="{ up: this.sortOrder === 1, down: this.sortOrder === -1 }">
          <span class="underline cursor-pointer" @click="changeSortOrder">Ranking</span>
        </th>
        <th>Name</th>
        <th>Price</th>
        <th>Market Cap</th>
        <th>Volume 24hs</th>
        <th>Detail</th>
        <td class="hidden sm:block">
          <input
            class="bg-gray-100 focus:outline-none border-b border-gray-400 py-2 px-4 block w-full appearance-none leading-normal"
            placeholder="Buscar..."
            type="text"
            v-model="filter"
          />
        </td>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-gray-200 hover:bg-gray-100 hover:bg-orange-100" v-for="asset in filteredAssets" :key="asset.id">
        <td>
          <img class="w-6 h-6" :src="`https://static.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`" :alt="asset.name">
        </td>
        <td>
          <b>{{ asset.rank }}</b>
        </td>
        <td>
          <router-link class="hover:underline text-green-600" :to="{name:'coin-detail', params: { id: asset.name.toLowerCase() }}">
            {{ asset.name }}
          </router-link>
          <small class="ml-1 text-gray-500">{{ asset.symbol }}</small>
        </td>
        <td>{{ asset.priceUsd | dollar }}</td>
        <td>{{ asset.marketCapUsd | dollar}}</td>
        <td :class="asset.changePercent24Hr.includes('-') ? 'text-red-600' : 'text-green-600'">{{ asset.changePercent24Hr  | percent}}</td>
        <td>
          <button 
            class="bg-transparent border border-green-500 text-green-500 font-semibold rounded py-1 px-2 hover:bg-green-500 hover:text-white"
            @click="goToCoinDetail(asset.id)">
            Detail
          </button>
        </td>
      </tr>
    </tbody>
  </table>

</template>

<script>
export default {
  name: 'Table',
  data(){
    return {
      filter: '',
      sortOrder: 1
    }
  },
  computed: {
    filteredAssets() {
      
      return this.assets.filter(
          a =>
            a.symbol.toLowerCase().includes(this.filter.toLowerCase()) ||
            a.name.toLowerCase().includes(this.filter.toLowerCase())
        )
        .sort((a, b) => { // it iterates in every item of the array to make a compare

          if (parseInt(a.rank) > parseInt(b.rank)) {
            return this.sortOrder // 1 return a ascendant sort order
          }

          return -1
        })
    }
  },
  props: {
      assets: {
          type: Array,
          default: () => []
      }
  },
  methods: {
    goToCoinDetail(id) {
      this.$router.push({name: 'coin-detail', params: {id: id}})
    },
    changeSortOrder() {
      this.sortOrder = this.sortOrder === 1 ? -1 : 1 // change default value of 1 to -1
    }
  }
}
</script>

<style scoped>
.up::before {
  content: "👆";
}

.down::before {
  content: "👇";
}

td {
  padding: 20px 0px;
  font-size: 0.6rem;
  text-align: center;
}

th {
  padding: 5px;
  font-size: 0.6rem;
}

@media (min-width: 640px) {
  td,
  th {
    padding: 20px;
    font-size: 1rem;
  }

  th {
    padding: 12px;
  }
}
</style>
