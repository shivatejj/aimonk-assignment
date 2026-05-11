import { useState } from "react";
import "../styles/tagview.css";

function TagView({
  node,
  setTree,
  path = [],
}) {

const [collapsed, setCollapsed] =useState(false);
const [isEditing, setIsEditing] =useState(false);
const [editedName, setEditedName] =useState(node.name);

const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

const handleNameSave = (e) => {
if (e.key === "Enter") {
const updatedTree =structuredClone(node);
updatedTree.name =editedName;
setTree(updatedTree);
setIsEditing(false);
    }
  };

const handleDataChange = (e) => {
const value = e.target.value;
const updatedTree =structuredClone(node);
updatedTree.data = value;
setTree(updatedTree);
};

const handleAddChild = () => {
const updatedTree =structuredClone(node);
const newChild = {
      name: "New Child",
      data: "Data",
    };
if (updatedTree.children) {
    updatedTree.children.push(
        newChild
      );
    } else {
      delete updatedTree.data;
      updatedTree.children = [
        newChild,
      ];
    }
    setTree(updatedTree);
  };


  return (
    <div className="tag-container">
      <div className="tag-header">
        <div className="left-section">
          <button
            className="collapse-btn"
            onClick={toggleCollapse}
          >
            {collapsed ? ">" : "v"}
          </button>
         {isEditing ? (

  <input
    className="tag-input"
    type="text"
    value={editedName}
    onChange={(e) =>
      setEditedName(
        e.target.value
      )
    }
    onKeyDown={handleNameSave}
    autoFocus
  />
) : (

  <span
    onClick={() =>
      setIsEditing(true)
    }
    style={{
      cursor: "pointer"
    }}
  >
    {node.name}
  </span>

)}
        </div>

        <button onClick={handleAddChild}>
          Add Child
        </button>

      </div>


      {!collapsed && (
        <div className="tag-body">

          {node.data !== undefined && (
            <input
  className="tag-input"
  type="text"
  value={node.data}
  onChange={handleDataChange}
/>
          )}


          {node.children &&
            node.children.map(
              (child, index) => (

                <TagView
                  key={index}
                  node={child}
                  setTree={(updatedChild) => {

                    const updatedTree =
                      structuredClone(node);

                    updatedTree.children[
                      index
                    ] = updatedChild;

                    setTree(updatedTree);
                  }}
                />

              )
            )}

        </div>
      )}

    </div>
  );
}

export default TagView;