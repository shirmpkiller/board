import React, { useCallback, useEffect, useState } from 'react';
import { Avatar, Button, Card, Comment, Form, Icon, Input, List, Popover } from 'antd';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';


const PostCard = ({ post }) => {//post는 props임
  const { me } = useSelector(state => state.user);
  const dispatch = useDispatch();
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
  post:PropTypes.arrayOf( PropTypes.shape({//객체 상세정보를 주려면 shape
    User: PropTypes.object,
    content: PropTypes.string,
    createdAt: PropTypes.string,
  })).isRequired,
};

export default PostCard;
