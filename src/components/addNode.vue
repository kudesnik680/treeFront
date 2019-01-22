<template>
        <v-flex xs5>
          <v-text-field
            v-model="name"
            :append-outer-icon="name ? 'send' : ''"
            clear-icon="clear"
            :rules="[rules.counter]"
            :maxlength="maxChar"
            clearable
            label="Название корневого раздела"
            type="text"
            @click:append-outer="add"
            @keyup.enter="add"
            @click:clear="clearName"
          ></v-text-field>
        </v-flex>
</template>

<script>
import axios from 'axios'

    export default {
    data: () => ({
      name: '',
      maxChar: 50,
      rules: {
        counter: value => value.length <= 50 || 'Максимум 50 символов',
      }
    }),
    methods: {
      add () {
        if (this.name == '')
          return 0;
        axios.post('/addnode', {
                name: this.name,
                parent_id: 0
            })
            .then( (response) => {
                this.clearName()
                this.$emit('udate');
            });
      },
      clearName () {
        this.name = ''
      },
    }
  }
</script>

<style scoped>

</style>