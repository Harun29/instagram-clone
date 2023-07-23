import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../config/firebase";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

const PostsList = ({ postsList }) => {
  const [postsPhotos, setPostsPhotos] = useState([]);

  useEffect(() => {
    console.log("photos: ", postsPhotos);
  }, [postsPhotos]);

  useEffect(() => {
    const fetchPosts = async (postId) => {
      try {
        const docRef = doc(db, "posts", postId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const postPicture = await getDownloadURL(
            ref(storage, `posts_pictures/${docSnap.data().photo}`)
          );
          return {
            picture: postPicture,
            link: docSnap.id,
          };
        } else {
          console.log("No such document!");
          return null;
        }
      } catch (err) {
        console.error(err);
        return null;
      }
    };

    try {
      // Use Promise.all to wait for all fetch operations to complete
      Promise.all(postsList.map((post) => fetchPosts(post))).then((results) => {
        // Filter out null results (failed fetches)
        const filteredResults = results.filter((result) => result !== null);
        setPostsPhotos(filteredResults);
      });
    } catch (err) {
      console.error(err);
    }
  }, [postsList]);

  return (
    <>
      {!postsPhotos.length ? (
        <div>Loading...</div>
      ) : (
        <Row className="mt-5">
          {postsPhotos.map((post, index) => (
            <Col key={index} xs={12} sm={6} md={4} lg={4} xl={4}>
              <Link to={`post/user/${post.link}`}>
                <img
                  src={post.picture}
                  alt={`Post ${index + 1}`}
                  style={{ width: "300px", height: "auto" }}
                />
              </Link>
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default PostsList;
