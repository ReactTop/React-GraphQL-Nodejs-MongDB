import React from 'react';

import logo from './logo.svg';
import './App.css';


class App extends React.Component {

sendData =()=>{
  let requestBody ={
    query:`
    mutation{
      createEvent(eventInput:{title:"first test",description:"this is cool task",price:9999.9,date:"2020.2.3"}){
        title
        description
      }
    }
     `
  };
   fetch('http://localhost:8000/graphql',{
     method:'POST',
     body:JSON.stringify(requestBody),
     headers:{
       'Content-Type':'application/json'
     }
   }).then(res =>{
     if(res.status !==200 && res.status !==201){
       throw new Error('Failed!');
     }
     return res.json();
   })
   .then(resultData =>{
     console.log(resultData);

   }).catch(erro=>{
     console.log(erro);
   });
  }
render(){
  return (
    <div className="App">
       <button onClick={this.sendData} style={{width:200,height:200}}></button>
    </div>
  );
}

}

export default App;
