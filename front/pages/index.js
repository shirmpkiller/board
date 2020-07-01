import React from 'react';
import { useSelector} from 'react-redux';
import {Col,Row,Table, Divider} from 'antd';
import LoginForm from '../containers/LoginForm';
import UserProfile from '../containers/UserProfile';
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
    { key: '1', name: 'John Brown', age: 32,  },
    { key: '2', name: 'Jim Green',   age: 42,  },
    { key: '3', name: 'Joe Black', age: 32,  },
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

export default Home;
