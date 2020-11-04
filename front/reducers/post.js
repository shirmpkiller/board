import produce from '../util/produce';

export const initialState = {
   what: [],
    mainPosts: [], // 화면에 보일 포스트들
    addPostErrorReason: '', // 포스트 업로드 실패 사유
    isAddingPost: false, // 포스트 업로드 중
    postAdded: false, // 포스트 업로드 성공
    postRemoved : false,
    isAddingComment: false,
  addCommentErrorReason: '',
  commentAdded: false,
  commentRemoved: false,
    singlePost: ["asd"],
    commentList:[],
    hasMorePosts:true
  };
  export const LOAD_MAIN_POSTS_REQUEST = 'LOAD_MAIN_POSTS_REQUEST';
  export const LOAD_MAIN_POSTS_SUCCESS = 'LOAD_MAIN_POSTS_SUCCESS';
  export const LOAD_MAIN_POSTS_FAILURE = 'LOAD_MAIN_POSTS_FAILURE';
  
  export const LOAD_POST_REQUEST = 'LOAD_POST_REQUEST';
export const LOAD_POST_SUCCESS = 'LOAD_POST_SUCCESS';
export const LOAD_POST_FAILURE = 'LOAD_POST_FAILURE';

export const LOAD_USER_POSTS_REQUEST = 'LOAD_USER_POSTS_REQUEST';
export const LOAD_USER_POSTS_SUCCESS = 'LOAD_USER_POSTS_SUCCESS';
export const LOAD_USER_POSTS_FAILURE = 'LOAD_USER_POSTS_FAILURE';

export const LOAD_USER_COMMENTPOSTS_REQUEST = 'LOAD_USER_COMMENTPOSTS_REQUEST';
export const LOAD_USER_COMMENTPOSTS_SUCCESS = 'LOAD_USER_COMMENTPOSTS_SUCCESS';
export const LOAD_USER_COMMENTPOSTS_FAILURE = 'LOAD_USER_COMMENTPOSTS_FAILURE';

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';
export const REMOVE_POST_CHECK = 'REMOVE_POST_CHECK';

export const REMOVE_COMMENT_REQUEST = 'REMOVE_COMMENT_REQUEST';
export const REMOVE_COMMENT_SUCCESS = 'REMOVE_COMMENT_SUCCESS';
export const REMOVE_COMMENT_FAILURE = 'REMOVE_COMMENT_FAILURE';

export const LOAD_SEARCH_POSTS_REQUEST = 'LOAD_SEARCH_POSTS_REQUEST';
export const LOAD_SEARCH_POSTS_SUCCESS = 'LOAD_SEARCH_POSTS_SUCCESS';
export const LOAD_SEARCH_POSTS_FAILURE = 'LOAD_SEARCH_POSTS_FAILURE';

const reducer = (state = initialState, action) => produce(state, (draft) => {

      switch (action.type) {//draft를 state라 여기고 바꾸면 됨
        case ADD_POST_REQUEST: {
          draft.isAddingPost = true;
          draft.addingPostErrorReason = '';
          draft.postAdded = false;
          draft.what =action;
        //   for (var key of action.data.entries()) {
        //     console.log(key[0] + ', ' + key[1]);
        // }
          break;
        }
        case ADD_POST_SUCCESS: {
          draft.isAddingPost = false;
          draft.mainPosts.unshift(action.data); //앞에 추가되면 unshift
          draft.postAdded = true;
          //draft.imagePaths = [];
          break;
        }
        case ADD_POST_FAILURE: {
          draft.isAddingPost = false;
          draft.addPostErrorReason = action.error;
          break;
        }
        case LOAD_MAIN_POSTS_REQUEST: 
        case LOAD_SEARCH_POSTS_REQUEST:
        case LOAD_USER_POSTS_REQUEST: {
        draft.mainPosts = !action.lastId ? [] : draft.mainPosts; //lastId가 아예 없을때까지 포함해서 설정
        draft.hasMorePosts = action.lastId ? draft.hasMorePosts : true; //처음 불러오는거(lastId는 0)이면 true(스크롤기능활성) 더 불러오고있는상태면 기존상태유지
        break;
      }
      case LOAD_MAIN_POSTS_SUCCESS:
        case LOAD_SEARCH_POSTS_SUCCESS:
        case LOAD_USER_POSTS_SUCCESS:{
        action.data.forEach((d) => {
          draft.mainPosts.push(d);
        });
        draft.hasMorePosts = action.data.length === 10; //스크롤할게 더 있는지 판단하는 부분
        break;
      }
      case LOAD_USER_COMMENTPOSTS_REQUEST: {
        draft.commentList = !action.lastId ? [] : draft.mainPosts; //lastId가 아예 없을때까지 포함해서 설정
        break;
      }
      case LOAD_USER_COMMENTPOSTS_SUCCESS:{
        action.data.forEach((d) => {
          draft.commentList.push(d);
      });
      break;
    }

      case LOAD_MAIN_POSTS_FAILURE:
        case LOAD_SEARCH_POSTS_FAILURE:
        case LOAD_USER_POSTS_FAILURE: 
        case LOAD_USER_COMMENTPOSTS_FAILURE : {
        break;
      }
      case LOAD_POST_SUCCESS: {
        draft.singlePost = action.data;
        break;
      }
      case ADD_COMMENT_REQUEST: {
        draft.isAddingComment = true;
        draft.addCommentErrorReason = '';
        draft.commentAdded = false;
        break;
      }
      case ADD_COMMENT_SUCCESS: {
        //const postIndex = draft.mainPosts.findIndex(v => v.id === action.data.postId);
        draft.singlePost.Comments.push(action.data.comment); //추가하는 건 unshift 또는 push
        draft.isAddingComment = false;
        draft.commentAdded = true;
        break;
      }
      case ADD_COMMENT_FAILURE: {
        draft.isAddingComment = false;
        draft.addingPostErrorReason = action.error;
        break;
      }
      case REMOVE_POST_REQUEST: {
        draft.postRemoved =false;
        break;
      }
      case REMOVE_POST_SUCCESS: {
        const index = draft.mainPosts.findIndex(v => v.id === action.data);
        draft.mainPosts.splice(index, 1);
        draft.postRemoved =true;
        break;
      }
      case REMOVE_POST_FAILURE: {
        break;
      }
      
      case REMOVE_POST_CHECK: {
        draft.postRemoved =false;
        break;
      }
      case REMOVE_COMMENT_REQUEST: {
        draft.commentRemoved =false;
        break;
      }
      case REMOVE_COMMENT_SUCCESS: {
        const index = draft.singlePost.Comments.findIndex(v => v.id === action.data);
        draft.singlePost.Comments.splice(index, 1);
        draft.commentRemoved =true;
        break;
      }
      case REMOVE_COMMENT_FAILURE: {
        break;
      }
        default: {
          break;
        }
      }
    });
    export default reducer;