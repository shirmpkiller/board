import { all, fork, takeLatest, put, throttle, call } from 'redux-saga/effects';
import axios from 'axios';
import {
  ADD_POST_FAILURE,
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  ADD_COMMENT_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  LOAD_MAIN_POSTS_FAILURE,
  LOAD_MAIN_POSTS_REQUEST,
  LOAD_MAIN_POSTS_SUCCESS,
  LOAD_POST_SUCCESS, LOAD_POST_FAILURE, LOAD_POST_REQUEST,
  LOAD_USER_POSTS_FAILURE,
  LOAD_USER_POSTS_REQUEST,
  LOAD_USER_POSTS_SUCCESS,
  LOAD_USER_COMMENTPOSTS_FAILURE,
  LOAD_USER_COMMENTPOSTS_REQUEST,
  LOAD_USER_COMMENTPOSTS_SUCCESS,
  REMOVE_POST_FAILURE,
  REMOVE_POST_REQUEST,
  REMOVE_POST_SUCCESS,
  REMOVE_COMMENT_FAILURE,
  REMOVE_COMMENT_REQUEST,
  REMOVE_COMMENT_SUCCESS,
  LOAD_SEARCH_POSTS_FAILURE,
  LOAD_SEARCH_POSTS_REQUEST,
  LOAD_SEARCH_POSTS_SUCCESS,
} from '../reducers/post';
//mport { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from '../reducers/user';



function addPostAPI(data) {
  for (var key of data.keys()) {
    console.log(key);
    }
    for (var value of data.values()) {
      console.log(value);
    }  return axios.post('/post', data);
}

function* addPost(action) {
  try {
    const result = yield call(addPostAPI, action.data);
    yield put({ // post reducer의 데이터를 수정
      type: ADD_POST_SUCCESS,
      data: result.data,
    });
    
  } catch (err) {
    console.error(err);
    yield put({
      type: ADD_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchAddPost() {
  yield throttle(1000,ADD_POST_REQUEST, addPost); 
}

function loadMainPostsAPI(lastId = 0, limit = 10) {//lastId가 0이면 처음부터 불러오는것
  return axios.get(`/posts?lastId=${lastId}&limit=${limit}`);
}

function* loadMainPosts(action) {
  try {
    const result = yield call(loadMainPostsAPI, action.lastId);
    yield put({
      type: LOAD_MAIN_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    yield put({
      type: LOAD_MAIN_POSTS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadMainPosts() {
  yield throttle(2000, LOAD_MAIN_POSTS_REQUEST, loadMainPosts); //load main posts request가 호출되고 2초동안 다시 호출 불가
  //throttle로 방지하는 거는 saga에만 해당되고 redux는 별개다
}


function loadPostAPI(postId) {
  console.log(postId)
  return axios.get(`/post/${postId}`);

}

function* loadPost(action) {
  try {
    const result = yield call(loadPostAPI, action.data);
    console.log(result.data);
    yield put({
      type: LOAD_POST_SUCCESS,
      data: result.data,
    });
    
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_POST_FAILURE,
      error: e,
    });
  }
}

function* watchLoadPost() {
  yield takeLatest(LOAD_POST_REQUEST, loadPost);
}

function addCommentAPI(data) {
  return axios.post(`/post/${data.postId}/comment`, { content: data.content }, {
    withCredentials: true,
  });
}

function* addComment(action) {
  try {
    const result = yield call(addCommentAPI, action.data);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: {
        postId: action.data.postId,
        comment: result.data,
      },
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: e,
    });
  }
}

function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

function loadUserPostsAPI(id) {
  return axios.get(`/user/${id || 0}/posts`);
}

function* loadUserPosts(action) {
  try {
    const result = yield call(loadUserPostsAPI, action.data);
    yield put({
      type: LOAD_USER_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    yield put({
      type: LOAD_USER_POSTS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadUserPosts() {
  yield takeLatest(LOAD_USER_POSTS_REQUEST, loadUserPosts);
}

function loadUserCommentPostsAPI(id) {
  return axios.get(`/user/${id || 0}/commentposts`);
}

function* loadUserCommentPosts(action) {
  try {
    const result = yield call(loadUserCommentPostsAPI, action.data);
    yield put({
      type: LOAD_USER_COMMENTPOSTS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    yield put({
      type: LOAD_USER_COMMENTPOSTS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadUserCommentPosts() {
  yield takeLatest(LOAD_USER_COMMENTPOSTS_REQUEST, loadUserCommentPosts);
}

function removePostAPI(postId) {
  return axios.delete(`/post/${postId}`, {
    withCredentials: true,
  });
}

function* removePost(action) {
  try {
    const result = yield call(removePostAPI, action.data);
    yield put({
      type: REMOVE_POST_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: REMOVE_POST_FAILURE,
      error: e,
    });
  }
}

function* watchRemovePost() {
  yield takeLatest(REMOVE_POST_REQUEST, removePost);
}

function removeCommentAPI(commentId) {
  return axios.delete(`/post/comment/${commentId}`, {
    withCredentials: true,
  });
}

function* removeComment(action) {
  try {
    const result = yield call(removeCommentAPI, action.data);
    yield put({
      type: REMOVE_COMMENT_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: REMOVE_COMMENT_FAILURE,
      error: e,
    });
  }
}

function* watchRemoveComment() {
  yield takeLatest(REMOVE_COMMENT_REQUEST, removeComment);
}

function loadSearchPostsAPI(keyword, lastId) {
  if(keyword){ return axios.get(`/search/${encodeURIComponent(keyword)}?lastId=${lastId}&limit=10`);}
  else { return axios.get(`/search/?lastId=${lastId}&limit=10`);}
} //한글, 특수문자는 줄때는 encode, 받을 때는 decode

function* loadSearchPosts(action) {
  try {
    const result = yield call(loadSearchPostsAPI, action.data, action.lastId);
    yield put({
      type: LOAD_SEARCH_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    yield put({
      type: LOAD_SEARCH_POSTS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadSearchPosts() {
  yield takeLatest(LOAD_SEARCH_POSTS_REQUEST, loadSearchPosts);
}

export default function* postSaga() {
  yield all([
    fork(watchAddPost),
    fork(watchLoadMainPosts),
    fork(watchLoadPost),
    fork(watchAddComment),
    fork(watchLoadUserPosts),
    fork(watchLoadUserCommentPosts),
    fork(watchRemovePost),
    fork(watchLoadSearchPosts),
    fork(watchRemoveComment),
  ]);
}
