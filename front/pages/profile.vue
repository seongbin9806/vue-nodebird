<template>
  <v-container>
    <v-card style="margin-bottom:20px">
      <v-container>
        <v-subheader>내 프로필</v-subheader>
        <v-form
          ref="form"
          v-model="valid"
          @submit.prevent="onChangeNickname"
        >
          <v-text-field
            v-model="nickname"
            label="닉네임"
            required
            :rules="nicknameRules"
          />
          <v-btn
            color="blue"
            type="submit"
            dark
          >
            수정
          </v-btn>
        </v-form>
      </v-container>
    </v-card>
    <v-card style="margin-bottom:20px">
      <v-container>
        <v-subheader>팔로잉</v-subheader>
        <follow-list
          :users="followingList"
          :remove="removeFollowing"
        />
        <v-btn
          v-if="hasMoreFollowing"
          style="width:100%"
          color="blue"
          dark
          @click="loadMoreFollowing"
        >
          더보기
        </v-btn>
      </v-container>
    </v-card>

    <v-card style="margin-bottom:20px">
      <v-container>
        <v-subheader>팔로워</v-subheader>
        <follow-list
          :users="followerList"
          :remove="removeFollower"
        />
        <v-btn
          v-if="hasMoreFollower"
          style="width:100%"
          color="blue"
          dark
          @click="loadMoreFollower"
        >
          더보기
        </v-btn>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
  import followList from '~/components/FollowList.vue';
  export default {
    components:{
      followList,
    },
    middleware: 'authenticated',
    data(){
      return{
        name: 'profile',
        nickname: '',
        nicknameRules: [
          v => !!v || '닉네임을 입력하세요.'
        ],
        valid: false,
      }
    },
    fetch({ store }){
      store.dispatch('user/loadFollowers');
      store.dispatch('user/loadFollowings');
    },
    head(){
      return{
        title: '프로필'
      }
    },
    computed: {
      me() {
        return this.$store.state.user.me;
      },
      followerList() {
        return this.$store.state.user.followerList;
      },
      followingList() {
        return this.$store.state.user.followingList;
      },
      hasMoreFollowing(){
        return this.$store.state.user.hasMoreFollowing;
      },
      hasMoreFollower(){
        return this.$store.state.user.hasMoreFollower;
      }
    },
    created(){
      this.nickname = this.me.nickname;
    },
    methods:{
      async onChangeNickname(){
        if(!this.$refs.form.validate()) return;

        try{
          await this.$store.dispatch('user/changeNickname',{
            nickname: this.nickname
          });

        }catch(err){
          alert(err);
        }
      },
      async removeFollowing(id){
        this.$store.dispatch('user/removeFollowing', { id });
      },
      async removeFollower(id){
        this.$store.dispatch('user/removeFollower', { id });
      },
      async loadMoreFollowing(){
        this.$store.dispatch('user/loadFollowings');
      },
      async loadMoreFollower(){
        this.$store.dispatch('user/loadFollowers');
      }
    }
  }
</script>

<style>
</style>