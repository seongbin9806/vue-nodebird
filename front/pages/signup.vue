<template>
  <div>
    <v-container>
      <v-card>
        <v-container>
          <v-subheader>회원가입</v-subheader>
          <v-form
            ref="form"
            v-model="valid"
            @submit.prevent="onSubmitForm"
          >
            <v-text-field
              v-model="email"
              label="이메일"
              type="email"
              :rules="emailRules"
              required
            />
            <v-text-field
              v-model="password"
              label="비밀번호"
              type="password"
              :rules="passwordRules"
              required
            />
            <v-text-field
              v-model="passwordCheck"
              label="비밀번호확인"
              type="password"
              :rules="passwordCheckRules"
              required
            />
            <v-text-field
              v-model="nickname"
              label="닉네임"
              type="text"
              :rules="nicknameRules"
              required
            />
            <v-checkbox
              v-model="terms"
              label="제로초 말을 잘 들을 것을 약속합니다."
              :rules="[v => !!v || '약관에 동의하셔야합니다.']"
              required
            />
            <v-btn
              color="green"
              type="sumbit"
            >
              가입완료
            </v-btn>
          </v-form>
        </v-container>
      </v-card>
    </v-container>
  </div>
</template>

<script>
  export default {
    middleware: 'anonymous',
    data(){
      return{
        valid: false,
        email: '',
        password: '',
        passwordCheck: '',
        nickname: '',
        terms: false,
        emailRules: [
          v => !!v || '이메일은 필수입니다.',
          v => /.+@.+/.test(v) || '이메일이 유효하지 않습니다',
         ],
         passwordRules: [
          v => !!v || '비밀번호는 필수입니다.'
         ],
         passwordCheckRules: [
          v => !!v || '비밀번호 확인은 필수입니다.',
          v => v === this.password || '비밀번호가 일치하지 않습니다.',
         ],
         nicknameRules: [
          v => !!v || '닉네임은 필수입니다.',
         ]
      }
    },
    head(){
      return{
        title: '회원가입'
      }
    },
    computed:{
      me(){
        return this.$store.state.user.me;
      }
    },
    watch: {
      me(value){
        if(value){
          this.$router.push({
            path:'/',
          });
        }
      }
    },
    methods:{
      async onSubmitForm(){
        if(this.$refs.form.validate()){
          try{
            const signUpRes = await this.$store.dispatch('user/signUp', {
              nickname: this.nickname,
              email: this.email,
              password: this.password,
            });

            if(!signUpRes.result){
              alert(signUpRes.msg);
              return;
            }

            this.$router.push({
              path: '/',
            });
            
          }catch(err){
            alert('회원가입 실패 에러');
          }
        }
      }
    }
  }
</script>

<style>
</style>