import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { END } from 'redux-saga';

import axios from 'axios';
import { LOAD_SEARCH_POSTS_REQUEST } from '../../reducers/post';
import PostCard from '../../containers/PostCard';
import wrapper from '../../store/configureStore';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';

const Search = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { keyword } = router.query;
  const { mainPosts, hasMorePosts, loadSearchPostsLoading } = useSelector((state) => state.post);

  useEffect(() => {
    const onScroll = () => {
      if (window.pageYOffset + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
        if (hasMorePosts && !loadSearchPostsLoading) {
          dispatch({
            type: LOAD_SEARCH_POSTS_REQUEST,
            lastId: mainPosts[mainPosts.length - 1] && mainPosts[mainPosts.length - 1].id,
            data: keyword,
          });
        }
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [mainPosts.length, hasMorePosts, keyword]);

  return (
    <div>
      {mainPosts.map((c) => (
        <PostCard key={c.id} post={c} />
      ))}
    </div>
      
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
 // console.log(context);
  const cookie = context.req ? context.req.headers.cookie : '';
  //console.log(context);
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_SEARCH_POSTS_REQUEST,
    data: context.params.keyword,
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
  return { props: {} };
});

export default Search;
