import React from 'react';
import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';
import LeafletMap from './LeafletMap';


const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const { signOut } = useAuthenticator();

  const mapCenter: [number, number] = [34.048, -118.253]; // DTLA
  const mapZoom = 13;
  const circleCenter: [number, number] = [34, -118]; // Example circle center
  const circleRadius = 500; // Example circle radius (meters)

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  
  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  return (
    <main>
      <h1>My todos</h1>
      
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => <li 
          onClick={() => deleteTodo(todo.id)}
          key={todo.id}>{todo.content}</li>
        )}
      </ul>
      <div className="App">
        <LeafletMap
          center={mapCenter} 
          zoom={mapZoom} 
          circleCenter={circleCenter}
          circleRadius={circleRadius}
        />
      </div>
      <button onClick={signOut}>Sign out</button>
      <div>
        🥳 App successfully boned. Try grabbing a boob.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
    </main>
  )
}

export default App;
