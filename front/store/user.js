export const state = () => ({
  me: null,
  followerList: [],
  followingList: [],
  hasMoreFollower: true,
  hasMoreFollowing: true,
});

const totalFollowers = 8;
const totalFollowings = 5;
const limit = 3;

export const mutations = {
  setMe(state, payload){
    state.me = payload;
  },
  changeNickname(state, payload){
    state.me.nickname = payload.nickname;
  },
  addFollowing(state, payload){
    state.followingList.push(payload);
  },
  addFollower(state, payload){
    state.followerList.push(payload);
  },
  removeFollowing(state, payload){
    const index = state.followingList.findIndex(v => v.id === payload.id);
    state.followingList.splice(index, 1);
  },
  removeFollower(state, payload){
    const index = state.followerList.findIndex(v => v.id === payload.id);
    state.followerList.splice(index, 1);
  },
  loadMoreFollowings(state){
    const diff = totalFollowings - state.followingList.length;
    const fakeUsers = Array(diff > limit? limit : diff).fill().map(v => ({
      id: Math.random().toString(),
      nickname: Math.floor(Math.random() * 1000),
    }));

    state.followingList = state.followingList.concat(fakeUsers);
    state.hasMoreFollowing = fakeUsers.length === limit;
  },
  loadMoreFollowers(state){
    const diff = totalFollowers - state.followerList.length;
    const fakeUsers = Array(diff > limit? limit : diff).fill().map(v => ({
      id: Math.random().toString(),
      nickname: Math.floor(Math.random() * 1000),
    }));

    state.followerList = state.followerList.concat(fakeUsers);
    state.hasMoreFollower = fakeUsers.length === limit;
  }
};

export const actions = {
  async loadUser({ commit }){
    try{
      const userInfoRes = await this.$axios.get('/user',
      {},
      {
        withCredentials: true
      });

      if(userInfoRes.data){
        commit('setMe', userInfoRes.data);
      }
    }catch(err){
      console.error(err);
    }
  },
  // 회원가입
  async signUp({ commit }, payload) {
    try{
      const userInsertRes = await this.$axios.post('/user',
      {
        email: payload.email,
        nickname: payload.nickname,
        password: payload.password
      },{
        withCredentials: true
      });

      if(userInsertRes.data.result){
        alert('회원가입되었습니다.');
        commit('setMe', userInsertRes.data.userInfo);
      }

      return userInsertRes.data;
    }catch(err){
      console.log(err);
    }
  },
  async signIn({ commit }, payload) {
    try{
      const userLoginRes = await this.$axios.post('/user/login',
      {
        email: payload.email,
        password: payload.password
      },{
        withCredentials: true
      });

      if(userLoginRes.data.result){
        this.$auth.$storage.setUniversal('id', payload.email);
        commit('setMe', userLoginRes.data.userInfo);
      }
      
      return userLoginRes.data;
    }catch(err){
      console.log(err);
    }
  },
  async signOut({ commit }, payload) {
    try{
      const signOutRes = await this.$axios.post('/user/logout', 
      {},
      {
        withCredentials: true
      });

      if(signOutRes.data.result){
        commit('setMe', null);
      }
      alert('로그아웃되었습니다.');
    }catch(err){
      console.log(err);
    }
  },
  changeNickname({commit}, payload){
    commit('changeNickname', payload);
  },
  addFollowing({commit}, payload){
    commit('addFollowing', payload);
  },
  addFollower({commit}, payload){
    commit('addFollower', payload);
  },
  removeFollowing({commit}, payload){
    commit('removeFollowing', payload);
  },
  removeFollower({commit}, payload){
    commit('removeFollower', payload);
  },
  loadFollowers({commit, state}, payload){
    if(state.hasMoreFollower){
      commit('loadMoreFollowers');
    } 
  },
  loadFollowings({commit, state}, payload){
    if(state.hasMoreFollowing){
      commit('loadMoreFollowings');
    }
  }
}