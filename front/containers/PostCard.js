import React, { useCallback, useEffect, useState } from 'react';
import { Avatar, Button, Card, Comment, Form, Icon, Input, List, Popover } from 'antd';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

 
const PostCard = ({ post }) => {//post는 props임
  const { me } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const NewButton = styled(Button)`
 :hover {color: rgb(255,0,0);
    border-color:rgb(255,0,0);}
`;

const onRemovePost = useCallback( () => {
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
  
return (
    <Link href={{ pathname: '/post', query: { id: post.id} }} as={`/post/${post.id}`}>
    <a> 
        <Card style={{ marginTop: 16 }} type="inner" title={post.title} >
            {post.content}
        </Card>
    </a>
    </Link>
   
  );
};

PostCard.propTypes = {
  post:PropTypes.object.isRequired
};

export default PostCard;
