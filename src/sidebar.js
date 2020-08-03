import React from "react";
import { ListGroup } from "react-bootstrap";

function Sidebar({ images, currentImageIndex, setCurrentImageIndex }) {
  return (
    <ListGroup variant="flush" className="SideBar">
      {Array.from(images).map((image, i) => (
        <ListGroup.Item
          active={currentImageIndex === i}
          key={i}
          onClick={() => setCurrentImageIndex(i)}
        >
          {image.name}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

export default React.memo(Sidebar);
