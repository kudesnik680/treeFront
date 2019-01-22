<template>
    <v-container >
        <v-layout align-center justify-center row wrap> 
            <v-flex xs8>
                <v-alert
                :value="error"
                @click="error = !error"
                type="error"
                >
                Ошибка при работе с базой данных
                </v-alert>
            </v-flex>
            <v-flex xs8 style="text-align:center;">
                <h2>Тестовое задание.
                Реализация каталога n-ой вложенности.</h2><br>
            </v-flex>
            <v-flex xs8>
                <v-toolbar >
                    <add-node v-on:udate="fetchData"></add-node>
                    <v-spacer></v-spacer>
                    <v-btn @click="sorts('name')" small>
                        <v-icon>format_list_bulleted</v-icon>
                        <v-icon>{{(sorting.name == 'asc') ? 'arrow_downward' : 'arrow_upward'}}</v-icon>
                    </v-btn>
                    <v-btn @click="sorts('date')" small>
                        <v-icon>calendar_today</v-icon>
                        <v-icon>{{(sorting.date == 'asc') ? 'arrow_downward' : 'arrow_upward'}}</v-icon>
                    </v-btn>
                </v-toolbar >
                <br>
                <v-treeview :items="items" hoverable >
                    <template slot="label" slot-scope="{ item }" >
                        {{item.name }}  | <small>{{item.date_add}}</small>
                    </template>

                    <template slot="append" slot-scope="{ item }" >

                        <v-text-field @keyup.enter="insertAndUpdateNode(item.id)" :rules="[rules.counter]"
            :maxlength="maxChar" v-if="item.id == active.id" v-model="name"></v-text-field>

                        <v-btn @click="insertAndUpdateNode(item.id)"  small flat icon :color="item.id == active.id ? 'blue' : 'green' ">
                            <v-icon>{{(item.id != active.id) ? 'add' : 'done'}}</v-icon>
                        </v-btn>

                        <v-btn @click="insertAndUpdateNode(item)" small flat icon color="orange">
                            <v-icon>{{(item.id == active.id && active.edit) ? 'clear' : 'edit'}}</v-icon>
                        </v-btn>

                        <v-btn @click="deleteNode(item.id)" small flat icon color="red">
                            <v-icon>delete</v-icon>
                        </v-btn>

                    </template>

                </v-treeview>
            </v-flex>
        </v-layout> 
    </v-container>
</template>

<script>
import axios from 'axios'
import addNode from '../components/addNode'

    export default {
        name: 'Catalog',
        components: {
            addNode
        },
        data: () => {
            return {
                items: [],
                active: {
                    id: 0,
                    edit: false
                },
                sorting: {
                    name: 'asc',
                    date: 'asc'
                },
                name: '',
                maxChar: 50,
                rules: {
                    counter: value => value.length <= 50 || 'Максимум 50 символов',
                },
                error: false
            }
        },
        mounted() {
            this.fetchData()
        },
        methods: {
            fetchData () {
                axios
                    .get('/')
                    .then((response) => {
                        this.items = response.data.data
                    }).catch((error) => {
                        console.log(error);
                    });
            },
            sorts (data) {
                let s = {}
                
                if(data == 'name') {
                    if(this.sorting.name == 'asc')
                        this.sorting.name = 'desc'
                    else 
                      this.sorting.name = 'asc'
                    s.name = this.sorting.name
                } else {
                    if(this.sorting.date == 'asc')
                        this.sorting.date = 'desc'
                    else 
                      this.sorting.date = 'asc'
                    s.date = this.sorting.date 
                }
              
                axios
                    .get('/sortnode',{
                        params: s
                    })
                    .then((response) => {
                        this.items = response.data.data
                    }).catch((error) => {
                        console.log(error);
                    });
                
            },
            deleteNode (itemId)  {
                axios
                    .get('/deletenode/'+itemId)
                    .then((response) => {
                        this.fetchData()
                    }).catch((error) => {
                        console.log(error);
                    });
            },
            insertAndUpdateNode (item) {
                if(item.name != undefined) {
                    console.log('edit');
                    if (item.id == this.active.id) {
                        this.active.id = 0
                        this.active.edit = false
                        this.name = ''
                    } else {
                        this.active.id = item.id
                        this.active.edit = true
                        this.name = item.name
                    }
                } else {
                    
                    if (item == this.active.id) {
                        if (this.name == '') {
                            this.active.id = 0
                            return 0;
                        }
                        if(this.active.edit) {
                            this.updateNode();
                        } else {
                            this.isertNode();
                        }
                        
                    } else {
                        console.log(item)
                        this.active.id = item
                    }
                }
            },
            isertNode () {
                axios
                    .post('/addnode', {
                        name: this.name,
                        parent_id: this.active.id
                    })
                    .then((response) => {
                        console.log('isertNode')
                        this.active.id = 0;
                        this.name = ''
                        this.fetchData()
                    }).catch((error) => {
                        console.log(error);
                    });
                
            },
            updateNode () {
                axios
                    .post('/updatenode/'+this.active.id, {
                        name: this.name
                    })
                    .then((response) => {
                        if(response.data.status == undefined) {
                            this.error = true;
                        }
                        this.active.id = 0;
                        this.active.edit = false;
                        this.name = ''
                        this.fetchData()
                    }).catch((error) => {
                        console.log(error);
                    });
            }
        }
    }
</script>

<style scoped>

</style>