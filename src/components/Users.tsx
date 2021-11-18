import { Link } from 'react-router-dom';
import { User } from '../utils/types';

export type UserProps = {
  users?: User[];
}

const Users = ({ users = [] }: UserProps) => {
  return(
    <ul>
      {users.map(user => (
        <li key={user.id}>
          <Link to={`/users/${user.id}`}>{user.name}</Link>
        </li>
      ))}
    </ul>
  );
}

export default Users;