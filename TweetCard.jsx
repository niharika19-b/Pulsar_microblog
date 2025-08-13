import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import API from "../api/axios";

function TweetCard({ tweet, onAction }) {
  const handleLike = async () => {
    try {
      await API.post(`/tweets/${tweet.id}/like`);
      if (onAction) onAction();
    } catch (err) {
      console.error("Like error", err);
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/tweets/${tweet.id}`);
      if (onAction) onAction();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>
          <Link to={`/profile/${tweet.authorUsername}`}>
            @{tweet.authorUsername}
          </Link>
        </Card.Title>
        <Card.Text>{tweet.content}</Card.Text>
        <small className="text-muted">{new Date(tweet.createdAt).toLocaleString()}</small>
        <div className="mt-2">
          <Button variant="outline-primary" size="sm" onClick={handleLike}>
            ❤️ {tweet.likeCount}
          </Button>
          {tweet.isAuthor && (
            <Button variant="outline-danger" size="sm" className="ms-2" onClick={handleDelete}>
              Delete
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default TweetCard;
