module.exports = {
  // css: ['~/assets/common.css'],
  head: {
    title: 'NodeBird',
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
      { name: 'description', content: '제로초의 Nodebird SNS'},
    ],
    htmlAttrs: {
      lang: "ko",
    },
  },
  modules: [
    '@nuxtjs/vuetify',
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],
  plugins: [],
  vuetify: {

  },
  moment:{
    locales: ['ko']
  },
  build: {
    analyze: false,
    extend(config, { isClient, isServer, isDev}){
      if(isServer && !isDev){
        config.devtool = 'hidden-source-map';
      }
      console.log('webpack', config, isServer, isClient);
    }
  },
  axios: {
    browserBaseURL: 'http://localhost:8081',
    baseURL: 'http://localhost:8081',
    https: false,
  },
  server: {
    port: process.env.PORT || 3081,
  }
}