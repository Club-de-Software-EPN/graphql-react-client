import { gql, useMutation, useQuery } from '@apollo/client'
import React, { useState } from 'react'
import './App.css'
import Users from './components/Users'
import { User } from './utils/types';

const GET_USERS = gql`
  query getUsers {
    getUsers {
      id
      name
      email
      password
    }
  }
`;

const CREATE_USER = gql`
  mutation createUser($name: String!, $email: String!, $password: String!) {
    createUser(name: $name, email: $email, password: $password) {
      id
    }
  }
`

function App() {
  const { loading, error: queryError, data: queryData , refetch } = useQuery(GET_USERS);
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState<User>({
    name: '',
    email: '',
    password: ''
  });
  const [createUser, {error: mutationError}] = useMutation(CREATE_USER, {
    variables: {
      ...user
    }
  });

  if (loading) return <p>Loading...</p>;
  if (queryError) return <p>Error: {queryError.message}</p>;
  if (mutationError) return <p>Error: {mutationError.message}</p>;

  const handleButtonClick = () => {
    setShowForm(!showForm);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user.name && user.email && user.password) {
      await createUser();
      await refetch();
      setShowForm(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    });
  }

  return (
    <>
      <header>
        <h1>Todo App</h1>
        { queryData && <Users users={[...queryData.getUsers]}/>}
        { !showForm && <button onClick={handleButtonClick}>Add user</button> }
        { showForm && <div>
          <form onSubmit={handleSubmit}>
            <input type="text" name='name' placeholder="name" onChange={handleChange} /><br/>
            <input type="text" name='email' placeholder="email" onChange={handleChange}  /><br/>
            <input type="text" name='password' placeholder="password" onChange={handleChange}  /><br/>
            <input type='submit' value='submit'/>
          </form>
        </div> }
      </header>
    </>
  )
}

export default App
