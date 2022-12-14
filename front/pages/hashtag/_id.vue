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
    <infinite-loading
      spinner="spiral"
      @infinite="infiniteHandler"
    />
  </v-container>
</template>

<script>
  import InfiniteLoading from 'vue-infinite-loading';
  import postCard from '~/components/postCard.vue';
  import postForm from '~/components/postForm.vue';

  export default { 
    components: {
      InfiniteLoading,
      postCard,
      postForm
    },
    data(){
      return{
      }
    },
    fetch({ store }){ 
      if(!store.state.post.mainPosts.length){
        store.dispatch('post/loadPosts');
      }
    },
    computed: {
      me(){
        return this.$store.state.user.me;
      },
      mainPosts(){
        return this.$store.state.post.mainPosts;
      },
      page(){
        return this.$store.state.post.page;
      }
    },
    methods: {
      async infiniteHandler($state) {
        try{
          await this.$store.dispatch('post/loadPosts',{
          });

          console.log(this.page);
          if(this.page == 10){
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

<style>
</style>