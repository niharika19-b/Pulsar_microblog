import React, { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import API from "../api/axios";

function TweetComposer({ onTweetPosted }) {
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await API.post("/tweets", { content });
      setContent("");
      if (onTweetPosted) onTweetPosted();
    } catch (err) {
      console.error("Error posting tweet", err);
    }
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="What's happening?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-2">
            Post
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default TweetComposer;
