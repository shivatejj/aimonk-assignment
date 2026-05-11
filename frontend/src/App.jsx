import { useEffect, useState } from "react";
import TagView from "./components/TagView";
import api from "./api";


function App() {
//Default Tree
  const initialTree = {
    name: "root",
    children: [
      {
        name: "child1",
        children: [
          {
            name: "child1-child1",
            data: "c1-c1 Hello",
          },
          {
            name: "child1-child2",
            data: "c1-c2 JS",
          },
        ],
      },
      {
        name: "child2",
        data: "c2 World",
      },
    ],
  };


  //States
const [trees, setTrees] = useState([]);
const [exportedJson, setExportedJson] =useState("");
const [backendMessage, setBackendMessage] =useState("");
  const [notification, setNotification] =
    useState({
      show: false,
      message: "",
      type: "",
    });


  //Backend Status
  useEffect(() => {
    const fetchBackend = async () => {
      try {
        const response =
          await api.get("/");
        setBackendMessage(
          response.data.message
        );
      } catch (error) {
        console.error(error);
      }
    };
    fetchBackend();
  }, []);


  // Load Trees
  useEffect(() => {
    const fetchTrees = async () => {
      try {
        const response =
          await api.get("/trees");
        // If Suppose Database is Empty
        if (response.data.length === 0) {
          setTrees([
            {
              id: null,
              tree_data: initialTree,
            },
          ]);

        } else {

          setTrees(response.data);
        }

      } catch (error) {

        console.error(error);

        setTrees([
          {
            id: null,
            tree_data: initialTree,
          },
        ]);
      }
    };

    fetchTrees();
  }, []);

    // SHOW NOTIFICATION
  const showNotification = (
    message,
    type = "success"
  ) => {

    setNotification({
      show: true,
      message,
      type,
    });

    // auto hide
    setTimeout(() => {

      setNotification({
        show: false,
        message: "",
        type: "",
      });

    }, 3000);
  };

  // Clean Tree
  const cleanTree = (node) => {
    const cleanedNode = {
      name: node.name,
    };
    if (node.data !== undefined) {
      cleanedNode.data = node.data;
    }

    if (node.children) {
      cleanedNode.children =
        node.children.map(cleanTree);
    }
    return cleanedNode;
  };


  // Update Tree in State
  const updateTreeAtIndex = (
    index,
    updatedTree
  ) => {
    const updatedTrees = [...trees];
    updatedTrees[index].tree_data =
      updatedTree;

    setTrees(updatedTrees);
  };


  // Export+Save
  const handleExport = async (
    treeItem,
    index
  ) => {
    try {
      const cleanedTree =
        cleanTree(
          treeItem.tree_data
        );

      const jsonString =
        JSON.stringify(
          cleanedTree,
          null,
          2
        );

      setExportedJson(jsonString);


      //Update the Existing Tree
      if (treeItem.id) {
        await api.put(
          `/trees/${treeItem.id}`,
          cleanedTree
        );
       showNotification(
  "Tree updated successfully!",
  "success"
);
      } else {

        // New Create → Crate
        const response =
          await api.post(
            "/trees",
            cleanedTree
          );
        const newId =
          response.data.data[0].id;
        const updatedTrees = [...trees];
        updatedTrees[index].id =
          newId;

        setTrees(updatedTrees);

       showNotification(
  "Tree saved successfully!",
  "success"
);
      }

    } catch (error) {

      console.error(error);

     showNotification(
  "Tree saved successfully!",
  "success"
);
    }
  };


  return (
    <div className="app">
      {/* NOTIFICATION */}
{notification.show && (
  <div
    className={`notification ${notification.type}`}
  >
    {notification.message}
  </div>
)}

      <h1>
        AIMonk Nested Tags Tree
      </h1>

      <p className="backend-status">
        {backendMessage}
      </p>


      {/* ALL TREES */}
      {trees.map((treeItem, index) => (

        <div key={index}>

          <button
            className="export-btn"
            onClick={() =>
              handleExport(
                treeItem,
                index
              )
            }
          >
            Export JSON
          </button>


          <TagView
            node={treeItem.tree_data}
            setTree={(updatedTree) =>
              updateTreeAtIndex(
                index,
                updatedTree
              )
            }
          />

        </div>

      ))}


      {/* JSON OUTPUT */}
      {exportedJson && (
        <pre className="json-output">
          {exportedJson}
        </pre>
      )}

    </div>
  );
}

export default App;