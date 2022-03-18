import { useContext, useEffect, useState, useCallback } from "react";

import { SyncContext } from "./Context/Sync";
import Input from "./Input";
import { STORE_DATA_KEY } from "./constants";

import DeleteIcon from "./icons/delete.jsx";

import "./list.scss";

const Card = ({ info, store }) => {
  const { updatedListItem } = useContext(SyncContext);
  const posts = Object.keys(store?.[info] ?? {}) ?? [];
  if (posts.length === 0) return null;
  return (
    <div className="card">
      <div className=" card__header">
        <div>{info || "Not available"}</div>
      </div>
      <div className="card__body">
        <ul
          className="card__body-elements"
          data-editor={"post-editor"}
          onClick={updatedListItem}
        >
          {posts.map((post) => {
            const { title, content } = store[info][post];

            return (
              <li
                key={title}
                data-url={info}
                data-post={post}
                className="d-flex align-items-center justify-content-space-between"
              >
                <span className="card__body-specific-title">{title} </span>
                <span data-action="delete">
                  <DeleteIcon className="cp" />
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

const List = () => {
  const [store, setStore] = useState({});
  const [filteredStore, setFilteredStore] = useState({});
  useEffect(() => {
    try {
      chrome.storage.sync.get("store", async (items) => {
        // Pass any observed errors down the promise chain.
        if (chrome.runtime.lastError) {
          return chrome.runtime.lastError;
        }

        setStore(items?.store ?? {});
        setFilteredStore(items?.store ?? {});
      });
      chrome.storage.onChanged.addListener(async (changes, namespace) => {
        const { newValue, oldValue } = changes[STORE_DATA_KEY];
        setStore(newValue ?? {});
        setFilteredStore(newValue ?? {});
      });
    } catch (e) {}
  }, []);

  //Filter the data based on keyword.
  //@TODO: update this logic with better search algorithm
  const onChange = useCallback(
    (e) => {
      const inputValue = e.target.value.toLocaleLowerCase();

      let finalStore = {};
      for (const [key, value] of Object.entries(store)) {
        if (key.toLocaleLowerCase().includes(inputValue)) {
          finalStore = { ...finalStore, [key]: value };
        } else {
          for (const [nestedKey, nestedValue] of Object.entries(value)) {
            const urlNotes = nestedValue?.content?.filter(
              (data) => data?.insert
            );
            if (
              urlNotes.includes(inputValue) ||
              nestedValue?.title?.toLocaleLowerCase()?.includes(inputValue)
            ) {
              finalStore = { ...finalStore, [key]: value };
            }
          }
        }
        setFilteredStore(finalStore);
      }
    },
    [store]
  );

  const availableData = Object.keys(filteredStore);

  return (
    <>
      <Input onChange={onChange} />
      {availableData.length === 0 ? (
        <h1>No Post found</h1>
      ) : (
        availableData.map((info) => {
          return <Card key={info} info={info} store={store} />;
        })
      )}
    </>
  );
};

export default List;
