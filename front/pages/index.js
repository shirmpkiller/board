import React from 'react';
import { useSelector} from 'react-redux';
import {Col,Row,Table, Divider} from 'antd';
import LoginForm from '../containers/LoginForm';
import UserProfile from '../containers/UserProfile';
import { END } from 'redux-saga';
import axios from 'axios';
import wrapper from '../store/configureStore';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';

/*
  useEffect는 특정 값이 변할 때 콜백함수처럼 사용하는 것이고요.
  useRef는 값을 기억해두는 역할을 합니다. useRef의 값은 바뀌어도 리렌더링되지 않습니다.
*/
const Home = () => {
  const { me } = useSelector(state => state.user);
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
    },
  ];
  const data = [
    { key: '1', name: '답글, 댓글 삭제', age: 32,  },
    { key: '2', name: '좋아요 싫어요',   age: 42,  },
    { key: '3', name: '이미지, 동영상 저장', age: 32,  },
    { key: '4', name: '아이디 찾기', age: 32,  },
    { key: '5', name: '네이버 카카오 구글 로그인', age: 32,  },
    { key: '6', name: '프로필 변경 페이지', age: 32,  },

  ];

  return (
    <div style={{marginTop:15}}>
        <Row gutter={8} >
          <Col xs={{span:22, offset:1}} md={{span:3,offset:1}} >
            {me//로그인한 상황이면 userprofile을 보여주고 아니면 loginform
              ? <UserProfile />
              : <LoginForm />}
         </Col>
         <Col xs={{span:22, offset:1}} md={{span:15}} >
          <Divider orientation="left">공지사항</Divider>
          <Table columns={columns} dataSource={data} size="middle" />
         </Col>
        </Row>
    </div>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  console.log('getServerSideProps start');
  console.log(context.req.headers);//cookie가 있다면 headers에 들어 있음
  const cookie = context.req ? context.req.headers.cookie : '';//서버사이드렌더링하면 브라우저에서가 아니라 프런드서버에서 실행돼서
  axios.defaults.headers.Cookie = '';                           //쿠키를 수동으로 보내게 설정해야함
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch({ //context안에 store라는 게 있음
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch(END);//request만 하고 끝나는게 아니라 success가 될 때까지 기다리기 위해서
  console.log('getServerSideProps end');
  await context.store.sagaTask.toPromise();//app.js에 sagaTask설정 해줬었음
});

export default Home;
