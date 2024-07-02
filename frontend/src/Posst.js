import React from 'react';
import { Link } from 'react-router-dom';
const { formatISO9075 } = require("date-fns");

export default function Post({_id ,title , summary ,cover , createdAt , author}) {
  return (
    <div className="post">
    <div className="image">
      <Link to={`/post/${_id}`}>
      <img src={'http://localhost:4000/' + cover} alt="Post" />
      </Link>  
    </div>
    <div className="texts"> 
    <Link to={`/post/${_id}`}>
      <h2>{title}</h2>
    </Link>
      <p className="info">
        <a className="author">{author.username}</a>
        <time>{formatISO9075(new Date(createdAt))}</time>
      </p>
      <p className="summary">{summary}</p>
    </div>
  </div>
  );
}
