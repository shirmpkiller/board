import React, {useState, useCallback} from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Col, Input, Menu, Row,Layout,Button} from 'antd';
import { useSelector } from 'react-redux';
import Router from 'next/router';
import useInput from '../hooks/useInput';
import { useMediaQuery } from 'react-responsive'
import styled from 'styled-components'

import {
  RobotOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';

const AppLayout = ({ children }) => { //children은 props임
  const { me } = useSelector(state => state.user);
  const [collapsed,setCollapsed] = useState(false);
  const [searchInput, onChangeSearchInput] = useInput('');
  const {  Footer } = Layout;
  const buttonStyle = {
    padding : '0px 0px 0px 6px',
    borderStyle : 'none'
  }
 

 
  const xs = useMediaQuery({
    query : "(max-width:576px)"
  });
  const sm = useMediaQuery({
    query : "(min-width:577px) and (max-width:768px)"
  });
  const md = useMediaQuery({
    query : "(min-width:769px)"
  });

  const onSearch = useCallback(() => {
    Router.push(`/search/${searchInput}`);
  }, [searchInput]);
 
 const toggleCollapsed = useCallback(() => {
   setCollapsed(prev => !prev)
  },[collapsed]);
  return (/*
    a태그의 href는 link가 가져간다
  */
    <div>
      {(sm || xs) ?
          <Menu mode="horizontal" >
            <Menu.Item style={{borderBottom : 'none'}} key="home"/*key가 일종의 반복문 역할을 해서 넣는 것같음 */>
              <Link href="/"><a style={{ color: 'DodgerBlue', fontSize: '20px' }}><RobotOutlined style={{ marginTop: '6px', fontSize: '30px', color: 'DodgerBlue' }} />Asimov</a></Link>
            </Menu.Item>
            <Menu.Item key="mail" style={{ float: 'right' }}>
              <Button style={buttonStyle} onClick={toggleCollapsed} >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              </Button>
              {collapsed &&
                <Menu
                  defaultSelectedKeys={['1']}
                  defaultOpenKeys={['sub1']}
                  mode="inline"
                  theme="dark"
                  inlineCollapsed={collapsed}
                >
                  <Menu.Item key="1">
                    Option 1
                </Menu.Item>
                  <Menu.Item key="2">
                    Option 2
              </Menu.Item>
                  <Menu.Item key="3">
                    Option 3
              </Menu.Item>
                </Menu>
              }

            </Menu.Item>
          </Menu>
        
       
       :
       <Menu mode="horizontal" overflowedIndicator={<MenuUnfoldOutlined style={{fontSize:'20px'}}/>} >
       <Menu.Item key="home"/*key가 일종의 반복문 역할을 해서 넣는 것같음 */>
         <Link href="/"><a style={{color:'DodgerBlue', fontSize:'20px'}}><RobotOutlined style={{marginTop:'6px', fontSize:'30px',color:'DodgerBlue'}}/>Asimov</a></Link>
       </Menu.Item>
       <Menu.Item key="freeboard"><Link href="/freeboard"><a>자유게시판</a></Link></Menu.Item>
       <Menu.Item key="profile"><Link href="/profile"><a>프로필</a></Link></Menu.Item>
       <Menu.Item key="mail" style={{float:'right'}}>
         <Input.Search
           enterButton
           style={{ verticalAlign: 'middle' }} ///*react에서 style 적용시 객체형식으로/원래 vertical-align인데 자바스크립트에서는 -를 못써서 대문자 A로 바꿔 붙여씀*/
           onChange={onChangeSearchInput}
           onSearch={onSearch} //검색함수
         />
       </Menu.Item>
     </Menu>
       }
      
      <Row >
        <Col span={24}>
          {children}
        </Col>
      </Row>
      
      <Footer style={{marginTop: '80px', padding : '60px 0px', textAlign: 'center', backgroundColor: 'lightgray', color:'gray'}}>
      대표이사 : shrimp Killer<br/>
      주소 : 경기도 부산시 강남구 점필재로 74<br/>
      COPYRIGHT © 2020 ALL RIGHTS RESERVED BY SHRIMP KILLER.
      </Footer>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,//렌더링 되는 모든 것은 node
};

export default AppLayout;
