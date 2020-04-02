<template>
  <div class="flex-col container mx-auto px-12 mt-6">
    <bounce-loader class="mx-auto mt-56" :loading="loading" :color="'#68d391'" :size="100"></bounce-loader>
    <template v-if="!loading" >

      <template v-if="asset.id">
        <div class="flex flex-col sm:flex-row justify-around items-center">
          <div class="flex flex-col items-center">
            <img
              :src="
                `https://static.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`
              "
              :alt="asset.name"
              class="w-20 h-20 mr-5"
            />
            <h1 class="text-5xl">
              {{ asset.name }}
              <small class="sm:mr-2 text-gray-500">{{ asset.symbol }}</small>
            </h1>
          </div>

          <div class="my-10 flex flex-col">
            <ul>
              <li class="flex justify-between">
                <b class="text-gray-600 mr-10 uppercase">Ranking</b>
                <span>#{{ asset.rank }}</span>
              </li>
              <li class="flex justify-between">
                <b class="text-gray-600 mr-10 uppercase">Precio actual</b>
                <span>{{ asset.priceUsd | dollar }}</span>
              </li>
              <li class="flex justify-between">
                <b class="text-gray-600 mr-10 uppercase">Precio más bajo</b>
                <span>{{ min | dollar }}</span>
              </li>
              <li class="flex justify-between">
                <b class="text-gray-600 mr-10 uppercase">Precio más alto</b>
                <span>{{ max | dollar }}</span>
              </li>
              <li class="flex justify-between">
                <b class="text-gray-600 mr-10 uppercase">Precio Promedio</b>
                <span>{{ avg | dollar }}</span>
              </li>
              <li class="flex justify-between">
                <b class="text-gray-600 mr-10 uppercase">Variación 24hs</b>
                <span>{{ asset.changePercent24Hr | percent }}</span>
              </li>
            </ul>
          </div>

          <div class="my-10 sm:mt-0 flex flex-col justify-center text-center">
            <button
              @click="toggleConverter"
              class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded outline-none hover:shadow-outline"
            >
            {{ fromUsd ? `USD to ${asset.symbol}` : `${asset.symbol} to USD` }}
            </button>

            <div class="flex flex-row my-5">
              <label class="w-full" for="convertValue">
                <input
                  v-model="convertValue"
                  type="number"
                  :placeholder="fromUsd ? 'Value in USD' : `Value in ${asset.symbol}`"
                  class="text-center bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
                />
              </label>
            </div>

            <span class="text-xl"> {{ convertResult }} {{ fromUsd ? `${asset.symbol}` : 'USD' }} </span>
          </div>
        </div>
      </template>

      <line-chart class="w=full" :colors="['orange']" :min="min" :max="max" :data="history.map(historyItem => [historyItem.date, parseFloat(historyItem.priceUsd).toFixed(2) ])"></line-chart>

      <table class="mx-auto mt-10 w-full">
        <h1 class="text-2xl font-bold leading-relaxed">Mejores ofertas</h1>
        <tbody>
          <tr 
            class="border-b border-gray-200 hover:bg-gray-100 hover:bg-orange-100" v-for="market in markets" 
            :key="`${market.exchangeId}-${market.priceUsd}`">
            <td>{{ market.exchangeId }}</td>
            <td>{{ market.priceUsd | dollar }}</td>
            <td>{{ market.baseSymbol }} / {{ market.quoteSymbol }}</td>
            <td>
              <button 
                v-if="! market.url" @click="getUrl(market)"
                v-show="! market.loading"
                class="bg-transparent border border-green-500 text-green-500 font-semibold rounded py-1 px-2 hover:bg-green-500 hover:text-white">
                View
              </button>
              <a v-else :href="market.url" class="hover:underline text-green-600" target="_blank">{{ market.url }}</a>
              <beat-loader v-if="market.loading" :loading="market.loading" :color="'#68d391'" :size="8" />
            </td>
          </tr>
        </tbody>
      </table>

    </template>
  </div>
</template>

<script>
import api from '@/api'

export default {
  name: 'CoinDetail',

  data() {
    return {
      asset: {},
      history: [],
      markets: [],
      loading: false,
      fromUsd: true,
      convertValue: null,
    }
  },

  computed: {
    convertResult() {
      if (! this.convertValue) {
        return 0
      }
      const result = this.fromUsd ? this.convertValue / this.asset.priceUsd : this.convertValue * this.asset.priceUsd
      return result.toFixed(4)
    },
    min() {
      return Math.min(
        ...this.history.map(h => parseFloat(h.priceUsd).toFixed(2))
      )
    },

    max() {
      return Math.max(
        ...this.history.map(h => parseFloat(h.priceUsd).toFixed(2))
      )
    },

    avg() {
      return this.history.reduce((a, b) => a + parseFloat(b.priceUsd), 0) / this.history.length
    }
  },

  created() {
    this.getCoin()
  },

  methods: {
    toggleConverter(){
      this.fromUsd = !this.fromUsd
    },

    getCoin() {

      this.loading = true

      const id = this.$route.params.id

      Promise.all([
        api.getAsset(id),
        api.getAssetHistory(id),
        api.getMarkets(id)
      ]).then(([asset, history, markets]) => {
        this.asset = asset 
        this.history = history
        this.markets = markets
        this.loading = false
      })

    },

    getUrl(market) {
      this.$set(market, 'loading', true)
      api.getExchange(market.exchangeId).then(response => {
        this.$set(market, 'url', response.exchangeUrl)
        this.$set(market, 'loading', false)
      })
    },

  },
  watch: {
    $route() {
      this.getCoin()
    }
  }
}
</script>

<style scoped>
td {
  padding: 10px;
  text-align: center;
}
</style>

