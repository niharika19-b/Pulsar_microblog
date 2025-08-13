import React, { useState, useEffect } from "react";
import TweetCard from "./TweetCard";

function InfiniteList({ fetchData }) {
  const [tweets, setTweets] = useState([]);

  const loadData = async () => {
    try {
      const data = await fetchData();
      setTweets(data);
    } catch (err) {
      console.error("Error loading tweets", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      {tweets.length > 0 ? (
        tweets.map((tweet) => (
          <TweetCard key={tweet.id} tweet={tweet} onAction={loadData} />
        ))
      ) : (
        <p>No tweets yet.</p>
      )}
    </div>
  );
}

export default InfiniteList;
