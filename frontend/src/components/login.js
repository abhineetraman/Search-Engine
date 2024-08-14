function Login() {
    //dynamic typing
    const onClick = () => {
        window.location.replace("/");
        console.log("It's going inside")
    }
    
    return (
      <div className="Login">
        <p style={{backgroundColor:"red"}}>There is new route to this page</p>
        <button onClick={()=> onClick()}>HOme</button>

      </div>
    );
  }
  
  export default Login;
  