import { Avatar, Button, Card,List,Col,Row } from 'antd';
import React, { useCallback } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { LOG_OUT_REQUEST } from '../reducers/user';
import {NewButton} from '../components/styles/userprofileStyle';
const UserProfile = () => {
  const { me } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const onLogout = useCallback(() => {
    dispatch({
      type: LOG_OUT_REQUEST,
    });
  }, []);

  return (
    <div >
         <Card>
      <Card.Meta
        avatar={<Avatar>{me.nickname[0]}</Avatar>}
        title={me.nickname}
      />
      <Button onClick={onLogout}>로그아웃</Button>
    </Card>
    <Link href={{ pathname: '/user', query: { id: me.id } }}
      as={`/user/${me.id}`}>
        <a> <NewButton block>내가 쓴 글</NewButton></a>
      </Link>
    <Link href={{ pathname: '/usercomment', query: { id: me.id } }}
      as={`/usercomment/${me.id}`}><a> <NewButton block>댓글 단 글</NewButton></a></Link>
    <Link href="/signup"><a> <NewButton block>스크랩 한 글</NewButton></a></Link>
       
</div>
  );
};

export default UserProfile;
