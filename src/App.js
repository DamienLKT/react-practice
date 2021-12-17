import Header from "./Header";
import Content from "./Content";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import AddItem from "./AddItem";
import SearchItem from "./SearchItem";
import apiRequest from "./apiRequest";

function App() {
  const API_URL = 'http://localhost:3500/items';
  
  //states
  const [items, setItems] = useState(
    // JSON.parse(localStorage.getItem("shoppinglist")) || []
    []
  );
  const [newItem, setNewItem] = useState("");
  const [search, setSearch] = useState("");
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  //set items to shoppinglist array when items dependencies change even
  //with empty array for new users w/o shoppinglist
  // useEffect(() => {
  //   localStorage.setItem("shoppinglist", JSON.stringify(items));
  // }, [items]);

  //only occur at loadtime at the start because of []
  useEffect(() => {
    // READ: fetchItems not redefined at every component, only in useEffect 
    const fetchItems = async () => {
      try {
        const response = await fetch(API_URL);//response is in JSON
        if (!response.ok) throw Error('Did not receive expected data');
        const listItems =await response.json(); //take JSON as input and parse to produce JS object
        // console.log(listItems);
        setItems(listItems);
        setFetchError(null);
      } catch(err) {        
        setFetchError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    //simulate loading time for 2s
    setTimeout(() => {
      (async () => await fetchItems())(); //async call to fetch items
    }, 2000)
    
  }, []);

  //CREATE FUNC
  const addItem = async (item) => {
    const id = items.length ? items[items.length - 1].id + 1 : 1; // assign item latest id
    const myNewItem = { id, checked: false, item }; //object property
    const listItems = [...items, myNewItem]; //assign latest item to array
    setItems(listItems);//update state

    const postOptions = { //pass into optionsObj at apiRequest
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify(myNewItem)
    }
    //for error catching
    const result = await apiRequest(API_URL, postOptions);
    if (result) setFetchError(result); //if msg is not null, display err msg in apiRequest
  };

  //UPDATE FUNC
  const handleCheck = async (id) => {
    const listItems = items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setItems(listItems);

    const myItem = listItems.filter((item) => item.id === id);
    const updateOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ checked: myItem[0].checked }) //filter only returns 1 item so [0]
    };

    const reqUrl = `${API_URL}/${id}`;//append /id to api_url to update
    const result = await apiRequest(reqUrl, updateOptions);
    if (result) setFetchError(result);
  }

  //DELETE FUNC
  const handleDelete = async (id) => {
    const listItems = items.filter((item) => item.id !== id); //return the items that doesn't match the id clicked
    setItems(listItems);

    const deleteOptions = { method: 'DELETE' };
    const reqUrl = `${API_URL}/${id}`;
    const result = await apiRequest(reqUrl, deleteOptions);
    if (result) setFetchError(result);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItem) return;
    // console.log(newItem);
    addItem(newItem);
    setNewItem(""); //setNewItem as empty
  };

  return (
    <div className="App">
      <Header title="Grocery List" />
      <AddItem
        newItem={newItem}
        setNewItem={setNewItem}
        handleSubmit={handleSubmit}
      />
      <SearchItem 
        search={search}
        setSearch={setSearch}
      />
      <main>
        {isLoading && <p>Loading Items...</p>}
        {fetchError && <p style={{ color: "red"}}>{`Error: ${fetchError}`}</p>}
        {!fetchError && !isLoading && <Content //if no error and no loading display content
          items={items.filter((item) =>
            item.item.toLowerCase().includes(search.toLowerCase())
          )}
          setItems={setItems}
          handleCheck={handleCheck}
          handleDelete={handleDelete}
        />}
      </main>      
      <Footer length={items.length} />
    </div>
  );
}

export default App;
