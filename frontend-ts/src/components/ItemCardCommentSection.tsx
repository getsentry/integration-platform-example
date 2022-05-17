import styled from '@emotion/styled';
import React from 'react';

import {ItemComment} from '../types';

type ItemCardCommentSectionProps = {
  comments: ItemComment[];
};

const getTimeString = (timestamp: string) => {
  const date = new Date(timestamp);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

const ItemCardCommentSection = ({comments}: ItemCardCommentSectionProps) => {
  const sortedComments = comments.sort((a, b) => {
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  });
  return (
    <CommentSection>
      <summary>
        <b>Comments</b>
      </summary>
      {sortedComments.map(comment => (
        <CommentWrapper key={comment.sentryCommentId}>
          <div className="comment-author">
            {comment.author}
            <p className="comment-time">{getTimeString(comment.timestamp)}</p>
          </div>
          <p className="comment-text">{comment.text}</p>
        </CommentWrapper>
      ))}
    </CommentSection>
  );
};

const CommentSection = styled.details`
  margin: 0.5rem 0;
  border-top: 0.5px solid ${p => p.theme.gray200};
  padding-top: 0.5rem;
  color: ${p => p.theme.gray400};
`;

const CommentWrapper = styled.div`
  font-size: 12px;
  margin: 1rem 0.5rem;
  padding: 0 0.5rem;
  p {
    margin: 0;
  }
  .comment-author {
    font-weight: bold;
  }
  .comment-time {
    font-style: italic;
    font-weight: normal;
  }
  .comment-text {
    font-size: 14px;
    padding: 0.5rem;
  }
  border-left: 2px solid ${p => p.theme.gray200};
`;

export default ItemCardCommentSection;
