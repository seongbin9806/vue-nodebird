<template>
  <v-card style="margin-bottom:20px">
    <v-container>
      <v-form
        ref="form"
        v-model="valid"
        @submit.prevent="onSubmitForm"
      >
        <v-textarea
          v-model="content"
          outlined
          auto-grow
          clearable
          label="어떤 신기한 일이 있었나요?"
          :hide-details="hideDetails"
          :success-message="successMessage"
          :success="success"
          :rules="[v => !!v.trim() || '내용을 입력하세요.']"
          @input="onChangeTextarea"
        />
        <v-btn
          type="submit"
          color="green"
          absolute
          right
        >
          쨱짹
        </v-btn>
        <input
          ref="imageInput"
          type="file"
          multiple
          hidden
          @change="onChangeImages"
        >
        <v-btn
          type="button"
          @click="onClickImageUpload"
        >
          이미지 업로드
        </v-btn>
        <div>
          <div
            v-for="(p, i) in imagePaths"
            :key="p"
            style="display: inline-block;"
          >
            <img
              :src="`http://localhost:8081/${p}`"
              :alt="`${p}`"
              style="width: 200px; height:200px;"
            >
            <div>
              <button
                type="button"
                @click="onRemoveImage(i)"
              >
                제거
              </button>
            </div>
          </div>
        </div>
      </v-form>
    </v-container>
  </v-card>
</template>

<script>
  import { mapState } from 'vuex';

  export default{
    data(){
      return{
        valid: false,
        hideDetails: true,
        successMessage: '',
        success: false,
        content: '',
      }
    },
    computed: {
        ...mapState('user', ['me']),
        ...mapState('post', ['imagePaths'])
    },
    methods: {
      onChangeTextarea() {
        this.hideDetails = true;
        this.success = false;
        this.successMessage = '';
      },
      async onClickImageUpload() {
        this.$refs.imageInput.click();
      },
      async onChangeImages(e){
        console.log(e.target.files);

        const imageFormData = new FormData();

        // 객체 for문 돌리기
        [].forEach.call(e.target.files, (f) => {
          imageFormData.append('image', f);
        });

        this.$store.dispatch('post/uploadImages', imageFormData);
      },
      async onRemoveImage(index){
        this.$store.commit('post/removeImagePath', index);
      },
      async onSubmitForm(){
        if(this.$refs.form.validate()){
          try{
            const onSubmitRes = await this.$store.dispatch('post/add', {
              content: this.content,
              imagePaths: this.imagePaths
            });

            if(!onSubmitRes.result){
              alert(onSubmitRes.msg);
              return;
            }
            
            this.content = '';
            this.hideDetails = false;
            this.success = true;
            this.successMessage = '게시글 등록 성공!';
          }catch(err){
            alert(err);
          }
        }
      }
    }
  }
</script>

<style>
</style>