<template>
  <div>
    <v-card style="margin-bottom: 20px;">
      <v-container>
        <post-images :images="post.Images || []" />
        <v-card-title>
          <h3>
            <nuxt-link :to="`/user/${post.id}`">
              {{ post.nickname }}
            </nuxt-link>
          </h3>
        </v-card-title>
        <v-card-text>
          <div>
            <h3>{{ post.nickname }}</h3>
            <div>{{ post.content }}</div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn
            text
            color="orange"
          >
            <v-icon>mdi-twitter-retweet</v-icon>
          </v-btn>
          <v-btn
            text
            :color="post.is_like == '0'? 'orange' : 'red'"
            @click="onLike()"
          >
            <v-icon>mdi-heart-outline</v-icon>
          </v-btn>
          <v-btn
            text
            color="orange"
            @click="onToggleComment()"
          >
            <v-icon>mdi-comment-outline</v-icon>
          </v-btn>    
          <v-menu
            offset-y
            open-hover
          >
            <template #activator="{ on }">
              <v-btn
                text
                color="orange"
                v-on="on"
              >
                <v-icon>mdi-dots-horizontal</v-icon>
              </v-btn>
            </template>
            <div style="background: white">
              <v-btn
                dark
                color="red"
                @click="onRemovePost()"
              >
                삭제
              </v-btn>
              <v-btn
                dark
                color="red"
                @click="onEditPost()"
              >
                수정
              </v-btn>
            </div>
          </v-menu>
        </v-card-actions>
      </v-container>
    </v-card>
    <template v-if="commentOpened">
      <comment-form :post-id="post.id" />
      <v-list>
        <v-list-item
          v-for="c in post.Comments"
          :key="c.id"
        >
          <v-list-item-avatar color="teal">
            <span>{{ c.nickname[0] }}</span>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ c.nickname }}</v-list-item-title>
            <v-list-item-subtitle>{{ c.content }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>
  </div>
</template>

<script>
  import CommentForm from '~/components/CommentForm.vue';
  import postImages from '~/components/PostImages.vue';
  
  export default{
    components: { postImages, CommentForm },
      props:{
        post:{
         type: Object,
         required: true,
        }
      },
      data() {
        return {
          commentOpened: false
        }
      },
      methods:{
        async onRemovePost(){
          try{
            const removePostRes = await this.$store.dispatch('post/removePost', {
              postId: this.post.id
            });

            if(!removePostRes.result){
              alert(removePostRes.msg);
              return;
            }

            alert('삭제되었습니다.');

          }catch(err){
            console.log(err);
          }
        },
        async onLike(){
          try{
            const onLikeRes = await this.$store.dispatch('post/onLike', {
              postId: this.post.id,
              is_like: this.post.is_like == '1'? '0' : '1'
            });

            if(!onLikeRes.result){
              alert(onLikeRes.msg);
              return;
            }

          }catch(err){
            console.log(err);
          }
        },
        onEditPost(){

        },
        onToggleComment(){
          this.commentOpened = !this.commentOpened;
        }
    }
  }
</script>

<style scoped>
a{
  color:inherit;
  text-decoration: none;
}
</style>