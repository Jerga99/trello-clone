<template>
  <div class="list">
    <h6 class="list-title"> {{ list.name }} </h6>
    <draggable v-model="list.cards" :options="{group: 'cards'}" class="dragArea" @change="cardMoved">
      <card v-for="card in list.cards" :key="card.id" :card="card" :list="list"></card>
    </draggable>

    <a v-if="!editing" v-on:click="startEditing">Add Card</a>
    <textarea v-if="editing" ref="message" v-model="message" class="form-control input-text"></textarea>
    <button v-if="editing" v-on:click="submitMessage" class="btn btn-success">Add</button>
    <a v-if="editing" v-on:click="editing = false">Cancel</a>

  </div>
</template>

<script>
import draggable from 'vuedraggable'
import card from './card';

  export default {
    components: {draggable, card},
    props: ["list"],

    data: function() {
      return {
        message: "",
        editing: false
      }
    },
    methods: {
      startEditing: function() {
        this.editing = true;
        this.$nextTick(() => { this.$refs.message.focus() })
      },
      submitMessage: function() {
        var data =  new FormData
        data.append("card[list_id]", this.list.id);
        data.append("card[name]", this.message);

        Rails.ajax({
          url: "/cards",
          type: "POST",
          data: data,
          dataType: "json",
          beforeSend: function() { return true },
          success: (data) => {
            const index = window.store.lists.findIndex(item => item.id == this.list.id)
            window.store.lists[index].cards.push(data);
            this.message = ""
            this.$nextTick(() => { this.$refs.message.focus() })
          }
        })
      },
      cardMoved: function(event) {
        const evt = event.added || event.moved
        if (evt == undefined) { return }

        const element = evt.element;

        const list_index = window.store.lists.findIndex((list) => {
          return list.cards.find((card) => {
            return card.id === element.id;
          });
        });

        var data = new FormData
        data.append("card[list_id]", window.store.lists[list_index].id)
        data.append("card[position]", evt.newIndex + 1)

        Rails.ajax({
          url: `/cards/${element.id}/move`,
          type: "PATCH",
          data: data,
          dataType: "json",
          beforeSend: function() { return true }
        })
      },
    }
  }
</script>

<style scoped>
  .list-title {
    font-size: 17px;
  }

  .input-text {
  margin-bottom: 10px;
  }

  .dragArea {
    min-height: 20px;
  }
</style>
