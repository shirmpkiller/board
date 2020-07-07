import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Col, Input, Menu, Row} from 'antd';
import { useSelector } from 'react-redux';
import Router from 'next/router';

const AppLayout = ({ children }) => { //children은 props임
  const { me } = useSelector(state => state.user);

  const onSearch = (value) => {
    Router.push({ pathname: '/search', query: { keyword: value } }, `/search/${value}`);//두번째 인자는 실제로 겉으로 보일 주소
    //프로그램적으로 페이지를 바꾸는 것 router 컴포넌트적으로 바꾸는건 link
  };

  return (/*
    a태그의 href는 link가 가져간다
  */
    <div>
      <Menu mode="horizontal">
        <Menu.Item key="home"/*key가 일종의 반복문 역할을 해서 넣는 것같음 */><Link href="/"><a>Home</a></Link></Menu.Item>
        <Menu.Item key="profile"><Link href="/profile"><a>프로필</a></Link></Menu.Item>
        <Menu.Item key="freeboard"><Link href="/freeboard"><a>자유게시판</a></Link></Menu.Item>
        <Menu.Item key="mail">
          <Input.Search
            enterButton
            style={{ verticalAlign: 'middle' }} ///*react에서 style 적용시 객체형식으로/원래 vertical-align인데 자바스크립트에서는 -를 못써서 대문자 A로 바꿔 붙여씀*/
            onSearch={onSearch} //검색함수
          />
        </Menu.Item>
      </Menu>
      <Row >
        <Col xs={24} >
          {children}
        </Col>
      </Row>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,//렌더링 되는 모든 것은 node
};

export default AppLayout;
