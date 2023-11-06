import React from "react";

function ImageList({ images, nftTokens }) {
  console.log("nftTokens :", nftTokens);
  console.log("img list : ", images);
  return (
    <div className="image-main-container">
      {images.map((image, index) => (
        <div key={index} className="image-card" style={{}}>
          <img src={image} alt={`Image ${index}`} />
          <div className="token-info">{nftTokens[index].tokenId}</div>
          <div className="token-info">{nftTokens[index].hometown}</div>
        </div>
      ))}
    </div>
  );
}

export default ImageList;
