import React, { useCallback, useEffect, useState } from 'react';
import { Avatar, Button, Card, Comment, Form, Icon, Input, List, Popover } from 'antd';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import moment from 'moment';
import {
  PictureOutlined
} from '@ant-design/icons';
const PostCard = ({ post }) => {//post는 props임
  const { me } = useSelector(state => state.user);
 const { imagePaths } = useSelector(state => state.post);

  const dispatch = useDispatch();

  const NewButton = styled(Button)`
 :hover {color: rgb(255,0,0);
    border-color:rgb(255,0,0);}
`;

  const onRemovePost = useCallback(() => {
    dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id,
    });
  });

  const extrabutton = <NewButton type="text" danger onclick={onRemovePost}>
    삭제
  </NewButton>

  /*
    const onRemovePost = useCallback(userId => () => {
      dispatch({
        type: REMOVE_POST_REQUEST,
        data: userId,
      });
    });*/
  // const postTime = <span style={{color :'rgba(0.5,0.5,0.5,0.5)'}}>{moment(post.createdAt).format('YYYY-MM-DD')}</span>
  const postTitle = <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{post.title}</span>

  
  useEffect(() => {
    if(post.Images[0]){
      console.log(post.Images[0].src);
    }
  }, []);
  return (
    <Link href={{ pathname: '/post', query: { id: post.id } }} as={`/post/${post.id}`}>
      <a>
        <Card style={{ marginTop: 16 }}
          type="inner"
          title={postTitle}
          extra={<span style={{ color: 'rgba(0.5,0.5,0.5,0.5)' }}>
            {moment(moment()).isBefore(moment(post.createdAt).add(1, 'days'), 'date') ? `오늘 ${moment(post.createdAt).format('hh:mm a')}`
              : moment(post.createdAt).format('YYYY-MM-DD')}</span>} >
                    <div style={{display:'inline-block'}}>{post.content}</div>
                    <div style={{display:'inline-block',float:'right'}}>  {post.Images[0] ? <img src={`http://localhost:3065/${post.Images[0].src}`} style={{ width: '100px' }} alt={'이미지'} /> : null}</div>
  {post.Images[0] ? <div style={{clear:'right',float: 'right', marginTop: '4px'}}><PictureOutlined />{` ${post.Images.length}`}</div> : null}
        </Card>
      </a>
    </Link>

  );
};

PostCard.propTypes = {
  post: PropTypes.object.isRequired
};

export default PostCard;
