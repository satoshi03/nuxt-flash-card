<template>
  <v-layout
    wrap
    column
    justify-center
  >
    <v-flex
      xs12
      sm8
      md6
      offset-md2
      >
      <div v-for="(card, index) in cards">
      <v-card v-if="!card.answered" key="index" class="card" max-width="700px" min-width="300px">
        <v-layout row>
          <v-card-text class="card-head">
            <span>{{ card.toggle ? "答え" : "問題" }}</span>
          </v-card-text>
        <v-card-actions>
          <v-btn v-if="!card.edit" icon @click.stop="edit(card, index)">
            <v-icon color="#888888">edit</v-icon>
          </v-btn>
          <v-btn v-if="card.edit" icon @click.stop="save(card, index)">
            <v-icon color="#888888">save</v-icon>
          </v-btn>
        </v-card-actions>
        </v-layout>
        <v-card-title v-show="card.edit" class="justify-center card-text" @click="toggleCard(card)">
          <input class="headline" v-model="editText" @focus="updateTextOnFocus(card)"></input>
        </v-card-title>
        <v-card-title v-show="!card.edit" class="justify-center card-text" @click="toggleCard(card)">
          <span class="headline">{{ getCardText(card) }}</span>
        </v-card-title>
        <v-divider />
        <v-card-actions>
          <v-btn @click.stop="card.mistook = true" icon>
            <v-icon color="#888888">thumb_down_alt</v-icon>
          </v-btn>
          <v-spacer />
          <v-btn @click.stop="card.answered = true" icon>
            <v-icon color="#888888">thumb_up_alt</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import firebase from '~/plugins/firebase'
import { mapActions, mapState, mapGetters  } from 'vuex'

export default {
  data () {
    return {
      editText: "",
    }
  },
  created () {
    this.init()
    this.database = firebase.database()
    this.cardsRef = this.database.ref('cards/1')
    this.cardsRef.on('child_added', snapshot => {
      const ss = snapshot.val()
      this.addCard({
        key: ss.key,
        question: ss.question,
        answer: ss.answer,
        toggle: false,
        answered: false,
        mistook: false,
        edit: false,
      })
    })
  },
  computed: mapGetters(['cards']),
  methods: {
    ...mapActions(['init', 'addCard', 'editCard']),
    toggleCard (card) {
      if (card.edit) {
        return
      }
      card.toggle = !card.toggle
    },
    getCardText (card) {
      if (card.toggle) {
        return card.answer
      } else {
        return card.question
      }
    },
    edit (card, index) {
      if (card.toggle) {
        this.editText = card.answer
      } else {
        this.editText = card.question
      }

      if (this.editText === "") {
        const context = card.toggle ? "答え" : "問題"
        this.editText = "クリックして" + context + "を入力"
      }

      card.edit = true
      this.editCard({ index: index, card: card })
    },
    save (card, index) {
      card.edit = false
      let needsMoreEdit = false
      if (card.toggle) {
        card.answer = this.editText
        if (card.question === "") {
          needsMoreEdit = true
        }
      } else {
        card.question = this.editText
        if (card.answer === "") {
          needsMoreEdit = true
        }
      }

      // update to firebase database
      const key = card.key
      firebase.database().ref('cards/1/' + key).set({
        key: key,
        question: card.question,
        answer: card.answer,
        toggle: card.toggle,
        answered: card.answered,
        mistook: card.mistook,
        edit: card.edit,
      })

      // update to local
      this.editCard({ index: index, card: card })
      if (needsMoreEdit) {
        card.toggle = !card.toggle
        this.edit(card, index)
      }
    },
    updateTextOnFocus (card) {
      const context = card.toggle ? "答え" : "問題"
      const initString = "クリックして" + context + "を入力"

      if (this.editText === initString) {
        this.editText = ""
      }
    }
  }
}
</script>

<style>
.card {
  border-radius: 8px;
  margin-bottom: 12px;
}

.card-head {
  color: #888888;
  padding-bottom: 0px;
}

.card-text {
  height: 120px;
  text-align: center;
  padding-bottom: 30px;
  color: #222222;
}

.card-add {
  margin-top: 10px;
  border-radius: 8px;
}
</style>
