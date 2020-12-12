
import React, { useState, useCallback, useEffect, useRef } from 'react';

import { useSelector } from 'react-redux';
import { Col, Row, Carousel, Divider, Table } from 'antd';
import LoginForm from '../containers/LoginForm';
import UserProfile from '../containers/UserProfile';
import { END } from 'redux-saga';
import axios from 'axios';
import wrapper from '../store/configureStore';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import { LOAD_MAIN_POSTS_REQUEST, LOAD_HOT_POSTS_REQUEST } from '../reducers/post';
import {
  LikeOutlined,
} from '@ant-design/icons';

/*
  useEffect는 특정 값이 변할 때 콜백함수처럼 사용하는 것이고요.
  useRef는 값을 기억해두는 역할을 합니다. useRef의 값은 바뀌어도 리렌더링되지 않습니다.
*/
const Home = () => {
  const { me } = useSelector(state => state.user);
  const { mainPosts, hotPosts } = useSelector(state => state.post);

  const carouselStyle = {
    height: '200px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  };

  let data = [];
  let hotData = [];

  for (let i = 0; i < 5; i++) {
    data[i] = {
      key: i,
      title: mainPosts[i].title,
      // like: mainPosts[i].Likers.length,
      name: <><LikeOutlined style={{ color: 'blue' }} />
        <span style={{ marginRight: '3px' }}>{mainPosts[i].Likers.length}</span>{mainPosts[i].anonymity ? mainPosts[i].User.nickname : '익명'}
      </>,
    }
  };

  for (let i = 0; i < 5; i++) {
    if (hotData[i]) {
      hotData[i] = {
        key: i,
        title: hotPosts[i].title,
        // like: mainPosts[i].Likers.length,
        name: <><LikeOutlined style={{ color: 'blue' }} />
          <span style={{ marginRight: '3px' }}>{hotPosts[i].Likers.length}</span>{hotPosts[i].anonymity ? hotPosts[i].User.nickname : '익명'}
        </>,
      }
    }

  };
  const columns = [
    {
      dataIndex: 'title',
      ellipsis: true,
    },
    // {
    //   dataIndex: 'like',
    //   width:'30px',
    //   align:'right',
    // },
    {
      dataIndex: 'name',
      width: ' 100px',
      align: 'right',
      ellipsis: true,
      render: text => <span style={{ fontSize: '13px', color: 'gray' }}>{text}</span>,
    },
  ];


  return (
    <div style={{ marginTop: 15 }}>
      <Row  gutter={8} >
        <Col xs={{ span: 16, offset: 4 }} sm={{span: 5, offset:1}} md={{ span: 4, offset: 1 }} lg={{ span: 3, offset: 1 }} >
          {me//로그인한 상황이면 userprofile을 보여주고 아니면 loginform
            ? <UserProfile />
            : <LoginForm />}
        </Col>
        <Col xs={{ span: 22, offset: 1 }} sm={{ span: 7 }} >
          <Divider orientation="left">weekly'best</Divider>
          <Table size='small' columns={columns} pagination={false} showHeader={false} dataSource={data} />
        </Col>
        <Col xs={{ span: 22, offset: 1 }} sm={{ span: 7 }} >
          <Divider orientation="left">editor's choice</Divider>
          <Table size='small' columns={columns} pagination={false} showHeader={false} dataSource={hotData} />
        </Col>
      </Row>
      <Row gutter={8}>
        <Col xs={{ span: 22, offset: 1 }} sm={{ span: 11, offset: 5}} >
          <Carousel autoplay style={{ marginTop: '8px' }}>
            <div>
              <h3 style={carouselStyle}>1</h3>
            </div>
            <div>
              <h3 style={carouselStyle}>2</h3>
            </div>
            <div>
              <h3 style={carouselStyle}>3</h3>
            </div>
            <div>
              <h3 style={carouselStyle}>4</h3>
            </div>
          </Carousel>,
          </Col>
      </Row>


    </div>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  console.log('getServerSideProps start');
  //console.log(context.req.headers);//cookie가 있다면 headers에 들어 있음
  const cookie = context.req ? context.req.headers.cookie : '';//서버사이드렌더링하면 브라우저에서가 아니라 프런드서버에서 실행돼서
  axios.defaults.headers.Cookie = '';                           //쿠키를 수동으로 보내게 설정해야함
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch({ //context안에 store라는 게 있음
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_MAIN_POSTS_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_HOT_POSTS_REQUEST,
  });
  context.store.dispatch(END);//request만 하고 끝나는게 아니라 success가 될 때까지 기다리기 위해서
  console.log('getServerSideProps end');
  await context.store.sagaTask.toPromise();//app.js에 sagaTask설정 해줬었음
});

export default Home;
