import { gql, useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ToDo } from '../utils/types';

const GET_USER = gql`
  query getUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      email
    }
  }
`;

const GET_TODOS = gql`
  query getToDos($id: ID!) {
    getToDos(userId: $id) {
      id
      title
      description
      completed
    }
  }
`;

const CREATE_TODO = gql`
  mutation createToDo($title: String!, $description: String!, $userId: ID!) {
    createToDo(title: $title, description: $description, userId: $userId) {
      id
    }}
`;

const MARK_TODO_COMPLETED = gql`
  mutation markToDoCompleted($id: ID!) {
    markToDoCompleted(id: $id) {
      id
    }}
`;

const User = () => {
  const { id } = useParams();
  const [showForm, setShowForm] = useState(false);
  const [todo, setTodo] = useState<ToDo>({
    title: '',
    description: '',
  });
  const { loading, error, data } = useQuery(GET_USER, { variables: { id } });
  const { loading: todoLoading, error: todoError, data: todoData, refetch } = useQuery(GET_TODOS, { variables: { id } });
  const [createTodo] = useMutation(CREATE_TODO, {
    variables: {
      ...todo,
      userId: id,
    }
  });
  const [setAsCompleted] = useMutation(MARK_TODO_COMPLETED)
  if (loading) return <p>Loading...</p>;
  if (todoLoading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  if (todoError) return <p>Error :(</p>;

  const handleButtonClick = () => {
    setShowForm(!showForm);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (todo.title && todo.description) {
      await createTodo();
      await refetch();
      setShowForm(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTodo({
      ...todo,
      [name]: value
    });
  }

  const setToDoAsCompleted = async (todoId?: number) => {
    await setAsCompleted({ variables: { id: todoId } });
    await refetch();
  }
  return (
    <div>
      <h1>User</h1>
      <p>User email: {data.getUser.email}</p>
      {todoData.getToDos.length > 0 ? (
        <>
          {todoData.getToDos.map((todo: ToDo) => (
            <div style={{border: '1px solid black'}} key={todo.id}>
              <p><h5>Title:</h5> {todo.title}</p>
              <p><h5>Description:</h5> {todo.description}</p>
              <p><h5>Status:</h5>{todo.completed ? 'Completed' : 'Not completed'}</p>
              {!todo.completed && <button onClick={() => setToDoAsCompleted(todo.id)}>Mark as completed</button>}
              </div>
          ))}
        </>
      ): (
        <h3>No ToDos</h3>
      )}
      { !showForm && <button onClick={handleButtonClick}>Add to do</button> }
        { showForm && <div>
          <form onSubmit={handleSubmit}>
            <input type="text" name='title' placeholder="title" onChange={handleChange} /><br/>
            <input type="text" name='description' placeholder="description" onChange={handleChange}  /><br/>
            <input type='submit' value='submit'/>
          </form>
        </div> }
    </div>
  )
}

export default User;