import produce from 'immer';//immer에서 produce라느 것을 가져온다

export const initialState = {
   what: [],
    mainPosts: [], // 화면에 보일 포스트들
    addPostErrorReason: '', // 포스트 업로드 실패 사유
    isAddingPost: false, // 포스트 업로드 중
    postAdded: false, // 포스트 업로드 성공
    singlePost: null,
  };
  export const LOAD_MAIN_POSTS_REQUEST = 'LOAD_MAIN_POSTS_REQUEST';
  export const LOAD_MAIN_POSTS_SUCCESS = 'LOAD_MAIN_POSTS_SUCCESS';
  export const LOAD_MAIN_POSTS_FAILURE = 'LOAD_MAIN_POSTS_FAILURE';
  
export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export default (state = initialState, action) => {
    return produce(state, (draft) => {//immer 사용하기 위한 줄 /더이상 불변성 유지 안해도됨
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
        case LOAD_MAIN_POSTS_REQUEST: {
        draft.mainPosts = !action.lastId ? [] : draft.mainPosts; //lastId가 아예 없을때까지 포함해서 설정
        //draft.hasMorePost = action.lastId ? draft.hasMorePost : true; //처음 불러오는거(lastId는 0)이면 true(스크롤기능활성) 더 불러오고있는상태면 기존상태유지
        break;
      }
      case LOAD_MAIN_POSTS_SUCCESS:{
        action.data.forEach((d) => {
          draft.mainPosts.push(d);
        });
       // draft.hasMorePost = action.data.length === 10; //스크롤할게 더 있는지 판단하는 부분
        break;
      }
      case LOAD_MAIN_POSTS_FAILURE: {
        break;
      }
        default: {
          break;
        }
      }
    });
};