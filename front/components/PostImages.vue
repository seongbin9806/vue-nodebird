<template>
  <div>
    <div v-if="images.length !== 0">
      <v-btn
        style="width:100%; margin-bottom: 15px;"
        @click="zoomImages"
      >
        자세히
      </v-btn>
      <image-zoom
        v-if="imageZoomed"
        :close-modal="closeModal"
        :images="images"
      />
    </div>
    <div v-if="images.length === 1">
      <v-img
        :src="`http://localhost:8081/${images[0].src}`"
        contain
        aspect-ratio="2"
      />
    </div>
    <div
      v-else-if="(images.length === 2)"
      style="display:flex;"
    >
      <v-img
        :src="`http://localhost:8081/${images[0].src}`"
        contain
        aspect-ratio="2"
        style="flex:1"
      />
      <v-img
        :src="`http://localhost:8081/${images[1].src}`"
        contain
        aspect-ratio="2"
        style="flex:1"
      />
    </div>
    <div
      v-else-if="(images.length > 2)"
      style="display:flex;"
    >
      <v-img
        :src="`http://localhost:8081/${images[0].src}`"
        contain
        aspect-ratio="2"
        style="flex:1"
      />
      <div style="flex: 1;align-item: center; justify-content:center;display:flex; cursor: pointer;">
        <div style="display: flex; align-items: center; justify-content: center; flex-direction: column;">
          <v-icon>mdi-dots-horizontal</v-icon>
          <div>더보기</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ImageZoom from './ImageZoom.vue'
export default{
  components: { ImageZoom },
    props: {
      images:{
        type: Array,
        required: true,
      }
    },
    data(){
      return{
        imageZoomed: false,
      }
    },
    methods:{
      closeModal(){
        this.imageZoomed = false;
        console.log(this.imageZoomed);
        return;
      },
      zoomImages(){
        this.imageZoomed = true;
        console.log(this.imageZoomed);
        return;
      }
    }
  }
</script>
<style>
</style>