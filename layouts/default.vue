<template>
  <v-app>
    <v-toolbar
      color="#ffffff"
      fixed
      app
    >
      <v-toolbar-title class="toolbar-title" v-text="title"/>
      <v-spacer />
      <v-btn
        icon
        @click.stop="add"
      >
        <v-icon size=30>note_add</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer
      :fixed="fixed"
      app
    >
    <span>&copy; {{ title }} 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import firebase from '~/plugins/firebase'
import { mapActions, mapState, mapGetters  } from 'vuex'
export default {
  data() {
    return {
      fixed: false,
      title: 'あんきカード'
    }
  },
  methods: {
    ...mapActions(['addCard']),
    add () {
      // add card in firebase database
      const key = firebase.database().ref('cards/1').push().key
      firebase.database().ref('cards/1/' + key).set({
        key: key,
        toggle: false,
        question: "",
        answer: "",
        answered: false,
        mistook: false,
        edit: false,
      })
    }
  }
}
</script>

<style>
.toolbar-title {
  font-size: 24px;
  font-weight: bold;
}
</style>
