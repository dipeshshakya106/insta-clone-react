import React, { useState } from "react";
import firebase from "firebase";
import { db, storage } from "./firebase";
import { Button, Input } from "@material-ui/core";

function ImageUpload({ username }) {
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState(null);
  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.log(error);
        alert(error.message);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("post").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username,
            });
            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };
  return (
    <div className="imageUpload">
      <progress className="imageUpload__progress"value={progress} max="100" />
      <Input
        type="text"
        placeholder="Enter the caption"
        onChange={(event) => setCaption(event.target.value)}
      />
      <Input type="file" onChange={handleChange} />
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
}

export default ImageUpload;
