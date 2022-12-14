export const state = () => ({

});

export const mutations = {

};

export const actions = {
  nuxtServerInit({commit, dispatch, state }, { req }){
    console.log(this.$auth.$storage.getUniversal('id'));
    return dispatch('user/loadUser');
  }
}