import React from 'react';
import { useSelector } from 'react-redux';
import { Avatar, Card,Row,Col,Divider } from 'antd';
import { LOAD_USER_POSTS_REQUEST } from '../reducers/post';
import { LOAD_USER_REQUEST } from '../reducers/user';
import PostCard from '../containers/PostCard';
import LoginForm from '../containers/LoginForm';
import UserProfile from '../containers/UserProfile';
import {END} from 'redux-saga';
import wrapper from '../store/configureStore';
import axios from 'axios';

const User = () => {
  const { mainPosts } = useSelector(state => state.post);
  const { me } = useSelector(state => state.user);

  return (
    <div style={{marginTop:15}}>
       <Row gutter={8} >
            <Col xs={{span:22, offset:1}} md={{span:3,offset:1}} >
           
            {me//로그인한 상황이면 userprofile을 보여주고 아니면 loginform
              ? <UserProfile />
              : <LoginForm />}
            </Col>
            <Col xs={{span:22, offset:1}} md={{span:15}} >
            <Divider orientation="left">{me.nickname}님이 쓴 글</Divider>
            {mainPosts.map(c => (
              <PostCard key={c.id} post={c} />
            ))}
         </Col>
          </Row>
    </div>
  );
};


export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  const id = parseInt(context.query.id, 10);

  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch({//context의 키중에 store(리덕스 스토어)가 있는데 store안에는 dispatch,getstate(리덕스 스테이트를 가져올수있는)등이 있다
    type: LOAD_USER_REQUEST,
    data: id,
  });
  context.store.dispatch({
    type: LOAD_USER_POSTS_REQUEST,
    data: id,
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
  return { props: {} };
});

export default User;
