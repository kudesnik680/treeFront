<template>
  <v-app>
    <v-content>
      <catalog/>
    </v-content>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld'
import Catalog from './components/Catalog'

export default {
  name: 'App',
  components: {
    HelloWorld,
    Catalog
  },
  data () {
    return {
      //
    }
  }
}
</script>
