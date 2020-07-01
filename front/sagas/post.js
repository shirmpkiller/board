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
} from '../reducers/post';
//mport { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from '../reducers/user';



function addPostAPI(postData) {
  for (var key of postData.entries()) {
    console.log(key[0] + ', ' + key[1]);
}
  return axios.post('/post', postData, {
    withCredentials: true,
  });
}

function* addPost(action) {
  for (var key of action.data.entries()) {
    console.log(key[0] + ', ' + key[1]);
}
  try {
    const result = yield call(addPostAPI, action.data);
    yield put({ // post reducer의 데이터를 수정
      type: ADD_POST_SUCCESS,
      data: result.data,
    });
    
  } catch (e) {
    yield put({
      type: ADD_POST_FAILURE,
      error: e,
    });
  }
}

function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost); 
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
  console.log(data.postId)
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

export default function* postSaga() {
  yield all([
    fork(watchAddPost),
    fork(watchLoadMainPosts),
    fork(watchLoadPost),
    fork(watchAddComment),
    fork(watchLoadUserPosts),
    fork(watchLoadUserCommentPosts)
  ]);
}
