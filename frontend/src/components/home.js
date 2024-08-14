import { useEffect, useState } from "react";

function Home() {
    //dynamic typic
    const [value, setValue] = useState([]);
    var value2 = 11;

    const list= [1,2,3,4,5]

    const onClick = () => {
        value2++;
        setValue(value+1)
        console.log("It's going inside")
    }
    const getData = () => {
        fetch('https://jsonplaceholder.typicode.com/posts')
        .then((response) => response.json())
        .then((json) => setValue(json));
    }

    useEffect(() => {
        getData();
    }, [])

    const filterData = () => {
        let new_val = value.filter((val) => val.id<5);
        setValue(new_val)
    }
    return (
      <div className="Login">
        There is new route to this page
        This is homepage
        
        <p> {value2} </p>

        
        <button onClick={()=> filterData()}>Add</button>

        <div>{value.map((val) => {
            return (
                <div key={val.id}>
                    <button>{val.title}</button>
                    <br></br>
                </div>
            )
        })}</div>

      </div>
    );
  }
  
  export default Home;
  