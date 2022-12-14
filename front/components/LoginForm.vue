<template>
  <v-container v-if="!me">
    <v-card>
      <v-container>
        <v-form
          ref="form"
          v-model="valid"
          @submit.prevent="onSubmitForm"
        >
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="이메일"
            type="email"
            required
          />
          <v-text-field
            v-model="password"
            :rules="passwordRules"
            label="비밀번호"
            type="password"
            required
          />
          <v-btn
            color="green"
            type="submit"
            :disabled="!valid"
          >
            로그인
          </v-btn>
          <v-btn
            nuxt
            to="/signup"
          >
            회원가입
          </v-btn>
        </v-form>
      </v-container>
    </v-card>
  </v-container>
  <v-container v-else>
    <v-card>
      <v-container>
        <p>로그인되었습니다.</p>
        <p>{{ me.nickname }}</p>
        <v-btn
          color="green"
          @click="onLogOut"
        >
          로그아웃
        </v-btn>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
  export default{
    data(){
      return {
        valid: false,
        email: '',
        password: '',
        emailRules: [
          v => !!v || '이메일은 필수입니다.',
          v => /.+@.+/.test(v) || '이메일이 유효하지 않습니다',
         ],
         passwordRules: [
          v => !!v || '비밀번호는 필수입니다.'
         ],
      }
    },
    computed: {
      me() {
        return this.$store.state.user.me;
      }
    },
    methods: {
      async onSubmitForm(){
        if(this.$refs.form.validate()){
          const loginRes = await this.$store.dispatch('user/signIn', {
            email: this.email,
            password: this.password
          });

          if(!loginRes.result){
            alert(loginRes.msg);
            return false;
          }

          console.log('로그인성공');
        }
      },
      onLogOut(){
        this.$store.dispatch('user/signOut');
      }
    }
  }
</script>

<style>
</style>