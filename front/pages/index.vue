<template>
  <v-container>
    <post-form v-if="me" />
    <div>
      <post-card
        v-for="p in mainPosts"
        :key="p.id"
        :post="p"
      />
    </div>
    <client-only>
      <infinite-loading
        spinner="spiral"
        @infinite="infiniteHandler"
      />
    </client-only>
  </v-container>
</template>

<script>
  import InfiniteLoading from 'vue-infinite-loading';
  import postCard from '~/components/postCard.vue';
  import postForm from '~/components/postForm.vue';
  import { mapState } from 'vuex';
  
  export default {
    components: {
      InfiniteLoading,
      postCard,
      postForm
    },
    transition (to, from) {
      if (!from) return 'slide-left';
      return 'slide-right';
    },
    data(){
      return{
      }
    },
    fetch({ store }){ 
      if(!store.state.post.mainPosts.length){
        return store.dispatch('post/loadPosts');
      }
    },
    computed: {
        ...mapState('user', ['me']),
        ...mapState('post', ['mainPosts', 'hasMorePost'])
    },
    methods: {
      async infiniteHandler($state) {
        try{
          await this.$store.dispatch('post/loadPosts');

          if(!this.hasMorePost){
            $state.complete();
          }else{
            $state.loaded();
          }
        }catch(err){
          alert(err);
        }
      }
    }
  }
</script>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.2s;
}
.slide-left-enter-from {
  opacity: 0;
  transform: translate(50px, 0);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translate(-50px, 0);
}
.slide-right-enter-from {
  opacity: 0;
  transform: translate(-50px, 0);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translate(50px, 0);
}
</style>