export const state = () => ({
  mainPosts: [],
  hasMorePost: true,
  page: 1,
  imagePaths: [],
});

const limit = 10;

export const mutations = {
  addMainPost(state, payload){
    state.imagePaths = [];
    state.mainPosts.unshift(payload);
  },
  removeMainPost(state, payload){
    const index = state.mainPosts.findIndex(v => v.id === payload.postId);
    
    state.mainPosts.splice(index, 1);
  },
  addComment(state, payload){
    const index = state.mainPosts.findIndex(v => v.id === payload.postId);

    state.mainPosts[index].Comments.unshift(payload);
  },
  loadPosts(state, payload){
    state.page++;
    state.mainPosts = state.mainPosts.concat(payload);
    state.hasMorePost = payload.length == limit;
  },
  concatImagePaths(state, payload){
    state.imagePaths = state.imagePaths.concat(payload);
  },
  removeImagePath(state, payload){
    state.imagePaths.splice(payload, 1);
  },
  onLike(state, payload){
    const index = state.mainPosts.findIndex(v => v.id === payload.postId);

    state.mainPosts[index].is_like = payload.is_like;
  }
};

export const actions = {
  async add({commit }, payload){
    // 3번째 변수 {root: true}를 넣으면 index.js의 같은 이름 호출
    try{
      const addRes = await this.$axios.post('/post', {
        content: payload.content,
        imagePaths: payload.imagePaths
      },{
        withCredentials: true
      });

      if(addRes.data.result){
        alert('게시글 등록 성공');
        commit('addMainPost', addRes.data.postInfo); 
      }

      return addRes.data;
    }catch(err){
      console.error(err);
    }
  },
  async removePost({commit}, payload){
    try{

      const removeRes = await this.$axios.post(`/post/remove`,
      {
        postId: payload.postId
      },
      { withCredentials: true }
      );

      if(removeRes.data.result){
        commit('removeMainPost', payload);
      }

      return removeRes.data;
    }catch(err){
      console.error(err);
    }
  },
  async addComment({commit}, payload){
    try{
      const addCommentRes = await this.$axios.post(`/post/${payload.postId}/comment`,
      {
        content: payload.content
      },
      { withCredentials: true }
      );
      
      if(addCommentRes.data.result){
        commit('addComment', addCommentRes.data.commentInfo);
      }

      return addCommentRes.data;

    }catch(err){
      console.log(err);
    }
  },
  async loadPosts({commit, state}, payload){
    try{
      if(state.hasMorePost){
        const getPostsRes = await this.$axios.get(`/posts?page=${state.page}&limit=${limit}`);

        if(!getPostsRes.data.result){
          alert(getPostsRes.data.msg);
          return false;
        }

        commit('loadPosts', getPostsRes.data.posts);
      }
    }catch(err){
      console.log(err);
    }
  },
  async uploadImages({ commit }, payload){
    try{
      const uploadImgRes = await this.$axios.post('/post/images', payload, {
        withCredentials: true
      });

      if(!uploadImgRes.data.result){
        alert('이미지 업로드 실패');
        return;
      }

      commit('concatImagePaths', uploadImgRes.data.files);
    }catch(err){
      console.error(err);
    }
  },
  async onLike({ commit }, payload){
    try{
      const onLikeRes = await this.$axios.post('/post/like', payload, {
        withCredentials: true
      });

      if(onLikeRes.data.result){
        commit('onLike', payload);
      }

      return onLikeRes.data;
    }catch(err){
      console.error(err);
    }
  }
}