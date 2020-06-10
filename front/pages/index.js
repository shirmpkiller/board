import React from 'react';
import { useSelector} from 'react-redux';
import {Col,Row} from 'antd';
import LoginForm from '../containers/LoginForm';
import UserProfile from '../containers/UserProfile';
/*
  useEffect는 특정 값이 변할 때 콜백함수처럼 사용하는 것이고요.
  useRef는 값을 기억해두는 역할을 합니다. useRef의 값은 바뀌어도 리렌더링되지 않습니다.
*/
const Home = () => {
  const { me } = useSelector(state => state.user);
 
  return (
    <div>
       <Row>
        <Col xs={24} md={6}>
          {me//로그인한 상황이면 userprofile을 보여주고 아니면 loginform
            ? <UserProfile />
            : <LoginForm />}
        </Col>
      </Row>
    </div>
  );
};


export default Home;
